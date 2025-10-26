import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Send, Lightbulb, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";

interface SuggestionFormProps {
  appsScriptUrl?: string;
}

const SuggestionForm = ({ 
  appsScriptUrl = "https://script.google.com/macros/s/AKfycbyqOxqZYJODe4pjHDOHY-xyIQ7fgMPJ8LRMOsaXEtSFLD-PgvUDXc4n7aHn5hDe2EJS/exec" 
}: SuggestionFormProps) => {
  const [formData, setFormData] = useState({
    tipo: "",
    descripcion: "",
    email: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.tipo || !formData.descripcion.trim()) {
      toast.error("Por favor, completa todos los campos obligatorios");
      return;
    }

    setIsSubmitting(true);

    try {
      // Enviar a Google Apps Script
      await fetch(appsScriptUrl, {
        method: "POST",
        mode: "no-cors", // Necesario para Apps Script
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          tipo: formData.tipo,
          descripcion: formData.descripcion,
          email: formData.email || "No proporcionado",
          fecha: new Date().toISOString(),
        }),
      });

      // Con mode: 'no-cors' no recibimos respuesta, pero asumimos éxito
      toast.success("¡Sugerencia enviada con éxito!", {
        description: "Gracias por tu aportación. La revisaré personalmente.",
        icon: <CheckCircle2 className="w-5 h-5" />,
      });

      // Limpiar formulario
      setFormData({
        tipo: "",
        descripcion: "",
        email: "",
      });
    } catch (error) {
      toast.error("Error al enviar la sugerencia", {
        description: "Por favor, inténtalo de nuevo más tarde.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="shadow-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Lightbulb className="w-6 h-6 text-accent" />
          Buzón de Sugerencias
        </CardTitle>
        <CardDescription>
          ¿Tienes ideas para mejorar HorasETT?
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-foreground">
          Leo personalmente cada sugerencia y priorizo aquellas que:
        </p>
        <ul className="text-sm text-muted-foreground space-y-1 ml-4">
          <li>• Sean más útiles para la comunidad</li>
          <li>• Estén más solicitadas</li>
          <li>• El tiempo me permita implementar</li>
        </ul>
        <p className="text-sm text-muted-foreground">
          Este es un proyecto personal mantenido en mi tiempo libre, pero tu feedback 
          es muy valioso para su evolución.
        </p>

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="space-y-4 pt-4 border-t border-border">
          {/* Tipo de sugerencia */}
          <div className="space-y-2">
            <Label htmlFor="tipo">
              Tipo de sugerencia <span className="text-destructive">*</span>
            </Label>
            <Select
              value={formData.tipo}
              onValueChange={(value) => setFormData({ ...formData, tipo: value })}
            >
              <SelectTrigger id="tipo">
                <SelectValue placeholder="Selecciona una categoría" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="funcionalidad">Nueva funcionalidad</SelectItem>
                <SelectItem value="bug">Corrección de error</SelectItem>
                <SelectItem value="diseño">Mejora de diseño/UX</SelectItem>
                <SelectItem value="calculos">Cálculos y tarifas</SelectItem>
                <SelectItem value="exportacion">Exportación PDF</SelectItem>
                <SelectItem value="rendimiento">Rendimiento</SelectItem>
                <SelectItem value="otro">Otro</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Descripción */}
          <div className="space-y-2">
            <Label htmlFor="descripcion">
              Descripción de la sugerencia <span className="text-destructive">*</span>
            </Label>
            <Textarea
              id="descripcion"
              placeholder="Describe tu sugerencia con el máximo detalle posible..."
              value={formData.descripcion}
              onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
              rows={5}
              className="resize-none"
            />
            <p className="text-xs text-muted-foreground">
              Cuanto más detallada sea tu sugerencia, más fácil será implementarla
            </p>
          </div>

          {/* Email (opcional) */}
          <div className="space-y-2">
            <Label htmlFor="email">
              Email (opcional)
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="tu@email.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
            <p className="text-xs text-muted-foreground">
              Si dejas tu email, te informaré si implemento tu sugerencia
            </p>
          </div>

          {/* Botón enviar */}
          <Button 
            type="submit" 
            className="w-full" 
            size="lg"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                Enviando...
              </>
            ) : (
              <>
                <Send className="w-4 h-4 mr-2" />
                Enviar Sugerencia
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default SuggestionForm;