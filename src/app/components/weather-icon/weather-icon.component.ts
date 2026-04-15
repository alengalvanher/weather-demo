import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-weather-icon',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <svg [attr.width]="size" [attr.height]="size" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" [attr.aria-label]="icon">
      <ng-container [ngSwitch]="icon">

        <g *ngSwitchCase="'sun'">
          <circle cx="32" cy="32" r="12" fill="#FFD54F"/>
          <g stroke="#FFD54F" stroke-width="3" stroke-linecap="round">
            <line x1="32" y1="6"  x2="32" y2="14"/>
            <line x1="32" y1="50" x2="32" y2="58"/>
            <line x1="6"  y1="32" x2="14" y2="32"/>
            <line x1="50" y1="32" x2="58" y2="32"/>
            <line x1="13" y1="13" x2="19" y2="19"/>
            <line x1="45" y1="45" x2="51" y2="51"/>
            <line x1="13" y1="51" x2="19" y2="45"/>
            <line x1="45" y1="19" x2="51" y2="13"/>
          </g>
        </g>

        <g *ngSwitchCase="'moon'">
          <path d="M44 38a18 18 0 1 1-18-26 14 14 0 0 0 18 26z" fill="#E0E7FF"/>
        </g>

        <g *ngSwitchCase="'cloud-sun'">
          <circle cx="22" cy="22" r="8" fill="#FFD54F"/>
          <path d="M48 44H22a10 10 0 1 1 2-19.7A12 12 0 0 1 48 30a7 7 0 0 1 0 14z" fill="#E5EAF0" stroke="#B8C2CC" stroke-width="1.5"/>
        </g>

        <g *ngSwitchCase="'cloud-moon'">
          <path d="M30 22a10 10 0 0 0 10 10 8 8 0 1 1-10-10z" fill="#E0E7FF"/>
          <path d="M48 46H22a10 10 0 1 1 2-19.7A12 12 0 0 1 48 32a7 7 0 0 1 0 14z" fill="#CBD5E1" stroke="#94A3B8" stroke-width="1.5"/>
        </g>

        <g *ngSwitchCase="'cloud'">
          <path d="M48 44H18a10 10 0 1 1 2-19.7A12 12 0 0 1 44 30a7 7 0 0 1 4 14z" fill="#E5EAF0" stroke="#B8C2CC" stroke-width="1.5"/>
        </g>

        <g *ngSwitchCase="'fog'">
          <path d="M48 36H18a10 10 0 1 1 2-19.7A12 12 0 0 1 44 22a7 7 0 0 1 4 14z" fill="#E5EAF0" stroke="#B8C2CC" stroke-width="1.5"/>
          <g stroke="#B8C2CC" stroke-width="3" stroke-linecap="round">
            <line x1="12" y1="46" x2="52" y2="46"/>
            <line x1="16" y1="54" x2="48" y2="54"/>
          </g>
        </g>

        <g *ngSwitchCase="'drizzle'">
          <path d="M48 36H18a10 10 0 1 1 2-19.7A12 12 0 0 1 44 22a7 7 0 0 1 4 14z" fill="#E5EAF0" stroke="#B8C2CC" stroke-width="1.5"/>
          <g stroke="#3B82F6" stroke-width="3" stroke-linecap="round">
            <line x1="22" y1="44" x2="20" y2="50"/>
            <line x1="32" y1="44" x2="30" y2="50"/>
            <line x1="42" y1="44" x2="40" y2="50"/>
          </g>
        </g>

        <g *ngSwitchCase="'rain'">
          <path d="M48 34H18a10 10 0 1 1 2-19.7A12 12 0 0 1 44 20a7 7 0 0 1 4 14z" fill="#9CA3AF" stroke="#6B7280" stroke-width="1.5"/>
          <g stroke="#3B82F6" stroke-width="3" stroke-linecap="round">
            <line x1="20" y1="42" x2="16" y2="54"/>
            <line x1="30" y1="42" x2="26" y2="54"/>
            <line x1="40" y1="42" x2="36" y2="54"/>
            <line x1="48" y1="42" x2="44" y2="54"/>
          </g>
        </g>

        <g *ngSwitchCase="'sleet'">
          <path d="M48 34H18a10 10 0 1 1 2-19.7A12 12 0 0 1 44 20a7 7 0 0 1 4 14z" fill="#9CA3AF" stroke="#6B7280" stroke-width="1.5"/>
          <g stroke="#3B82F6" stroke-width="3" stroke-linecap="round">
            <line x1="22" y1="42" x2="20" y2="50"/>
            <line x1="42" y1="42" x2="40" y2="50"/>
          </g>
          <circle cx="32" cy="50" r="2" fill="#FFFFFF" stroke="#3B82F6" stroke-width="1"/>
        </g>

        <g *ngSwitchCase="'snow'">
          <path d="M48 34H18a10 10 0 1 1 2-19.7A12 12 0 0 1 44 20a7 7 0 0 1 4 14z" fill="#E5EAF0" stroke="#B8C2CC" stroke-width="1.5"/>
          <g fill="#FFFFFF" stroke="#3B82F6" stroke-width="1">
            <circle cx="22" cy="48" r="2.5"/>
            <circle cx="32" cy="52" r="2.5"/>
            <circle cx="42" cy="48" r="2.5"/>
          </g>
        </g>

        <g *ngSwitchCase="'storm'">
          <path d="M48 30H18a10 10 0 1 1 2-19.7A12 12 0 0 1 44 16a7 7 0 0 1 4 14z" fill="#4B5563" stroke="#1F2937" stroke-width="1.5"/>
          <path d="M30 34l-6 12h6l-2 12 12-16h-7l4-8z" fill="#FACC15" stroke="#CA8A04" stroke-width="1"/>
        </g>

      </ng-container>
    </svg>
  `
})
export class WeatherIconComponent {
  @Input() icon = 'cloud';
  @Input() size = 96;
}
