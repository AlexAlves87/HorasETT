import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Github, Star, GitFork, Code } from "lucide-react";

interface GitHubSectionProps {
  repoUrl?: string;
}

const GitHubSection = ({ repoUrl = "https://github.com/AlexAlves87/HorasETT" }: GitHubSectionProps) => {
  return (
    <Card className="shadow-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Github className="w-6 h-6" />
          Código Abierto
        </CardTitle>
        <CardDescription>
          El código fuente está disponible públicamente
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-foreground">
          HorasETT es software libre bajo licencia MIT. Puedes revisar el código, 
          reportar bugs, sugerir mejoras o incluso contribuir con tus propias funcionalidades.
        </p>

        <Button 
          variant="outline" 
          size="lg" 
          className="w-full"
          onClick={() => window.open(repoUrl, "_blank")}
        >
          <Github className="w-5 h-5 mr-2" />
          Ver en GitHub
        </Button>

        <div className="pt-2 space-y-3 border-t border-border">
          <h4 className="text-sm font-semibold">🤝 Formas de contribuir</h4>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="flex items-start gap-2">
              <Star className="w-4 h-4 text-warning mt-0.5" />
              <div>
                <p className="text-xs font-medium">Dale una estrella</p>
                <p className="text-xs text-muted-foreground">Ayuda a dar visibilidad</p>
              </div>
            </div>

            <div className="flex items-start gap-2">
              <Code className="w-4 h-4 text-primary mt-0.5" />
              <div>
                <p className="text-xs font-medium">Reporta bugs</p>
                <p className="text-xs text-muted-foreground">Issues en GitHub</p>
              </div>
            </div>

            <div className="flex items-start gap-2">
              <GitFork className="w-4 h-4 text-accent mt-0.5" />
              <div>
                <p className="text-xs font-medium">Contribuye código</p>
                <p className="text-xs text-muted-foreground">Pull requests bienvenidos</p>
              </div>
            </div>
          </div>
        </div>

        <div className="pt-2 border-t border-border">
          <p className="text-xs text-muted-foreground">
            <strong>Licencia:</strong> MIT License · Libre para usar, modificar y distribuir
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default GitHubSection;