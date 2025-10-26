export interface DailyRecord {
  date: string; // formato YYYY-MM-DD
  horasNormales: number;
  horasNocturnas: number;
  horasFestivas: number;
  horasExtras: number;
  notas?: string;
  turno?: 'mañana' | 'tarde' | 'noche';
}

export interface MonthlyTotals {
  horasNormales: number;
  horasNocturnas: number;
  horasFestivas: number;
  horasExtras: number;
}
