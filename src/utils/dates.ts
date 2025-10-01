import constants from "../config";

export function toColombia(dateUtc: Date): Date {
  const iso = dateUtc.toLocaleString('sv', { timeZone: constants.COLOMBIA_TZ, hour12: false });
  const [date, time] = iso.split(' ');
  return new Date(`${date}T${time}-05:00`);
}

/** Convierte un Date (ya local Colombia) a UTC ISO 8601 */
export function toUtcIso(dateCol: Date): string {
  return dateCol.toISOString().replace(".000Z", "Z");
}

/** Obtiene la parte YYYY-MM-DD de un Date (zona local Colombia) */
export function localIsoDate(dateCol: Date): string {
  const y = dateCol.getFullYear();
  const m = String(dateCol.getMonth() + 1).padStart(2, "0");
  const d = String(dateCol.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}