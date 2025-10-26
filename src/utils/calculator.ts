// src/utils/calculator.ts

import { Config } from './storage';
import { DailyRecord } from '@/types/dailyRecord';

export interface CalculationResult {
  // Totales de horas
  totalHoras: number;
  horasNormales: number;
  horasExtra: number;
  horasNocturnas: number;
  horasFestivas: number;
  
  // Importes económicos
  bruto: number;
  irpf: number;
  ss: number;
  neto: number;
  
  // Desglose por tipo de hora (para tablas)
  detalleHoras: {
    concepto: string;
    horas: number;
    tarifa: number;
    importe: number;
  }[];
  
  // Desglose de deducciones (para tablas)
  detalleDeducciones: {
    concepto: string;
    porcentaje: number;
    importe: number;
  }[];
  
  // Datos para gráfico circular (SOLO DEDUCCIONES, sin bruto)
  chartData: {
    name: string;
    value: number;
    color: string;
  }[];
}

export function calculateSalary(
  config: Config,
  registros: DailyRecord[]
): CalculationResult {
  
  // 1. SUMAR HORAS POR TIPO
  const totales = registros.reduce(
    (acc, reg) => ({
      horasNormales: acc.horasNormales + (reg.horasNormales || 0),
      horasExtra: acc.horasExtra + (reg.horasExtras || 0), // ← Nota: usando "horasExtras" del tipo
      horasNocturnas: acc.horasNocturnas + (reg.horasNocturnas || 0),
      horasFestivas: acc.horasFestivas + (reg.horasFestivas || 0),
    }),
    { horasNormales: 0, horasExtra: 0, horasNocturnas: 0, horasFestivas: 0 }
  );

  const totalHoras = 
    totales.horasNormales + 
    totales.horasExtra + 
    totales.horasNocturnas + 
    totales.horasFestivas;

  // 2. CALCULAR IMPORTES POR TIPO DE HORA
  const importeNormales = totales.horasNormales * config.horaNormal;
  const importeExtra = totales.horasExtra * config.horaExtra;
  const importeNocturnas = totales.horasNocturnas * config.horaNocturna;
  const importeFestivas = totales.horasFestivas * config.horaFestiva;

  const bruto = importeNormales + importeExtra + importeNocturnas + importeFestivas;

  // 3. CALCULAR DEDUCCIONES
  const irpf = bruto * (config.irpf / 100);
  const ss = bruto * (config.ss / 100);

  // 4. CALCULAR NETO
  const neto = bruto - irpf - ss;

  // 5. PREPARAR DETALLE DE HORAS (para tabla)
  const detalleHoras = [
    {
      concepto: "Horas Normales",
      horas: totales.horasNormales,
      tarifa: config.horaNormal,
      importe: importeNormales,
    },
    {
      concepto: "Horas Extra",
      horas: totales.horasExtra,
      tarifa: config.horaExtra,
      importe: importeExtra,
    },
    {
      concepto: "Horas Nocturnas",
      horas: totales.horasNocturnas,
      tarifa: config.horaNocturna,
      importe: importeNocturnas,
    },
    {
      concepto: "Horas Festivas",
      horas: totales.horasFestivas,
      tarifa: config.horaFestiva,
      importe: importeFestivas,
    },
  ];

  // 6. PREPARAR DETALLE DE DEDUCCIONES (para tabla)
  const detalleDeducciones = [
    {
      concepto: "IRPF",
      porcentaje: config.irpf,
      importe: irpf,
    },
    {
      concepto: "Seguridad Social",
      porcentaje: config.ss,
      importe: ss,
    },
  ];

  // 7. PREPARAR DATOS PARA GRÁFICO CIRCULAR
  // ✅ CORRECCIÓN: Solo mostrar las 3 partes del bruto (neto, irpf, ss)
  const chartData = [
    { name: "Neto", value: neto, color: "hsl(var(--accent))" },
    { name: "IRPF", value: irpf, color: "hsl(var(--warning))" },
    { name: "Seg. Social", value: ss, color: "hsl(var(--destructive))" },
  ];

  return {
    totalHoras,
    horasNormales: totales.horasNormales,
    horasExtra: totales.horasExtra,
    horasNocturnas: totales.horasNocturnas,
    horasFestivas: totales.horasFestivas,
    bruto,
    irpf,
    ss,
    neto,
    detalleHoras,
    detalleDeducciones,
    chartData,
  };
}