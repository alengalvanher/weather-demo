# Weather Demo

App de clima para Android construida con **Angular 18 + Capacitor 7**, datos en vivo de [Open-Meteo](https://open-meteo.com) (sin API key).

Pensada como demo: no requiere registro, no requiere API keys, y el APK se compila gratis con GitHub Actions (no necesitas instalar Android Studio en tu máquina).

## Funcionalidades

- Búsqueda de ciudades con autocompletado (geocoding de Open-Meteo)
- Botón "usar mi ubicación" (Capacitor Geolocation, con permisos nativos)
- Tarjeta del clima actual: temperatura, sensación térmica, condición, humedad, viento
- Pronóstico de 7 días con íconos SVG y probabilidad de precipitación
- Fondo dinámico (gradiente) según la condición del clima y si es de día/noche

## Stack

| Capa | Tecnología |
|------|-----------|
| UI / Lógica | Angular 18 (standalone components, signals, control flow `@if` / `@for`) |
| Wrapper nativo | Capacitor 7 + plugin `@capacitor/geolocation` |
| Datos clima | Open-Meteo (forecast + geocoding APIs, sin API key) |
| Build APK | GitHub Actions (Ubuntu + JDK 21 + Android SDK) |

## Estructura

```
src/app/
├── components/weather-icon/   # Íconos SVG inline (sun, cloud, rain, etc.)
├── models/weather.models.ts   # Tipos: ForecastResponse, GeocodingResult...
├── services/
│   ├── geocoding.service.ts   # Búsqueda de ciudades
│   └── weather.service.ts     # Pronóstico actual + 7 días
├── utils/weather-codes.ts     # Mapping códigos WMO → ícono/descripción/gradiente
├── app.component.ts/html/scss # Pantalla principal
└── app.config.ts              # Provee HttpClient
```

## Desarrollo local (web)

```bash
npm install
npm start
# abre http://localhost:4200
```

La app funciona igual en navegador. La geolocalización usa la API web del navegador en este caso.

## Generar el APK con GitHub Actions (sin Android Studio)

Como no tienes Android Studio / JDK localmente, el APK se compila en la nube:

1. **Crea un repo en GitHub** (privado o público) y sube este proyecto:
   ```bash
   cd C:\demos\weather-app
   git init
   git add .
   git commit -m "initial weather demo"
   git branch -M main
   git remote add origin https://github.com/<tu-usuario>/<tu-repo>.git
   git push -u origin main
   ```
2. El push dispara automáticamente el workflow `.github/workflows/build-apk.yml`. También puedes correrlo manualmente desde la pestaña **Actions → Build Android APK → Run workflow**.
3. Cuando termine (≈5–8 min), abre el run y descarga el artifact **`weather-demo-debug-apk`**. Dentro está `app-debug.apk`.

## Instalar el APK en tu dispositivo Android

1. Copia `app-debug.apk` al teléfono (USB, drive, email, etc.).
2. En el teléfono: **Ajustes → Seguridad → Instalar apps de fuentes desconocidas** (habilita para tu navegador o explorador de archivos).
3. Abre el `.apk` desde el explorador de archivos y acepta la instalación.
4. Al abrir la app por primera vez y pulsar el botón de ubicación, Android pedirá permiso de localización.

> El APK es de tipo **debug**, sirve perfecto para una demo. Para distribución pública (Play Store) habría que firmarlo como release.

## Reconstruir tras cambios

Si modificas código Angular y luego quieres actualizar el APK:

```bash
npx ng build --configuration=production
npx cap sync android
git add -A && git commit -m "..." && git push   # dispara nuevo build en Actions
```

## Endpoints usados (Open-Meteo)

- Geocoding: `https://geocoding-api.open-meteo.com/v1/search?name=<ciudad>&count=5&language=es`
- Forecast: `https://api.open-meteo.com/v1/forecast?latitude=<lat>&longitude=<lon>&current=...&daily=...&timezone=auto&forecast_days=7`

Sin límites estrictos para uso no comercial, sin API key, sin registro.

## Troubleshooting

- **El workflow falla en "Build debug APK"** → revisa el log; suele ser un error de Gradle por desalineamiento de versiones de SDK. La acción `android-actions/setup-android@v3` instala una versión actual por defecto que es compatible con Capacitor 7.
- **El APK abre y se queda en blanco** → corre `npx cap sync android` antes de subir cambios; suele ser que el `webDir` no se copió.
- **La geolocalización no funciona** → revisa que diste permisos en el primer prompt. Si los rechazaste, ve a Ajustes → Apps → Weather Demo → Permisos y habilita Ubicación.
