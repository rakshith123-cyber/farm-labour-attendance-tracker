import type { AttendanceRecord } from '../backend';
import { AttendanceStatus } from '../backend';

export interface PayrollTotals {
  fullDays: number;
  halfDays: number;
  morningEveningDays: number;
  effectiveDays: number;
  payable: number;
}

export function calculatePayroll(records: AttendanceRecord[], dailyWage: number): PayrollTotals {
  let fullDays = 0;
  let halfDays = 0;
  let morningEveningDays = 0;

  records.forEach((record) => {
    switch (record.status) {
      case AttendanceStatus.full:
        fullDays++;
        break;
      case AttendanceStatus.half:
        halfDays++;
        break;
      case AttendanceStatus.morningEvening:
        morningEveningDays++;
        break;
    }
  });

  // Calculate effective days: full = 1, half = 0.5, morning-evening = 1
  const effectiveDays = fullDays + halfDays * 0.5 + morningEveningDays;

  // Calculate payable: full × wage + half × (wage/2) + morning-evening × wage
  const payable = fullDays * dailyWage + halfDays * (dailyWage / 2) + morningEveningDays * dailyWage;

  return {
    fullDays,
    halfDays,
    morningEveningDays,
    effectiveDays,
    payable,
  };
}
