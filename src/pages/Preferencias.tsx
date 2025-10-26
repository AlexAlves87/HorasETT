import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Moon, 
  Sun, 
  Trash2, 
  Globe, 
  Github,
  ExternalLink
} from "lucide-react";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import DataManagement from "@/components/DataManagement";
import { setLanguage as setStorageLanguage, getLanguage } from "@/utils/storage";

const Preferencias = () => {
  const [isDark, setIsDark] = useState(
    document.documentElement.classList.contains("dark")
  );
  const [language, setLanguage] = useState(getLanguage());

  const toggleTheme = () => {
    const newDark = !isDark;
    setIsDark(newDark);
    localStorage.setItem("darkMode", String(newDark));
    document.documentElement.classList.toggle("dark");
    toast.success(`Tema ${newDark ? 'oscuro' : 'claro'} activado`);
  };

  const handleLanguageChange = (value: string) => {
    setLanguage(value as 'es' | 'en');
    setStorageLanguage(value as 'es' | 'en');
    toast.success(`Idioma cambiado a ${value === 'es' ? 'Español' : 'English'}`);
  };

  const handleClearData = () => {
    localStorage.clear();
    toast.success("Todos los datos locales han sido eliminados");
  };

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">Preferencias</h1>
        <p className="text-muted-foreground">
          Personaliza tu experiencia en HorasETT
        </p>
      </div>

      {/* Gestión de Datos - NUEVO */}
      <DataManagement />

      {/* Apariencia */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle>Apariencia</CardTitle>
          <CardDescription>
            Personaliza la interfaz según tus preferencias
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label>Tema de Color</Label>
              <p className="text-sm text-muted-foreground">
                Cambia entre modo claro y oscuro
              </p>
            </div>
            <Button
              variant="outline"
              size="lg"
              onClick={toggleTheme}
              className="gap-2"
            >
              {isDark ? (
                <>
                  <Sun className="w-5 h-5" />
                  Modo Claro
                </>
              ) : (
                <>
                  <Moon className="w-5 h-5" />
                  Modo Oscuro
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Privacidad */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle>Privacidad y Datos</CardTitle>
          <CardDescription>
            Gestiona tus datos y privacidad
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-4 rounded-lg bg-accent/10 border border-accent/20">
            <p className="text-sm flex items-start gap-2">
              <span className="text-accent font-bold text-lg">🔒</span>
              <span>
                <strong>Tu privacidad es prioritaria.</strong> Todos tus datos se almacenan 
                únicamente en tu dispositivo. HorasETT no envía, recopila ni comparte ninguna 
                información personal con terceros.
              </span>
            </p>
          </div>

          <div className="pt-4">
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" className="gap-2">
                  <Trash2 className="w-4 h-4" />
                  Borrar Todos los Datos Locales
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Esta acción eliminará permanentemente todos los datos guardados en tu 
                    dispositivo, incluyendo horas, tarifas, ajustes y preferencias. 
                    Esta acción no se puede deshacer.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancelar</AlertDialogCancel>
                  <AlertDialogAction onClick={handleClearData}>
                    Eliminar Todo
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
            <p className="text-xs text-muted-foreground mt-2">
              Elimina todos los datos almacenados en tu navegador
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Información del proyecto */}
      <Card className="shadow-card border-primary/30 bg-primary/5">
        <CardHeader>
          <CardTitle>Acerca de HorasETT</CardTitle>
          <CardDescription>
            Proyecto de código abierto
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <p className="text-sm">
              <strong>HorasETT</strong> es una aplicación de código abierto diseñada para ayudar 
              a trabajadores temporales a entender mejor sus salarios y conocer sus derechos.
            </p>
            <p className="text-sm text-muted-foreground">
              Versión: 1.0.0 • Licencia: MIT
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-2">
            <Button
              variant="outline"
              className="gap-2"
              onClick={() => window.open("https://github.com/AlexAlves87/HorasETT", "_blank")}
            >
              <Github className="w-4 h-4" />
              Ver en GitHub
              <ExternalLink className="w-3 h-3" />
            </Button>
            <Button
              variant="outline"
              className="gap-2"
              onClick={() => toast.info("Página de documentación disponible próximamente")}
            >
              Documentación
              <ExternalLink className="w-3 h-3" />
            </Button>
          </div>

          <div className="pt-4 border-t border-border">
            <p className="text-xs text-muted-foreground">
              <strong>Contribuye:</strong> Este proyecto es auditable y libre. Si encuentras errores 
              o quieres proponer mejoras, ¡tu ayuda es bienvenida!
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Preferencias;