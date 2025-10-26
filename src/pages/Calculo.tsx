import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, FileText, TrendingDown, TrendingUp, Calendar, ChevronLeft, ChevronRight } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from "sonner";
import { useEffect, useState } from "react";
import { getConfig } from "@/utils/storage";
import { getDailyRecords } from "@/utils/dailyRecords";
import { calculateSalary, CalculationResult } from "@/utils/calculator";
import MonthlyHistoryChart from "@/components/MonthlyHistoryChart";
import { exportToPDF } from "@/utils/pdfExport";
import { exportToCSV } from "@/utils/csvExport";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { SEO } from "@/components/SEO";

const Calculo = () => {
  const [result, setResult] = useState<CalculationResult | null>(null);
  const [historyData, setHistoryData] = useState<any[]>([]);
  const [selectedDate, setSelectedDate] = useState(new Date()); // Mes actual por defecto

  // Filtrar registros por mes seleccionado
  const getFilteredRecords = () => {
    const allRecords = getDailyRecords();
    const year = selectedDate.getFullYear();
    const month = selectedDate.getMonth() + 1;
    const monthStr = `${year}-${String(month).padStart(2, '0')}`;
    
    return allRecords.filter(record => record.date.startsWith(monthStr));
  };

  useEffect(() => {
    const config = getConfig();
    const registrosMes = getFilteredRecords();
    const calculation = calculateSalary(config, registrosMes);
    setResult(calculation);

    // Generar historial mensual (últimos 6 meses)
    const allRecords = getDailyRecords();
    const history = [];
    const now = new Date();
    
    for (let i = 5; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const year = date.getFullYear();
      const month = date.getMonth();
      const monthStr = `${year}-${String(month + 1).padStart(2, '0')}`;
      
      const monthRecords = allRecords.filter(r => r.date.startsWith(monthStr));
      
      if (monthRecords.length > 0) {
        const monthCalc = calculateSalary(config, monthRecords);
        history.push({
          month: date.toLocaleDateString('es-ES', { month: 'short', year: '2-digit' }),
          neto: monthCalc.neto,
          deducciones: monthCalc.irpf + monthCalc.ss,
        });
      } else {
        history.push({
          month: date.toLocaleDateString('es-ES', { month: 'short', year: '2-digit' }),
          neto: 0,
          deducciones: 0,
        });
      }
    }
    
    setHistoryData(history);
  }, [selectedDate]);

  // Navegación de meses
  const goToPreviousMonth = () => {
    setSelectedDate(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
  };

  const goToNextMonth = () => {
    setSelectedDate(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
  };

  const goToCurrentMonth = () => {
    setSelectedDate(new Date());
  };

  const handleExportPDF = () => {
    if (!result) return;
    const month = format(selectedDate, "MMMM", { locale: es });
    const year = selectedDate.getFullYear().toString();
    exportToPDF(result, month, year);
    toast.success("PDF descargado correctamente");
  };

  const handleExportCSV = () => {
    if (!result) return;
    const month = format(selectedDate, "MMMM", { locale: es });
    const year = selectedDate.getFullYear().toString();
    exportToCSV(result, month, year);
    toast.success("CSV descargado correctamente");
  };

  if (!result) {
    return <div className="p-6">Cargando...</div>;
  }

  const isCurrentMonth = selectedDate.getMonth() === new Date().getMonth() && 
                         selectedDate.getFullYear() === new Date().getFullYear();

  return (
    <>
      <SEO
        title="Cálculo de Nómina - Desglose Detallado | HorasETT"
        description="Consulta el desglose completo de tu nómina: horas trabajadas, deducciones de IRPF y Seguridad Social, y salario neto mensual."
        keywords="cálculo nómina, desglose salario, IRPF, Seguridad Social, salario neto, horas trabajadas"
        canonical="/calculo"
      />

      <div className="p-6 max-w-7xl mx-auto space-y-6">
        {/* Header con navegación de mes */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Detalle del Cálculo</h1>
              <p className="text-muted-foreground">
                Desglose completo del mes seleccionado
              </p>
            </div>
            
            {/* Navegación de mes */}
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={goToPreviousMonth}>
                <ChevronLeft className="w-4 h-4" />
              </Button>
              
              <div className="text-center min-w-[140px]">
                <div className="text-lg font-semibold">
                  {format(selectedDate, "MMMM yyyy", { locale: es })}
                </div>
                {!isCurrentMonth && (
                  <Button 
                    variant="link" 
                    size="sm" 
                    className="p-0 h-auto text-xs"
                    onClick={goToCurrentMonth}
                  >
                    Ir a mes actual
                  </Button>
                )}
              </div>
              
              <Button variant="outline" size="sm" onClick={goToNextMonth}>
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Historial mensual */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Evolución Mensual (últimos 6 meses)
            </CardTitle>
            <CardDescription>
              Comparativa de salario neto y deducciones por mes
            </CardDescription>
          </CardHeader>
          <CardContent>
            <MonthlyHistoryChart data={historyData} />
          </CardContent>
        </Card>

        {/* Tabla de horas trabajadas */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-accent" />
              Ingresos Brutos por Tipo de Hora ({format(selectedDate, "MMMM yyyy", { locale: es })})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Concepto</TableHead>
                  <TableHead className="text-right">Horas</TableHead>
                  <TableHead className="text-right">Tarifa</TableHead>
                  <TableHead className="text-right">Importe</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {result.detalleHoras.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">{item.concepto}</TableCell>
                    <TableCell className="text-right">{item.horas}h</TableCell>
                    <TableCell className="text-right">{item.tarifa.toFixed(2)}€</TableCell>
                    <TableCell className="text-right font-semibold">{item.importe.toFixed(2)}€</TableCell>
                  </TableRow>
                ))}
                <TableRow className="bg-accent/10 font-bold">
                  <TableCell colSpan={3}>Total Salario Bruto</TableCell>
                  <TableCell className="text-right text-lg">{result.bruto.toFixed(2)}€</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Tabla de deducciones */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingDown className="w-5 h-5 text-destructive" />
              Deducciones Detalladas ({format(selectedDate, "MMMM yyyy", { locale: es })})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Concepto</TableHead>
                  <TableHead className="text-right">Porcentaje</TableHead>
                  <TableHead className="text-right">Importe</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {result.detalleDeducciones.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">{item.concepto}</TableCell>
                    <TableCell className="text-right">{item.porcentaje}%</TableCell>
                    <TableCell className="text-right text-destructive font-semibold">
                      -{item.importe.toFixed(2)}€
                    </TableCell>
                  </TableRow>
                ))}
                <TableRow className="bg-destructive/10 font-bold">
                  <TableCell colSpan={2}>Total Deducciones</TableCell>
                  <TableCell className="text-right text-lg text-destructive">
                    -{(result.irpf + result.ss).toFixed(2)}€
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Resultado final */}
        <Card className="shadow-card border-accent/50 bg-accent/5">
          <CardContent className="pt-6">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <p className="text-sm text-muted-foreground mb-1">
                  Salario Neto Real Aproximado ({format(selectedDate, "MMMM yyyy", { locale: es })})
                </p>
                <p className="text-4xl font-bold text-accent">{result.neto.toFixed(2)}€</p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" onClick={handleExportCSV}>
                  <FileText className="w-4 h-4 mr-2" />
                  Exportar CSV
                </Button>
                <Button onClick={handleExportPDF}>
                  <Download className="w-4 h-4 mr-2" />
                  Descargar PDF
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Aviso */}
        <Card className="border-warning/50 bg-warning/5">
          <CardContent className="pt-6">
            <p className="text-sm">
              <strong>Recuerda:</strong> Este desglose es orientativo. Tu nómina oficial puede 
              incluir otros conceptos como pagas extras prorrateadas, pluses, o deducciones adicionales 
              según tu convenio colectivo.
            </p>
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default Calculo;