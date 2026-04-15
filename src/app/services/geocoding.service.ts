import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { GeocodingResponse, GeocodingResult } from '../models/weather.models';

@Injectable({ providedIn: 'root' })
export class GeocodingService {
  private http = inject(HttpClient);
  private readonly baseUrl = 'https://geocoding-api.open-meteo.com/v1/search';

  searchCities(query: string, limit = 5): Observable<GeocodingResult[]> {
    const url = `${this.baseUrl}?name=${encodeURIComponent(query)}&count=${limit}&language=es&format=json`;
    return this.http.get<GeocodingResponse>(url).pipe(
      map(res => res.results ?? [])
    );
  }
}
