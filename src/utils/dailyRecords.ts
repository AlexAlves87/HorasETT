import { DailyRecord, MonthlyTotals } from "@/types/dailyRecord";
import { format } from "date-fns";

const STORAGE_KEY = "horasett_daily_records";

export const getDailyRecords = (): DailyRecord[] => {
  const stored = localStorage.getItem(STORAGE_KEY);
  return stored ? JSON.parse(stored) : [];
};

export const saveDailyRecord = (record: DailyRecord): void => {
  const records = getDailyRecords();
  const existingIndex = records.findIndex(r => r.date === record.date);
  
  if (existingIndex >= 0) {
    records[existingIndex] = record;
  } else {
    records.push(record);
  }
  
  localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
};

export const getDailyRecord = (date: Date): DailyRecord | null => {
  const dateStr = format(date, "yyyy-MM-dd");
  const records = getDailyRecords();
  return records.find(r => r.date === dateStr) || null;
};

export const deleteDailyRecord = (date: string): void => {
  const records = getDailyRecords();
  const filtered = records.filter(r => r.date !== date);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
};

export const getMonthlyTotals = (year: number, month: number): MonthlyTotals => {
  const records = getDailyRecords();
  const monthStr = `${year}-${String(month + 1).padStart(2, "0")}`;
  
  const monthRecords = records.filter(r => r.date.startsWith(monthStr));
  
  return monthRecords.reduce(
    (totals, record) => ({
      horasNormales: totals.horasNormales + record.horasNormales,
      horasNocturnas: totals.horasNocturnas + record.horasNocturnas,
      horasFestivas: totals.horasFestivas + record.horasFestivas,
      horasExtras: totals.horasExtras + record.horasExtras,
    }),
    { horasNormales: 0, horasNocturnas: 0, horasFestivas: 0, horasExtras: 0 }
  );
};

// Nueva función para historial mensual
export const getMonthlyHistory = (months: number = 6): {
  month: string;
  year: number;
  monthNumber: number;
  totals: MonthlyTotals;
}[] => {
  const records = getDailyRecords();
  const now = new Date();
  const history = [];

  for (let i = months - 1; i >= 0; i--) {
    const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const year = date.getFullYear();
    const month = date.getMonth();
    const monthStr = `${year}-${String(month + 1).padStart(2, '0')}`;
    
    const monthRecords = records.filter(r => r.date.startsWith(monthStr));
    
    const totals = monthRecords.reduce(
      (acc, reg) => ({
        horasNormales: acc.horasNormales + (reg.horasNormales || 0),
        horasExtras: acc.horasExtras + (reg.horasExtras || 0),
        horasNocturnas: acc.horasNocturnas + (reg.horasNocturnas || 0),
        horasFestivas: acc.horasFestivas + (reg.horasFestivas || 0),
      }),
      { horasNormales: 0, horasExtras: 0, horasNocturnas: 0, horasFestivas: 0 }
    );

    history.push({
      month: date.toLocaleDateString('es-ES', { month: 'short' }),
      year: year,
      monthNumber: month,
      totals
    });
  }

  return history;
};