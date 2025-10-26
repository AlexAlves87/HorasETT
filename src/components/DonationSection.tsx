// src/components/DonationSection.tsx
import { useEffect, useRef } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Coffee, AlertCircle } from "lucide-react";

declare global {
  interface Window {
    kofiWidgetOverlay?: {
      draw: (username: string, options: Record<string, any>) => void;
    };
  }
}

interface DonationSectionProps {
  kofiUrl?: string;
  /** Muestra el widget flotante de Ko-fi (burbuja). */
  enableFloatingWidget?: boolean;
  /** Slug de Ko-fi (tu usuario). */
  kofiUser?: string;
  /** Texto del botón flotante. */
  floatingText?: string;
  /** Colores del botón flotante. */
  floatingBg?: string;
  floatingColor?: string;
}

const DonationSection = ({
  kofiUrl = "https://ko-fi.com/alexalves87",
  enableFloatingWidget = true,
  kofiUser = "alexalves87",
  floatingText = "Donar",
  floatingBg = "#0ea5e9",
  floatingColor = "#ffffff",
}: DonationSectionProps) => {
  const drawnRef = useRef(false);

  useEffect(() => {
    if (!enableFloatingWidget || drawnRef.current) return;

    const SCRIPT_ID = "kofi-overlay-widget";
    const existing = document.getElementById(SCRIPT_ID) as HTMLScriptElement | null;

    const onLoad = () => {
      if (drawnRef.current) return;
      window.kofiWidgetOverlay?.draw(kofiUser, {
        type: "floating-chat",
        "floating-chat.donateButton.text": floatingText,
        "floating-chat.donateButton.background-color": floatingBg,
        "floating-chat.donateButton.text-color": floatingColor,
      });
      drawnRef.current = true;
    };

    if (existing) {
      // Si ya existe el script, intenta dibujar directamente
      if (window.kofiWidgetOverlay) onLoad();
      else existing.addEventListener("load", onLoad, { once: true });
      return;
    }

    // Inyecta el script una sola vez
    const s = document.createElement("script");
    s.id = SCRIPT_ID;
    s.src = "https://storage.ko-fi.com/cdn/scripts/overlay-widget.js";
    s.async = true;
    s.addEventListener("load", onLoad, { once: true });
    document.body.appendChild(s);

    // Nota: Ko-fi no expone método para desmontar el overlay. Si necesitas ocultarlo,
    // hazlo vía CSS o no lo montes (enableFloatingWidget = false).
  }, [enableFloatingWidget, kofiUser, floatingText, floatingBg, floatingColor]);

  return (
    <Card className="shadow-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Coffee className="w-6 h-6 text-primary" />
          Apoya el Proyecto
        </CardTitle>
        <CardDescription>
          HorasETT es 100% gratuito, sin publicidad y open-source
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        <p className="text-sm text-foreground">
          Este proyecto lo mantengo en mi tiempo libre para ayudar a trabajadores de ETT
          a calcular sus salarios de forma transparente. Si te ha sido útil, considera
          hacer una pequeña donación. Cualquier aporte ayuda a mantener el proyecto vivo
          y seguir mejorándolo.
        </p>

        <div className="flex flex-col gap-3">
          <Button
            size="lg"
            className="w-full"
            onClick={() => window.open(kofiUrl, "_blank", "noopener,noreferrer")}
          >
            <Coffee className="w-5 h-5 mr-2" />
            Donar con Ko-fi
          </Button>

          <p className="text-xs text-center text-muted-foreground">
            Desde 1€ · Sin cuenta necesaria · PayPal o tarjeta
          </p>
        </div>

        <Card className="border-warning/50 bg-warning/5">
          <CardContent className="pt-4 pb-4">
            <div className="flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-warning mt-0.5 flex-shrink-0" />
              <p className="text-xs text-foreground">
                <strong>Aviso:</strong> Las donaciones a este proyecto NO son deducibles
                fiscalmente en tu declaración de la renta.
              </p>
            </div>
          </CardContent>
        </Card>

        <div className="pt-2 space-y-2 border-t border-border">
          <h4 className="text-sm font-semibold">💡 Compromiso de transparencia</h4>
          <ul className="text-xs text-muted-foreground space-y-1">
            <li>✅ Proyecto 100% open-source</li>
            <li>✅ Sin ánimo de lucro</li>
            <li>✅ Autoalojado (sin gastos de servidor)</li>
            <li>✅ Tu apoyo financia tiempo de desarrollo y mejoras</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};

export default DonationSection;
