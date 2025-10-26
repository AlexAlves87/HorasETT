import { useState, useEffect } from "react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Calendar as CalendarIcon, Save, Trash2, Sun, Moon, CalendarDays, Clock, StickyNote, Sunrise, Sunset, CloudMoon, Star } from "lucide-react";
import { toast } from "sonner";
import { getDailyRecord, saveDailyRecord, deleteDailyRecord, getDailyRecords } from "@/utils/dailyRecords";
import { DailyRecord } from "@/types/dailyRecord";
import { getConfig } from "@/utils/storage";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { frasesMotivadoras } from "@/data/frasesMotivadoras";
import { SEO } from "@/components/SEO";

// Hook que muestra una frase aleatoria distinta cada vez
function useFraseMotivadora() {
  useEffect(() => {
    const key = "frases_mostradas_v1";
    let mostradas: number[] = JSON.parse(localStorage.getItem(key) || "[]");

    if (mostradas.length >= frasesMotivadoras.length) {
      mostradas = [];
    }

    const disponibles = frasesMotivadoras.filter((_, i) => !mostradas.includes(i));
    const randomIndex = Math.floor(Math.random() * disponibles.length);
    const frase = disponibles[randomIndex];
    const globalIndex = frasesMotivadoras.indexOf(frase);

    mostradas.push(globalIndex);
    localStorage.setItem(key, JSON.stringify(mostradas));

    toast.info(frase, {
      duration: 3000,
      position: "bottom-center",
      style: {
        background: "#1e293b",
        color: "#fff",
        fontSize: "0.95rem",
        borderRadius: "8px",
        padding: "12px 16px",
      },
    });
  }, []);
}

// Función auxiliar para obtener número de semana
const getWeekNumber = (date: Date): number => {
  const firstDay = new Date(date.getFullYear(), 0, 1);
  const days = Math.floor((date.getTime() - firstDay.getTime()) / (24 * 60 * 60 * 1000));
  return Math.ceil((days + firstDay.getDay() + 1) / 7);
};

