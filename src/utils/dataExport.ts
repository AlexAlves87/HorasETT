import { getConfig, saveConfig } from "./storage";
import { getDailyRecords } from "./dailyRecords";

export interface ExportData {
  version: string;
  exportDate: string;
  config: any;
  dailyRecords: any;
  metadata: {
    totalRecords: number;
    dateRange: string;
  };
}

export const exportToJSON = () => {
  const config = getConfig();
  const dailyRecords = getDailyRecords();
  
  const exportData: ExportData = {
    version: "1.0",
    exportDate: new Date().toISOString(),
    config,
    dailyRecords,
    metadata: {
      totalRecords: dailyRecords.length,
      dateRange: dailyRecords.length > 0 
        ? `${dailyRecords[0].date} to ${dailyRecords[dailyRecords.length - 1].date}`
        : "Sin datos"
    }
  };

  const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `horasett-backup-${new Date().toISOString().split('T')[0]}.json`;
  a.click();
  URL.revokeObjectURL(url);
};

export const exportToCSV = () => {
  const dailyRecords = getDailyRecords();
  const config = getConfig();
  
  let csv = "Fecha,Horas Normales,Horas Nocturnas,Horas Festivas,Horas Extra,Notas,Tarifa Normal,Tarifa Nocturna,Tarifa Festiva,Tarifa Extra\n";
  
  dailyRecords.forEach((record) => {
    csv += `${record.date},${record.horasNormales || 0},${record.horasNocturnas || 0},${record.horasFestivas || 0},${record.horasExtras || 0},"${(record.notes || '').replace(/"/g, '""')}",${config.horaNormal},${config.horaNocturna},${config.horaFestiva},${config.horaExtra}\n`;
  });
  
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `horasett-data-${new Date().toISOString().split('T')[0]}.csv`;
  a.click();
  URL.revokeObjectURL(url);
};

export const importFromJSON = (file: File): Promise<boolean> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data: ExportData = JSON.parse(e.target?.result as string);
        
        if (!data.version || !data.config || !data.dailyRecords) {
          throw new Error("Archivo no válido");
        }
        
        saveConfig(data.config);
        localStorage.setItem('horasett_daily_records', JSON.stringify(data.dailyRecords));
        window.dispatchEvent(new Event('configUpdated'));
        
        resolve(true);
      } catch (error) {
        reject(error);
      }
    };
    reader.readAsText(file);
  });
};