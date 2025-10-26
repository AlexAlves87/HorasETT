import { Clock, Sun, Moon as MoonIcon, Calendar, TrendingUp, CalendarCheck, ChevronLeft, ChevronRight, Heart } from "lucide-react";
import MetricCard from "@/components/MetricCard";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getDailyRecords } from "@/utils/dailyRecords";
import { getConfig } from "@/utils/storage";
import { calculateSalary, CalculationResult } from "@/utils/calculator";
import AnimatedPieChart from "@/components/AnimatedPieChart";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { SEO } from "@/components/SEO";

const Dashboard = () => {
  const navigate = useNavigate();
  const [result, setResult] = useState<CalculationResult | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const [selectedDate, setSelectedDate] = useState(new Date()); // Mes actual por defecto

  // Filtrar registros por mes seleccionado
  const getFilteredRecords = () => {
    const allRecords = getDailyRecords();
    const year = selectedDate.getFullYear();
    const month = selectedDate.getMonth() + 1; // getMonth() devuelve 0-11
    const monthStr = `${year}-${String(month).padStart(2, '0')}`;
    
    return allRecords.filter(record => record.date.startsWith(monthStr));
  };

  useEffect(() => {
    // Cargar config y registros del mes seleccionado
    const config = getConfig();
    const registrosMes = getFilteredRecords();
    
    // Calcular solo para el mes seleccionado
    const calculation = calculateSalary(config, registrosMes);
    setResult(calculation);
  }, [refreshKey, selectedDate]);

  // Escuchar cambios en localStorage
  useEffect(() => {
    const handleStorageChange = () => {
      setRefreshKey(prev => prev + 1);
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('configUpdated', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('configUpdated', handleStorageChange);
    };
  }, []);

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

  // Mientras carga
  if (!result) {
    return <div className="p-6">Cargando...</div>;
  }

  const sinDatos = result.totalHoras === 0;
  const isCurrentMonth = selectedDate.getMonth() === new Date().getMonth() && 
                         selectedDate.getFullYear() === new Date().getFullYear();

  return (
    <>
      <SEO
        title="Dashboard - Resumen de Horas y Salario | HorasETT"
        description="Visualiza un resumen completo de tus horas trabajadas, salario estimado y estadísticas mensuales."
        keywords="dashboard trabajo, resumen horas, estadísticas salariales, control horario"
        canonical="/"
      />

      <div className="p-6 max-w-7xl mx-auto space-y-6">
        {/* Header con navegación de mes */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Dashboard</h1>
              <p className="text-muted-foreground">
                Resumen de horas y salario del mes seleccionado
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

        {/* Info banner si no hay datos */}
        {sinDatos && (
          <Card className="border-warning/50 bg-warning/5">
            <CardContent className="pt-6">
              <div className="flex items-start gap-3">
                <CalendarCheck className="w-5 h-5 text-warning mt-0.5" />
                <div>
                  <p className="text-sm font-medium">
                    No tienes horas registradas en {format(selectedDate, "MMMM yyyy", { locale: es })}
                  </p>
                  <Button 
                    variant="link" 
                    className="p-0 h-auto text-sm"
                    onClick={() => navigate("/parte-diario")}
                  >
                    Empieza a registrar tus horas →
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Métricas principales */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricCard
            title="Horas Normales"
            value={`${result.horasNormales}h`}
            subtitle="Jornada estándar"
            icon={Sun}
            trend="neutral"
          />
          <MetricCard
            title="Horas Nocturnas"
            value={`${result.horasNocturnas}h`}
            subtitle="22:00 - 6:00"
            icon={MoonIcon}
            trend={result.horasNocturnas > 0 ? "up" : "neutral"}
          />
          <MetricCard
            title="Horas Festivas"
            value={`${result.horasFestivas}h`}
            subtitle="Días festivos"
            icon={Calendar}
            trend={result.horasFestivas > 0 ? "up" : "neutral"}
          />
          <MetricCard
            title="Horas Extra"
            value={`${result.horasExtra}h`}
            subtitle="Límite: 80h/año"
            icon={Clock}
            trend="neutral"
          />
        </div>

        {/* Gráfico y resumen */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Gráfico circular animado */}
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle>Desglose Salarial</CardTitle>
              <CardDescription>
                Distribución de tu salario bruto → neto de {format(selectedDate, "MMMM", { locale: es })}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {sinDatos ? (
                <div className="h-[350px] flex items-center justify-center text-muted-foreground">
                  Sin datos para mostrar en {format(selectedDate, "MMMM yyyy", { locale: es })}
                </div>
              ) : (
                <AnimatedPieChart data={result.chartData} />
              )}
            </CardContent>
          </Card>

          {/* Resumen numérico */}
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle>Resumen Económico</CardTitle>
              <CardDescription>
                Cálculo aproximado de {format(selectedDate, "MMMM yyyy", { locale: es })}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center pb-2 border-b border-border">
                <span className="text-muted-foreground">Salario Bruto</span>
                <span className="text-lg font-semibold">{result.bruto.toFixed(2)}€</span>
              </div>
              <div className="flex justify-between items-center pb-2 border-b border-border">
                <span className="text-muted-foreground">IRPF ({result.detalleDeducciones[0].porcentaje}%)</span>
                <span className="text-lg font-semibold text-warning">-{result.irpf.toFixed(2)}€</span>
              </div>
              <div className="flex justify-between items-center pb-2 border-b border-border">
                <span className="text-muted-foreground">Seg. Social ({result.detalleDeducciones[1].porcentaje}%)</span>
                <span className="text-lg font-semibold text-destructive">-{result.ss.toFixed(2)}€</span>
              </div>
              <div className="flex justify-between items-center pt-2">
                <span className="text-lg font-bold">Neto Real Aproximado</span>
                <span className="text-2xl font-bold text-accent">{result.neto.toFixed(2)}€</span>
              </div>

              <div className="pt-4 space-y-2">
                <Button 
                  className="w-full" 
                  onClick={() => navigate("/parte-diario")}
                >
                  <CalendarCheck className="w-4 h-4 mr-2" />
                  Registrar Horas
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => navigate("/calculo")}
                >
                  <TrendingUp className="w-4 h-4 mr-2" />
                  Ver Detalle Completo
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Aviso informativo */}
        <Card className="border-warning/50 bg-warning/5">
          <CardContent className="pt-6">
            <p className="text-sm text-foreground">
              <strong>Nota importante:</strong> Los cálculos mostrados son orientativos y no sustituyen 
              una nómina oficial. Las retenciones pueden variar según tu situación personal y convenio colectivo.
            </p>
          </CardContent>
        </Card>

         {/* Botón de sugerencias destacado */}
        <Card className="border-primary/30 bg-gradient-to-r from-primary/10 via-accent/10 to-primary/10 shadow-lg">
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-primary/20 rounded-full">
                  <Heart className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">¿Tienes alguna sugerencia de mejora?</h3>
                  <p className="text-sm text-muted-foreground">
                    Tu opinión es importante para mejorar HorasETT
                  </p>
                </div>
              </div>
              <Button 
                size="lg"
                onClick={() => navigate("/apoyo#sugerencias")}
                className="whitespace-nowrap"
              >
                Enviar Sugerencia
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default Dashboard;