const ParteDiario = () => {
  useFraseMotivadora();

  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [defaultShift, setDefaultShift] = useState<string | null>(null);
  const [formData, setFormData] = useState<Omit<DailyRecord, "date">>({
    horasNormales: 0,
    horasNocturnas: 0,
    horasFestivas: 0,
    horasExtras: 0,
    notas: "",
    turno: "",
  });

  // Cargar turno predeterminado de la semana
  useEffect(() => {
    const savedDefaultShift = localStorage.getItem('weeklyDefaultShift');
    const savedWeek = localStorage.getItem('currentWeek');
    const currentWeek = getWeekNumber(new Date());
    
    // Si cambió de semana, limpiar turno predeterminado
    if (savedWeek && currentWeek !== parseInt(savedWeek)) {
      localStorage.removeItem('weeklyDefaultShift');
      setDefaultShift(null);
    } else if (savedDefaultShift) {
      setDefaultShift(savedDefaultShift);
    }
    
    localStorage.setItem('currentWeek', currentWeek.toString());
  }, []);

  // Cargar datos del día seleccionado
  useEffect(() => {
    const record = getDailyRecord(selectedDate);
    
    if (record) {
      setFormData({
        horasNormales: record.horasNormales,
        horasNocturnas: record.horasNocturnas,
        horasFestivas: record.horasFestivas,
        horasExtras: record.horasExtras,
        notas: record.notas || "",
        turno: record.turno || "",
      });
    } else {
      // Nuevo día: usar turno predeterminado si existe
      setFormData({
        horasNormales: 0,
        horasNocturnas: 0,
        horasFestivas: 0,
        horasExtras: 0,
        notas: "",
        turno: defaultShift || "",
      });
    }
  }, [selectedDate, defaultShift]);

  const handleDateSelect = (date: Date | undefined) => {
    if (!date) return;
    setSelectedDate(date);
  };

  const handleChange = (field: string, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSetAsDefault = () => {
    if (!formData.turno) {
      toast.error("Selecciona un turno primero");
      return;
    }
    
    setDefaultShift(formData.turno);
    localStorage.setItem('weeklyDefaultShift', formData.turno);
    toast.success('Turno establecido como predeterminado para esta semana');
  };

  const handleClearDefault = () => {
    setDefaultShift(null);
    localStorage.removeItem('weeklyDefaultShift');
    toast.success('Turno predeterminado eliminado');
  };

  const handleSave = () => {
    if (!formData.turno) {
      toast.error("Turno requerido", { description: "Por favor selecciona un turno antes de guardar" });
      return;
    }

    const totalHoras =
      Number(formData.horasNormales) +
      Number(formData.horasNocturnas) +
      Number(formData.horasFestivas) +
      Number(formData.horasExtras);

    if (totalHoras === 0) {
      toast.error("Sin horas registradas", {
        description: "Por favor registra al menos algunas horas antes de guardar",
      });
      return;
    }

    const record: DailyRecord = {
      date: format(selectedDate, "yyyy-MM-dd"),
      horasNormales: Number(formData.horasNormales),
      horasNocturnas: Number(formData.horasNocturnas),
      horasFestivas: Number(formData.horasFestivas),
      horasExtras: Number(formData.horasExtras),
      notas: formData.notas,
      turno: formData.turno,
    };

    saveDailyRecord(record);
    toast.success("Registro guardado correctamente", {
      description: format(selectedDate, "d 'de' MMMM 'de' yyyy", { locale: es }),
    });
  };

  const handleDelete = () => {
    const dateStr = format(selectedDate, "yyyy-MM-dd");
    deleteDailyRecord(dateStr);
    setFormData({
      horasNormales: 0,
      horasNocturnas: 0,
      horasFestivas: 0,
      horasExtras: 0,
      notas: "",
      turno: defaultShift || "",
    });
    toast.success("Registro eliminado");
  };

  const totalHoras =
    Number(formData.horasNormales) +
    Number(formData.horasNocturnas) +
    Number(formData.horasFestivas) +
    Number(formData.horasExtras);

  const config = getConfig();
  const brutoDia =
    Number(formData.horasNormales) * config.horaNormal +
    Number(formData.horasNocturnas) * config.horaNocturna +
    Number(formData.horasFestivas) * config.horaFestiva +
    Number(formData.horasExtras) * config.horaExtra;

  const allRecords = getDailyRecords();
  const daysWithData = allRecords.map(r => r.date);
  const daysWithNotes = allRecords.filter(r => r.notas && r.notas.trim() !== "").map(r => r.date);

  const modifiers = {
    hasData: (date: Date) => daysWithData.includes(format(date, "yyyy-MM-dd")),
    hasNote: (date: Date) => daysWithNotes.includes(format(date, "yyyy-MM-dd")),
  };

  return (
    <>
      <SEO
        title="Parte Diario - Registro de Jornada | HorasETT"
        description="Registra tu jornada laboral diaria de forma rápida y sencilla. Control de entrada, salida y descansos."
        keywords="parte diario, registro jornada, fichaje diario, control asistencia"
        canonical="/parte-diario"
      />

      <div className="p-6 max-w-7xl mx-auto space-y-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold">Parte Diario</h1>
          <p className="text-muted-foreground">
            Registra tus horas trabajadas cada día para un cálculo preciso
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_1fr] gap-6">
          {/* Calendario */}
          <Card className="shadow-card h-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CalendarIcon className="w-5 h-5" />
                Selecciona un Día
              </CardTitle>
              <CardDescription>
                Haz clic en cualquier día para registrar tus horas
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center justify-center min-h-[500px]">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={handleDateSelect}
                locale={es}
                className="rounded-md w-full"
                modifiers={modifiers}
                modifiersClassNames={{
                  hasData: "day-with-data",
                  hasNote: "day-with-note",
                }}
              />
            </CardContent>
          </Card>

          {/* Formulario */}
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>{format(selectedDate, "d 'de' MMMM 'de' yyyy", { locale: es })}</span>
                {formData.notas && <StickyNote className="w-4 h-4 text-warning" />}
              </CardTitle>
              <CardDescription>Introduce las horas trabajadas en este día</CardDescription>
            </CardHeader>

            <CardContent className="space-y-4">
              {/* Turno */}
              <div className="space-y-2 p-3 rounded-lg bg-primary/5 border border-primary/20">
                <Label htmlFor="turno" className="flex items-center gap-2 text-base font-semibold">
                  <Clock className="w-4 h-4" /> Turno de Trabajo
                  <span className="text-destructive">*</span>
                  {defaultShift && (
                    <span className="text-xs bg-accent/20 px-2 py-1 rounded text-accent flex items-center gap-1">
                      <Star className="w-3 h-3" />
                      Predeterminado
                    </span>
                  )}
                </Label>
                <Select value={formData.turno || ""} onValueChange={v => handleChange("turno", v)}>
                  <SelectTrigger id="turno" className={!formData.turno ? "border-destructive" : ""}>
                    <SelectValue placeholder="Selecciona un turno (obligatorio)" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="mañana">
                      <div className="flex items-center gap-2">
                        <Sunrise className="w-4 h-4" /> Mañana (06:00 - 14:00)
                      </div>
                    </SelectItem>
                    <SelectItem value="tarde">
                      <div className="flex items-center gap-2">
                        <Sunset className="w-4 h-4" /> Tarde (14:00 - 22:00)
                      </div>
                    </SelectItem>
                    <SelectItem value="noche">
                      <div className="flex items-center gap-2">
                        <CloudMoon className="w-4 h-4" /> Noche (22:00 - 06:00)
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
                
                {/* Botones de predeterminado */}
                <div className="flex gap-2">
                  {!defaultShift ? (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleSetAsDefault}
                      disabled={!formData.turno}
                      className="text-xs"
                    >
                      <Star className="w-3 h-3 mr-1" />
                      Predeterminado para esta semana
                    </Button>
                  ) : (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleClearDefault}
                      className="text-xs"
                    >
                      <Star className="w-3 h-3 mr-1 fill-current" />
                      Quitar predeterminado
                    </Button>
                  )}
                </div>
                
                {!formData.turno && (
                  <p className="text-xs text-destructive">Este campo es obligatorio</p>
                )}
              </div>

              {/* Horas */}
              <div className="grid grid-cols-2 gap-4 p-3 rounded-lg bg-secondary/50">
                <div className="space-y-2">
                  <Label htmlFor="horasNormales" className="flex items-center gap-2">
                    <Sun className="w-4 h-4" /> Horas Normales
                  </Label>
                  <Input id="horasNormales" type="number" min="0" step="0.5" value={formData.horasNormales} onChange={e => handleChange("horasNormales", e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="horasNocturnas" className="flex items-center gap-2">
                    <Moon className="w-4 h-4" /> Horas Nocturnas
                  </Label>
                  <Input id="horasNocturnas" type="number" min="0" step="0.5" value={formData.horasNocturnas} onChange={e => handleChange("horasNocturnas", e.target.value)} />
                </div>
              </div>

              {/* Festivas + Extras */}
              <div className="grid grid-cols-2 gap-4 p-3 rounded-lg bg-secondary/50">
                <div className="space-y-2">
                  <Label htmlFor="horasFestivas" className="flex items-center gap-2">
                    <CalendarDays className="w-4 h-4" /> Horas Festivas
                  </Label>
                  <Input id="horasFestivas" type="number" min="0" step="0.5" value={formData.horasFestivas} onChange={e => handleChange("horasFestivas", e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="horasExtras" className="flex items-center gap-2">
                    <Clock className="w-4 h-4" /> Horas Extras
                  </Label>
                  <Input id="horasExtras" type="number" min="0" step="0.5" value={formData.horasExtras} onChange={e => handleChange("horasExtras", e.target.value)} />
                </div>
              </div>

              {/* Totales */}
              <div className="space-y-3">
                <div className="p-3 rounded-lg bg-primary/10 border border-primary/20 flex justify-between">
                  <span className="font-medium">Total de horas:</span>
                  <span className="text-2xl font-bold text-primary">{totalHoras.toFixed(1)}h</span>
                </div>
                <div className="p-3 rounded-lg bg-accent/10 border border-accent/20 flex justify-between">
                  <span className="font-medium">Salario bruto del día:</span>
                  <span className="text-2xl font-bold text-accent">{brutoDia.toFixed(2)}€</span>
                </div>
              </div>

              {/* Notas */}
              <div className="space-y-2">
                <Label htmlFor="notas" className="flex items-center gap-2">
                  Notas del día {formData.notas && <StickyNote className="w-4 h-4 text-warning" />}
                </Label>
                <Textarea id="notas" placeholder="Añade cualquier observación o incidencia del día..." value={formData.notas} onChange={e => handleChange("notas", e.target.value)} rows={3} />
              </div>

              {/* Botones */}
              <div className="flex gap-3 pt-2">
                <Button className="flex-1" onClick={handleSave}>
                  <Save className="w-4 h-4 mr-2" /> Guardar
                </Button>
                <Button variant="destructive" onClick={handleDelete}>
                  <Trash2 className="w-4 h-4 mr-2" /> Eliminar
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="border-primary/30 bg-primary/5">
          <CardContent className="pt-6">
            <p className="text-sm">
              <strong>💡 Consejo:</strong> Registra tus horas diariamente para mantener un control preciso. Los totales mensuales se calcularán automáticamente en el Dashboard.
            </p>
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default ParteDiario;