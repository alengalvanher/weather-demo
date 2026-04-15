import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subject, debounceTime, distinctUntilChanged, switchMap, catchError, of, filter } from 'rxjs';
import { Geolocation } from '@capacitor/geolocation';

import { GeocodingService } from './services/geocoding.service';
import { WeatherService } from './services/weather.service';
import { ForecastResponse, GeocodingResult, LocationInfo } from './models/weather.models';
import { WeatherIconComponent } from './components/weather-icon/weather-icon.component';
import { dayName, getWeatherInfo } from './utils/weather-codes';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule, WeatherIconComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  private geocoding = inject(GeocodingService);
  private weather = inject(WeatherService);

  query = '';
  suggestions = signal<GeocodingResult[]>([]);
  searching = signal(false);
  showSuggestions = signal(false);

  location = signal<LocationInfo | null>(null);
  forecast = signal<ForecastResponse | null>(null);
  loading = signal(false);
  errorMsg = signal<string | null>(null);

  private searchSubject = new Subject<string>();

  current = computed(() => {
    const f = this.forecast();
    if (!f) return null;
    return {
      ...f.current,
      info: getWeatherInfo(f.current.weather_code, f.current.is_day)
    };
  });

  daily = computed(() => {
    const f = this.forecast();
    if (!f) return [];
    return f.daily.time.map((date, i) => ({
      date,
      day: i === 0 ? 'Hoy' : dayName(date),
      max: Math.round(f.daily.temperature_2m_max[i]),
      min: Math.round(f.daily.temperature_2m_min[i]),
      precip: f.daily.precipitation_probability_max?.[i] ?? 0,
      info: getWeatherInfo(f.daily.weather_code[i], 1)
    }));
  });

  background = computed(() => {
    const c = this.current();
    return c?.info.gradient ?? 'linear-gradient(160deg, #2980b9 0%, #6dd5fa 100%)';
  });

  constructor() {
    this.searchSubject.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      filter(q => q.trim().length >= 2),
      switchMap(q => {
        this.searching.set(true);
        return this.geocoding.searchCities(q).pipe(
          catchError(() => of([] as GeocodingResult[]))
        );
      })
    ).subscribe(results => {
      this.suggestions.set(results);
      this.searching.set(false);
      this.showSuggestions.set(true);
    });
  }

  onQueryChange(value: string): void {
    this.query = value;
    if (!value.trim()) {
      this.suggestions.set([]);
      this.showSuggestions.set(false);
      return;
    }
    this.searchSubject.next(value);
  }

  selectCity(city: GeocodingResult): void {
    const loc: LocationInfo = {
      name: city.name,
      country: city.country,
      admin1: city.admin1,
      latitude: city.latitude,
      longitude: city.longitude
    };
    this.query = city.name;
    this.suggestions.set([]);
    this.showSuggestions.set(false);
    this.loadForecast(loc);
  }

  async useMyLocation(): Promise<void> {
    this.errorMsg.set(null);
    this.loading.set(true);
    try {
      const perm = await Geolocation.checkPermissions().catch(() => null);
      if (perm && perm.location !== 'granted') {
        await Geolocation.requestPermissions().catch(() => null);
      }
      const pos = await Geolocation.getCurrentPosition({
        enableHighAccuracy: false,
        timeout: 10000
      });
      const lat = pos.coords.latitude;
      const lon = pos.coords.longitude;
      // Reverse-resolve city name via geocoding (best-effort)
      const cities = await new Promise<GeocodingResult[]>((resolve) => {
        this.geocoding.searchCities(`${lat.toFixed(2)},${lon.toFixed(2)}`).subscribe({
          next: r => resolve(r),
          error: () => resolve([])
        });
      });
      const loc: LocationInfo = {
        name: cities[0]?.name ?? 'Mi ubicacion',
        country: cities[0]?.country,
        admin1: cities[0]?.admin1,
        latitude: lat,
        longitude: lon
      };
      this.loadForecast(loc);
    } catch (err: any) {
      this.loading.set(false);
      this.errorMsg.set('No se pudo obtener la ubicacion. Revisa los permisos.');
    }
  }

  private loadForecast(loc: LocationInfo): void {
    this.location.set(loc);
    this.errorMsg.set(null);
    this.loading.set(true);
    this.weather.getForecast(loc.latitude, loc.longitude).subscribe({
      next: data => {
        this.forecast.set(data);
        this.loading.set(false);
      },
      error: () => {
        this.errorMsg.set('No se pudo obtener el clima. Intenta de nuevo.');
        this.loading.set(false);
      }
    });
  }

  hideSuggestionsSoon(): void {
    setTimeout(() => this.showSuggestions.set(false), 150);
  }

  formatLocation(loc: LocationInfo): string {
    const parts = [loc.name];
    if (loc.admin1 && loc.admin1 !== loc.name) parts.push(loc.admin1);
    if (loc.country) parts.push(loc.country);
    return parts.join(', ');
  }
}
