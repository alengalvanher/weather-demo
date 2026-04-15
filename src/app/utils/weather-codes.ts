// WMO Weather interpretation codes (used by Open-Meteo)
// https://open-meteo.com/en/docs

export interface WeatherInfo {
  description: string;
  icon: string;
  gradient: string;
}

const codeMap: Record<number, { description: string; icon: string }> = {
  0:  { description: 'Despejado',                    icon: 'sun' },
  1:  { description: 'Mayormente despejado',         icon: 'sun' },
  2:  { description: 'Parcialmente nublado',         icon: 'cloud-sun' },
  3:  { description: 'Nublado',                      icon: 'cloud' },
  45: { description: 'Niebla',                       icon: 'fog' },
  48: { description: 'Niebla con escarcha',          icon: 'fog' },
  51: { description: 'Llovizna ligera',              icon: 'drizzle' },
  53: { description: 'Llovizna moderada',            icon: 'drizzle' },
  55: { description: 'Llovizna densa',               icon: 'rain' },
  56: { description: 'Llovizna helada ligera',       icon: 'sleet' },
  57: { description: 'Llovizna helada densa',        icon: 'sleet' },
  61: { description: 'Lluvia ligera',                icon: 'rain' },
  63: { description: 'Lluvia moderada',              icon: 'rain' },
  65: { description: 'Lluvia intensa',               icon: 'rain' },
  66: { description: 'Lluvia helada ligera',         icon: 'sleet' },
  67: { description: 'Lluvia helada intensa',        icon: 'sleet' },
  71: { description: 'Nevada ligera',                icon: 'snow' },
  73: { description: 'Nevada moderada',              icon: 'snow' },
  75: { description: 'Nevada intensa',               icon: 'snow' },
  77: { description: 'Granos de nieve',              icon: 'snow' },
  80: { description: 'Chubascos ligeros',            icon: 'rain' },
  81: { description: 'Chubascos moderados',          icon: 'rain' },
  82: { description: 'Chubascos violentos',          icon: 'storm' },
  85: { description: 'Chubascos de nieve ligeros',   icon: 'snow' },
  86: { description: 'Chubascos de nieve intensos',  icon: 'snow' },
  95: { description: 'Tormenta',                     icon: 'storm' },
  96: { description: 'Tormenta con granizo ligero',  icon: 'storm' },
  99: { description: 'Tormenta con granizo intenso', icon: 'storm' }
};

const iconChar: Record<string, { day: string; night: string }> = {
  'sun':       { day: 'sun',       night: 'moon' },
  'cloud-sun': { day: 'cloud-sun', night: 'cloud-moon' },
  'cloud':     { day: 'cloud',     night: 'cloud' },
  'fog':       { day: 'fog',       night: 'fog' },
  'drizzle':   { day: 'drizzle',   night: 'drizzle' },
  'rain':      { day: 'rain',      night: 'rain' },
  'sleet':     { day: 'sleet',     night: 'sleet' },
  'snow':      { day: 'snow',      night: 'snow' },
  'storm':     { day: 'storm',     night: 'storm' }
};

export function getWeatherInfo(code: number, isDay = 1): WeatherInfo {
  const entry = codeMap[code] ?? { description: 'Desconocido', icon: 'cloud' };
  const variant = iconChar[entry.icon] ?? { day: entry.icon, night: entry.icon };
  const icon = isDay ? variant.day : variant.night;
  return {
    description: entry.description,
    icon,
    gradient: gradientFor(code, isDay)
  };
}

function gradientFor(code: number, isDay: number): string {
  if (!isDay) {
    return 'linear-gradient(160deg, #1a2a6c 0%, #2c3e50 60%, #1a1a2e 100%)';
  }
  if (code === 0 || code === 1) {
    return 'linear-gradient(160deg, #2980b9 0%, #6dd5fa 60%, #ffd54f 100%)';
  }
  if (code === 2 || code === 3) {
    return 'linear-gradient(160deg, #485563 0%, #29323c 100%)';
  }
  if (code >= 45 && code <= 48) {
    return 'linear-gradient(160deg, #757f9a 0%, #d7dde8 100%)';
  }
  if ((code >= 51 && code <= 67) || (code >= 80 && code <= 82)) {
    return 'linear-gradient(160deg, #373B44 0%, #4286f4 100%)';
  }
  if ((code >= 71 && code <= 77) || (code >= 85 && code <= 86)) {
    return 'linear-gradient(160deg, #83a4d4 0%, #b6fbff 100%)';
  }
  if (code >= 95) {
    return 'linear-gradient(160deg, #232526 0%, #414345 100%)';
  }
  return 'linear-gradient(160deg, #2980b9 0%, #6dd5fa 100%)';
}

export function dayName(dateStr: string): string {
  const date = new Date(dateStr);
  const days = ['Dom', 'Lun', 'Mar', 'Mie', 'Jue', 'Vie', 'Sab'];
  return days[date.getDay()];
}
