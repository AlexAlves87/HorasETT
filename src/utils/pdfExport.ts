import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { CalculationResult } from './calculator';
import { getDailyRecords } from './dailyRecords';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

const getTurnoIcon = (turno?: string): string => {
  switch (turno) {
    case 'mañana': return '🌅';
    case 'tarde': return '🌆';
    case 'noche': return '🌙';
    default: return '⏰';
  }
};

const getTurnoText = (turno?: string): string => {
  switch (turno) {
    case 'mañana': return 'Mañana';
    case 'tarde': return 'Tarde';
    case 'noche': return 'Noche';
    default: return 'Sin especificar';
  }
};

export const exportToPDF = async (result: CalculationResult, month: string, year: string) => {
  const doc = new jsPDF();
  
  // Colores
  const primaryColor: [number, number, number] = [33, 82, 176];
  const textColor: [number, number, number] = [50, 50, 50];
  
  let yPosition = 20;

  // ===== CARGAR LOGO =====
  const loadImage = (url: string): Promise<string> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = 'Anonymous';
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0);
        resolve(canvas.toDataURL('image/png'));
      };
      img.onerror = reject;
      img.src = url;
    });
  };

  // ===== ENCABEZADO CON LOGO =====
  doc.setFillColor(...primaryColor);
  doc.rect(0, 0, 210, 45, 'F');
  
  try {
    const logoBase64 = await loadImage('/horasett_logo.png');
    doc.addImage(logoBase64, 'PNG', 14, 10, 25, 25);
  } catch (e) {
    console.log('Logo no encontrado');
  }
  
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(24);
  doc.setFont('helvetica', 'bold');
  doc.text('REGISTRO DE HORAS', 105, 22, { align: 'center' });
  
  doc.setFontSize(12);
  doc.setFont('helvetica', 'normal');
  doc.text(`Periodo: ${month} ${year}`, 105, 32, { align: 'center' });
  
  yPosition = 60;

  // ===== RESUMEN DE HORAS =====
  doc.setTextColor(...textColor);
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('Resumen de Horas Trabajadas', 14, yPosition);
  
  yPosition += 10;

  autoTable(doc, {
    startY: yPosition,
    head: [['Tipo de Hora', 'Cantidad']],
    body: [
      ['Horas Normales', `${result.horasNormales}h`],
      ['Horas Nocturnas', `${result.horasNocturnas}h`],
      ['Horas Festivas', `${result.horasFestivas}h`],
      ['Horas Extra', `${result.horasExtra}h`],
    ],
    foot: [[
      { content: 'TOTAL HORAS', styles: { fontStyle: 'bold' } },
      { content: `${result.totalHoras}h`, styles: { fontStyle: 'bold', halign: 'center' } }
    ]],
    theme: 'striped',
    headStyles: { 
      fillColor: primaryColor,
      textColor: [255, 255, 255],
      fontStyle: 'bold',
      halign: 'center'
    },
    footStyles: {
      fillColor: [240, 240, 240],
      textColor: textColor,
      fontStyle: 'bold',
      fontSize: 12
    },
    columnStyles: {
      0: { cellWidth: 120, fontStyle: 'bold' },
      1: { halign: 'center', cellWidth: 60, fontSize: 11 }
    },
    margin: { left: 14, right: 14 },
  });

  yPosition = (doc as any).lastAutoTable.finalY + 20;

  // ===== DESGLOSE DIARIO =====
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('Desglose Diario', 14, yPosition);
  
  yPosition += 10;

  // Obtener registros del mes actual
  const allRecords = getDailyRecords();
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth() + 1;
  const monthStr = `${currentYear}-${String(currentMonth).padStart(2, '0')}`;
  const monthRecords = allRecords
    .filter(r => r.date.startsWith(monthStr))
    .sort((a, b) => a.date.localeCompare(b.date));

  if (monthRecords.length > 0) {
    const dailyData = monthRecords.map(record => {
      const date = new Date(record.date + 'T00:00:00');
      const formattedDate = format(date, "EEE d 'de' MMM", { locale: es });
      const totalDia = record.horasNormales + record.horasNocturnas + record.horasFestivas + record.horasExtras;
      
      return [
        formattedDate,
        getTurnoText(record.turno),
        `${totalDia}h`,
        record.notas || '-'
      ];
    });

    autoTable(doc, {
      startY: yPosition,
      head: [['Fecha', 'Turno', 'Total Horas', 'Observaciones']],
      body: dailyData,
      theme: 'grid',
      headStyles: { 
        fillColor: primaryColor,
        textColor: [255, 255, 255],
        fontStyle: 'bold',
        halign: 'center',
        fontSize: 9
      },
      bodyStyles: {
        fontSize: 8
      },
      columnStyles: {
        0: { cellWidth: 35, fontStyle: 'bold' },
        1: { cellWidth: 30, halign: 'center' },
        2: { cellWidth: 25, halign: 'center', fontStyle: 'bold' },
        3: { cellWidth: 92, fontSize: 7 }
      },
      margin: { left: 14, right: 14 },
    });

    yPosition = (doc as any).lastAutoTable.finalY + 15;
  } else {
    doc.setFontSize(10);
    doc.setFont('helvetica', 'italic');
    doc.setTextColor(150, 150, 150);
    doc.text('No hay registros diarios para este mes', 14, yPosition);
    yPosition += 15;
  }

  // ===== NUEVA PÁGINA SI ES NECESARIO =====
  if (yPosition > 240) {
    doc.addPage();
    yPosition = 20;
  }

  // ===== OBSERVACIONES =====
  doc.setTextColor(...textColor);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'italic');
  doc.text('Observaciones:', 14, yPosition);
  
  yPosition += 7;
  
  doc.setFont('helvetica', 'normal');
  const observaciones = [
    '• Horas Nocturnas: Jornada realizada entre las 22:00 y las 6:00',
    '• Horas Festivas: Trabajo en domingos o festivos oficiales',
    '• Horas Extra: Horas trabajadas por encima de la jornada ordinaria'
  ];
  
  observaciones.forEach(obs => {
    doc.text(obs, 14, yPosition);
    yPosition += 6;
  });

  // ===== PIE DE PÁGINA =====
  const pageCount = doc.getNumberOfPages();
  
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    const pageHeight = doc.internal.pageSize.height;
    
    doc.setFillColor(240, 240, 240);
    doc.rect(0, pageHeight - 35, 210, 35, 'F');
    
    doc.setTextColor(...textColor);
    doc.setFontSize(9);
    doc.setFont('helvetica', 'italic');
    doc.text(
      'Este documento es un registro informativo de horas trabajadas.',
      105,
      pageHeight - 25,
      { align: 'center' }
    );
    doc.text(
      `Generado el ${new Date().toLocaleDateString('es-ES', { 
        day: '2-digit', 
        month: 'long', 
        year: 'numeric' 
      })} con HorasETT`,
      105,
      pageHeight - 18,
      { align: 'center' }
    );

    // Número de página
    doc.setFontSize(8);
    doc.text(`Página ${i} de ${pageCount}`, 105, pageHeight - 10, { align: 'center' });

    // Línea de firma solo en última página
    if (i === pageCount) {
      doc.setDrawColor(150, 150, 150);
      doc.line(120, pageHeight - 8, 190, pageHeight - 8);
      doc.setFontSize(8);
      doc.text('Firma del trabajador', 155, pageHeight - 3, { align: 'center' });
    }
  }

  // ===== GUARDAR =====
  const fileName = `registro_horas_${month}_${year}.pdf`.toLowerCase().replace(/\s/g, '_');
  doc.save(fileName);
};