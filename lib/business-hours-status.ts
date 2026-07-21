import type { BusinessHourDayDTO, BusinessHourShiftDTO } from "@/lib/types";
import { DAY_LABELS } from "@/lib/business-hours-constants";

export const STORE_TIMEZONE = "America/Sao_Paulo";

const WEEKDAY_TO_INDEX: Record<string, number> = {
  Sun: 0,
  Mon: 1,
  Tue: 2,
  Wed: 3,
  Thu: 4,
  Fri: 5,
  Sat: 6,
};

function getNowInStoreTimezone(now: Date) {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: STORE_TIMEZONE,
    weekday: "short",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(now);

  const weekday = parts.find((p) => p.type === "weekday")?.value ?? "Sun";
  const year = parts.find((p) => p.type === "year")?.value ?? "1970";
  const month = parts.find((p) => p.type === "month")?.value ?? "01";
  const day = parts.find((p) => p.type === "day")?.value ?? "01";
  const hour = parts.find((p) => p.type === "hour")?.value ?? "00";
  const minute = parts.find((p) => p.type === "minute")?.value ?? "00";

  return {
    dayOfWeek: WEEKDAY_TO_INDEX[weekday] ?? 0,
    date: `${year}-${month}-${day}`,
    time: `${hour}:${minute}`,
  };
}

// Data de "hoje" (yyyy-mm-dd) no fuso da loja — usada tanto para calcular o
// status de funcionamento quanto para gravar/comparar o fechamento manual,
// já que ele vale só para o dia em que o admin apertou o botão.
export function getTodayDateInStoreTimezone(now: Date = new Date()): string {
  return getNowInStoreTimezone(now).date;
}

export type BusinessHoursStatus = {
  hasAnyHours: boolean;
  isOpenNow: boolean;
  isManuallyClosedToday: boolean;
  todayLabel: string;
  todayShifts: BusinessHourShiftDTO[];
};

export function getBusinessHoursStatus(
  days: BusinessHourDayDTO[],
  manuallyClosedDate: string | null = null,
  now: Date = new Date()
): BusinessHoursStatus {
  const hasAnyHours = days.some((d) => d.shifts.length > 0);
  const { dayOfWeek, date, time } = getNowInStoreTimezone(now);
  const today = days.find((d) => d.dayOfWeek === dayOfWeek);
  const isManuallyClosedToday = manuallyClosedDate === date;
  const isOpenNow =
    !isManuallyClosedToday &&
    Boolean(today?.isOpen && today.shifts.some((s) => time >= s.openTime && time < s.closeTime));

  return {
    hasAnyHours,
    isOpenNow,
    isManuallyClosedToday,
    todayLabel: DAY_LABELS[dayOfWeek],
    todayShifts: today?.shifts ?? [],
  };
}

export function formatShiftsList(shifts: BusinessHourShiftDTO[]): string {
  return shifts.map((s) => `${s.openTime}–${s.closeTime}`).join(", ");
}
