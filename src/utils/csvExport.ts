import { CalculationResult } from './calculator';

export const exportToCSV = (result: CalculationResult, month: string, year: string) => {
  const lines = [];
  
  // Header
  lines.push(`Desglose de Horas - ${month} ${year}`);
  lines.push('');
  
  // Tabla de horas
  lines.push('Tipo de Hora,Cantidad (h),Tarifa (€/h),Subtotal (€)');
  result.detalleHoras.forEach(item => {
    lines.push(`${item.concepto},${item.horas},${item.tarifa.toFixed(2)},${item.importe.toFixed(2)}`);
  });
  lines.push(`TOTAL,${result.totalHoras},,-`);
  lines.push('');
  
  // Resumen
  lines.push('Resumen');
  lines.push('Horas Normales,' + result.horasNormales);
  lines.push('Horas Nocturnas,' + result.horasNocturnas);
  lines.push('Horas Festivas,' + result.horasFestivas);
  lines.push('Horas Extra,' + result.horasExtra);
  lines.push('TOTAL HORAS,' + result.totalHoras);
  
  const csv = lines.join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  link.setAttribute('href', url);
  link.setAttribute('download', `desglose_horas_${month}_${year}.csv`.toLowerCase().replace(/\s/g, '_'));
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};