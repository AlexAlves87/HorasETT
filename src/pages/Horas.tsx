import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Save, DollarSign, Sun, Moon, Calendar, Clock, Percent, Info } from "lucide-react";
import { toast } from "sonner";
import { getConfig, saveConfig } from "@/utils/storage";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { SEO } from "@/components/SEO";

const Tarifas = () => {
  const [config, setConfig] = useState({
    horaNormal: 0,
    horaNocturna: 0,
    horaFestiva: 0,
    horaExtra: 0,
    irpf: 0,
    ss: 0,
  });

  useEffect(() => {
    const savedConfig = getConfig();
    setConfig(savedConfig);
  }, []);

  const handleChange = (field: string, value: string) => {
    setConfig(prev => ({ ...prev, [field]: Number(value) }));
  };

  const handleSave = () => {
    saveConfig(config);
    toast.success("Configuración guardada correctamente", {
      description: "Los cambios se aplicarán a todos los cálculos"
    });
    
    // Forzar recarga en otras páginas
    window.dispatchEvent(new Event('configUpdated'));
  };

  return (
    <>
      <SEO
        title="Preferencias y Configuración | HorasETT"
        description="Configura tu salario base, tipos de hora y preferencias de la aplicación."
        keywords="configuración, preferencias, ajustes aplicación"
        canonical="/preferencias"
      />

      <div className="p-6 max-w-5xl mx-auto space-y-6">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-3xl font-bold">Tarifas y Configuración</h1>
          <p className="text-muted-foreground">
            Define tus tarifas horarias y porcentajes de retención
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Tarifas por hora */}
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="w-5 h-5" />
                Tarifas por Hora
              </CardTitle>
              <CardDescription>
                Define cuánto cobras por cada tipo de hora trabajada
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="horaNormal" className="flex items-center gap-2">
                  <Sun className="w-4 h-4" />
                  Hora Normal
                </Label>
                <div className="flex items-center gap-2">
                  <Input
                    id="horaNormal"
                    type="number"
                    step="0.01"
                    value={config.horaNormal}
                    onChange={(e) => handleChange("horaNormal", e.target.value)}
                  />
                  <span className="text-muted-foreground">€/h</span>
                </div>
                <p className="text-xs text-muted-foreground">
                  Tarifa estándar para horas diurnas (06:00 - 22:00)
                </p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Label htmlFor="horaNocturna" className="flex items-center gap-2">
                    <Moon className="w-4 h-4" />
                    Hora Nocturna
                  </Label>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        <Info className="w-3 h-3 text-muted-foreground" />
                      </TooltipTrigger>
                      <TooltipContent className="max-w-xs">
                        <p>Horas trabajadas entre las 22:00 y las 6:00. Suelen tener un plus del 25%.</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <div className="flex items-center gap-2">
                  <Input
                    id="horaNocturna"
                    type="number"
                    step="0.01"
                    value={config.horaNocturna}
                    onChange={(e) => handleChange("horaNocturna", e.target.value)}
                  />
                  <span className="text-muted-foreground">€/h</span>
                </div>
                <p className="text-xs text-muted-foreground">
                  Tarifa para horas nocturnas (22:00 - 06:00)
                </p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Label htmlFor="horaFestiva" className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    Hora Festiva
                  </Label>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        <Info className="w-3 h-3 text-muted-foreground" />
                      </TooltipTrigger>
                      <TooltipContent className="max-w-xs">
                        <p>Horas trabajadas en domingos y festivos. Suelen tener un plus del 75%.</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <div className="flex items-center gap-2">
                  <Input
                    id="horaFestiva"
                    type="number"
                    step="0.01"
                    value={config.horaFestiva}
                    onChange={(e) => handleChange("horaFestiva", e.target.value)}
                  />
                  <span className="text-muted-foreground">€/h</span>
                </div>
                <p className="text-xs text-muted-foreground">
                  Tarifa para domingos y festivos
                </p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Label htmlFor="horaExtra" className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    Hora Extra
                  </Label>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        <Info className="w-3 h-3 text-muted-foreground" />
                      </TooltipTrigger>
                      <TooltipContent className="max-w-xs">
                        <p>Horas trabajadas por encima de la jornada ordinaria. Suelen tener un plus del 50%. Máximo legal: 80h/año.</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <div className="flex items-center gap-2">
                  <Input
                    id="horaExtra"
                    type="number"
                    step="0.01"
                    value={config.horaExtra}
                    onChange={(e) => handleChange("horaExtra", e.target.value)}
                  />
                  <span className="text-muted-foreground">€/h</span>
                </div>
                <p className="text-xs text-muted-foreground">
                  Tarifa para horas extraordinarias
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Retenciones y deducciones */}
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Percent className="w-5 h-5" />
                Retenciones y Deducciones
              </CardTitle>
              <CardDescription>
                Porcentajes que se aplican sobre tu salario bruto
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Label htmlFor="irpf">% IRPF (Retención)</Label>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        <Info className="w-3 h-3 text-muted-foreground" />
                      </TooltipTrigger>
                      <TooltipContent className="max-w-xs">
                        <p>El porcentaje de IRPF depende de tu situación personal, ingresos anuales y 
                        circunstancias familiares. Revisa tu nómina para conocer tu retención exacta.</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <div className="flex items-center gap-2">
                  <Input
                    id="irpf"
                    type="number"
                    step="0.01"
                    value={config.irpf}
                    onChange={(e) => handleChange("irpf", e.target.value)}
                  />
                  <span className="text-muted-foreground">%</span>
                </div>
                <p className="text-xs text-muted-foreground">
                  Típicamente entre 2% y 45% según tus circunstancias
                </p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Label htmlFor="ss">% Seguridad Social</Label>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        <Info className="w-3 h-3 text-muted-foreground" />
                      </TooltipTrigger>
                      <TooltipContent className="max-w-xs">
                        <p>Suma de todas las cotizaciones a la Seguridad Social:</p>
                        <ul className="list-disc list-inside mt-2 space-y-1">
                          <li>Contingencias comunes: 6.65%</li>
                          <li>Desempleo: 1.55%</li>
                          <li>Formación profesional: 0.10%</li>
                          <li><strong>Total estándar: 8.3%</strong></li>
                        </ul>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <div className="flex items-center gap-2">
                  <Input
                    id="ss"
                    type="number"
                    step="0.01"
                    value={config.ss}
                    onChange={(e) => handleChange("ss", e.target.value)}
                  />
                  <span className="text-muted-foreground">%</span>
                </div>
                <p className="text-xs text-muted-foreground">
                  Valor estándar: 8.3% (puede variar según convenio)
                </p>
              </div>

              {/* Preview de deducciones */}
              <div className="p-4 rounded-lg bg-muted/50 space-y-2 mt-6">
                <h4 className="font-semibold text-sm">Vista previa sobre 1000€ brutos:</h4>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">IRPF ({config.irpf}%):</span>
                    <span className="text-destructive">-{(1000 * config.irpf / 100).toFixed(2)}€</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Seg. Social ({config.ss}%):</span>
                    <span className="text-destructive">-{(1000 * config.ss / 100).toFixed(2)}€</span>
                  </div>
                  <div className="flex justify-between border-t pt-1 font-semibold">
                    <span>Neto aproximado:</span>
                    <span className="text-accent">
                      {(1000 - (1000 * config.irpf / 100) - (1000 * config.ss / 100)).toFixed(2)}€
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Botón guardar */}
        <Card className="shadow-card">
          <CardContent className="pt-6">
            <Button 
              className="w-full"
              onClick={handleSave}
              size="lg"
            >
              <Save className="w-4 h-4 mr-2" />
              Guardar Configuración
            </Button>
          </CardContent>
        </Card>

        {/* Aviso legal */}
        <Card className="border-warning/50 bg-warning/5">
          <CardContent className="pt-6">
            <p className="text-sm">
              <strong>⚠️ Aviso legal:</strong> Los cálculos realizados por HorasETT son orientativos 
              y no sustituyen una nómina oficial. Las retenciones y cotizaciones pueden variar según 
              tu situación personal, comunidad autónoma y convenio colectivo aplicable.
            </p>
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default Tarifas;