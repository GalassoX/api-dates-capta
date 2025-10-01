import { localIsoDate } from "../utils/dates";
import { readFileSync } from "fs";
import { join } from "path";

let holidays: string[] = [];

async function getHolidays(): Promise<string[]> {  
  const jsonPath = join(process.cwd(), "data", "holidays.json");
  const raw = readFileSync(jsonPath, "utf-8");
  holidays = JSON.parse(raw);
  return holidays;
}

export async function isBusinessDay(date: Date): Promise<boolean> {
  const day = date.getDay(); // 0 = domingo, 6 = sábado
  if (day === 0 || day === 6) return false;
  const iso = localIsoDate(date);
  const holidays = await getHolidays();
  return !holidays.includes(iso);
}

export async function addBusinessDays(date: Date, days: number): Promise<Date> {
  const d = new Date(date);
  for (let i = 0; i < days; i++) {
    do {
      d.setDate(d.getDate() + 1);
    } while (!isBusinessDay(d));
    d.setHours(8, 0, 0, 0);
  }
  return d;
}

export async function addBusinessHours(date: Date, hours: number): Promise<Date> {
  let d = new Date(date);

  while (hours > 0) {
    const hour = d.getHours();

    if (hour < 8) {
      d.setHours(8, 0, 0, 0);
    } else if (hour >= 17) {
      d = await addBusinessDays(d, 1);
    } else if (hour === 12) {
      d.setHours(13, 0, 0, 0);
    }

    if (!(await isBusinessDay(d))) {
      d = await addBusinessHours(await addBusinessDays(d, 1), hours);
      continue;
    }

    const h2 = d.getHours();
    const blockEnd = (h2 < 12) ? 12 : 17;
    const hoursAvailable = blockEnd - h2;

    if (hours <= hoursAvailable) {
      d.setHours(h2 + hours, d.getMinutes(), d.getSeconds(), 0);
      hours = 0;
    } else {
      hours -= hoursAvailable;
      d.setHours(blockEnd, 0, 0, 0);
    }
  }

  return d;
}

export function clampToBusinessHoursBackward(dateCol: Date): Date {
  let d = new Date(dateCol);

  while (!isBusinessDay(d)) {
    d.setDate(d.getDate() - 1);
    d.setHours(17, 0, 0, 0);
  }

  const h = d.getHours();
  const min = d.getMinutes();
  const sec = d.getSeconds();

  if (h > 17 || (h === 17 && (min > 0 || sec > 0))) {
    d.setHours(17, 0, 0, 0);
  }
  else if (h < 8) {
    d.setHours(8, 0, 0, 0);
  }
  else if (h === 12) {
    d.setHours(13, 0, 0, 0);
  }
  else if (h === 11 && min > 59) {
    d.setHours(13, 0, 0, 0);
  }

  return d;
}