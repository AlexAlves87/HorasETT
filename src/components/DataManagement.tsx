import { useState, useRef } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, Upload, FileText, Database } from "lucide-react";
import { toast } from "sonner";
import { exportToJSON, exportToCSV, importFromJSON } from "@/utils/dataExport";

const DataManagement = () => {
  const [isImporting, setIsImporting] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImport = async (file: File) => {
    if (!file.name.endsWith('.json')) {
      toast.error("Solo se permiten archivos JSON para importar");
      return;
    }

    setIsImporting(true);
    try {
      await importFromJSON(file);
      toast.success("Datos importados correctamente", {
        description: "Todos tus datos han sido restaurados"
      });
    } catch (error) {
      toast.error("Error al importar", {
        description: "El archivo no es válido o está corrupto"
      });
    } finally {
      setIsImporting(false);
    }
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      await handleImport(file);
      event.target.value = '';
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const file = e.dataTransfer.files?.[0];
    if (file) {
      await handleImport(file);
    }
  };

  return (
    <Card className="shadow-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Database className="w-5 h-5 text-primary" />
          Gestión de Datos
        </CardTitle>
        <CardDescription>
          Exporta o importa todos tus datos para hacer copias de seguridad
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Exportar */}
        <div className="space-y-3">
          <h4 className="text-sm font-semibold">Exportar datos</h4>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={exportToJSON}
              className="flex-1"
            >
              <Download className="w-4 h-4 mr-2" />
              JSON (Backup)
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={exportToCSV}
              className="flex-1"
            >
              <FileText className="w-4 h-4 mr-2" />
              CSV (Excel)
            </Button>
          </div>
          <p className="text-xs text-muted-foreground">
            JSON para importar en otro dispositivo. CSV para análisis en Excel.
          </p>
        </div>

        {/* Importar con Drag & Drop */}
        <div className="space-y-3 pt-3 border-t border-border">
          <h4 className="text-sm font-semibold">Importar datos</h4>
          
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`
              relative border-2 border-dashed rounded-lg p-6 transition-all
              ${isDragging 
                ? 'border-primary bg-primary/5 scale-[0.98]' 
                : 'border-border hover:border-primary/50 hover:bg-secondary/20'
              }
              ${isImporting ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
            `}
            onClick={() => !isImporting && fileInputRef.current?.click()}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".json"
              onChange={handleFileChange}
              disabled={isImporting}
              className="hidden"
            />
            
            <div className="flex flex-col items-center gap-2 text-center">
              <Upload className={`w-8 h-8 ${isDragging ? 'text-primary' : 'text-muted-foreground'}`} />
              <div>
                <p className="text-sm font-medium">
                  {isImporting ? 'Importando...' : isDragging ? 'Suelta el archivo aquí' : 'Arrastra tu archivo JSON aquí'}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  o haz click para seleccionar
                </p>
              </div>
            </div>
          </div>
          
          <p className="text-xs text-muted-foreground">
            Solo archivos JSON exportados desde HorasETT. Esto sobrescribirá todos tus datos actuales.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default DataManagement;