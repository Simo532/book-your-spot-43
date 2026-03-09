import { format as fnsFormat } from 'date-fns';

/** App-wide timezone — all displayed times use this */
export const APP_TIMEZONE = 'Africa/Casablanca';

/** Format a Date or ISO string to a localized time string (HH:mm) */
export function formatTime(date: string | Date, locale = 'fr'): string {
  return new Date(date).toLocaleTimeString(locale, {
    hour: '2-digit',
    minute: '2-digit',
    timeZone: APP_TIMEZONE,
  });
}

/** Format a Date or ISO string to a localized date string */
export function formatDate(date: string | Date, locale = 'fr'): string {
  return new Date(date).toLocaleDateString(locale, { timeZone: APP_TIMEZONE });
}

/** Format a Date or ISO string to a full localized date+time string */
export function formatDateTime(date: string | Date, locale = 'fr'): string {
  return new Date(date).toLocaleString(locale, { timeZone: APP_TIMEZONE });
}

/** Get current date/time in Africa/Casablanca as a formatted string */
export function nowInTimezone(): string {
  return new Date().toLocaleString('fr', { timeZone: APP_TIMEZONE });
}
