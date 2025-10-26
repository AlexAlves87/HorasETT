import { useEffect, useRef } from 'react';
import DonationSection from "@/components/DonationSection";
import GitHubSection from "@/components/GitHubSection";
import SuggestionForm from "@/components/SuggestionForm";
import { Heart } from "lucide-react";
import { useLocation } from "react-router-dom";

const Apoyo = () => {
  const KOFI_URL = "https://ko-fi.com/alexalves87";
  const GITHUB_URL = "https://github.com/AlexAlves87/HorasETT";
  const APPS_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbyqOxqZYJODe4pjHDOHY-xyIQ7fgMPJ8LRMOsaXEtSFLD-PgvUDXc4n7aHn5hDe2EJS/exec";
  
  const widgetLoaded = useRef(false);
  const location = useLocation();

  // Ocultar widget globalmente cuando NO estamos en /apoyo
  useEffect(() => {
    const hideWidget = () => {
      const elements = document.querySelectorAll('.floatingchat-container-wrap, iframe[src*="ko-fi.com"], [id*="kofi"]');
      elements.forEach(el => {
        (el as HTMLElement).style.visibility = 'hidden';
        (el as HTMLElement).style.opacity = '0';
        (el as HTMLElement).style.pointerEvents = 'none';
        (el as HTMLElement).style.display = 'none';
      });
    };

    if (location.pathname !== '/apoyo') {
      hideWidget();
      // Forzar ocultamiento múltiple por si acaso
      const interval = setInterval(hideWidget, 100);
      setTimeout(() => clearInterval(interval), 1000);
    }
  }, [location.pathname]);

  useEffect(() => {
    const loadWidget = () => {
      // @ts-ignore
      if (window.kofiWidgetOverlay && !widgetLoaded.current) {
        widgetLoaded.current = true;
        // @ts-ignore
        window.kofiWidgetOverlay.draw('alexalves87', {
          'type': 'floating-chat',
          'floating-chat.donateButton.text': 'Support me',
          'floating-chat.donateButton.background-color': 'hsl(210, 80%, 45%)',
          'floating-chat.donateButton.text-color': '#ffffff'
        });
      }
    };

    const showWidget = () => {
      const elements = document.querySelectorAll('.floatingchat-container-wrap, iframe[src*="ko-fi.com"]');
      elements.forEach(el => {
        (el as HTMLElement).style.visibility = 'visible';
        (el as HTMLElement).style.opacity = '1';
        (el as HTMLElement).style.pointerEvents = 'auto';
        (el as HTMLElement).style.display = 'block';
      });
    };

    // @ts-ignore
    if (window.kofiWidgetOverlay) {
      const widget = document.querySelector('.floatingchat-container-wrap');
      if (widget) {
        showWidget();
      } else {
        loadWidget();
        setTimeout(showWidget, 500);
      }
    } else {
      const script = document.createElement('script');
      script.src = 'https://storage.ko-fi.com/cdn/scripts/overlay-widget.js';
      script.async = true;
      script.onload = () => {
        loadWidget();
        setTimeout(showWidget, 500);
      };
      document.body.appendChild(script);
    }

    return () => {
      const elements = document.querySelectorAll('.floatingchat-container-wrap, iframe[src*="ko-fi.com"], [id*="kofi"]');
      elements.forEach(el => {
        (el as HTMLElement).style.visibility = 'hidden';
        (el as HTMLElement).style.opacity = '0';
        (el as HTMLElement).style.pointerEvents = 'none';
        (el as HTMLElement).style.display = 'none';
      });
    };
  }, []);

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <Heart className="w-8 h-8 text-primary" />
          Apoya HorasETT
        </h1>
        <p className="text-muted-foreground">
          Ayuda a mantener este proyecto gratuito y open-source
        </p>
      </div>

      <div className="bg-primary/5 border border-primary/20 rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-3">
          Este no es mi proyecto, es <span className="text-gradient-primary">nuestro</span>
        </h2>
        <p className="text-foreground leading-relaxed">
          HorasETT nació de la necesidad de tener una herramienta transparente y accesible 
          para calcular salarios en el sector de las ETT. Es completamente gratuito, sin 
          publicidad, sin muros de pago y con el código abierto para que cualquiera pueda 
          verificar cómo funciona. Lo mantengo en mi tiempo libre porque creo en el software 
          libre y en empoderar a los trabajadores con herramientas que les pertenecen.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-6">
          <DonationSection kofiUrl={KOFI_URL} />
          <GitHubSection repoUrl={GITHUB_URL} />
        </div>
        <div id="sugerencias">
          <SuggestionForm appsScriptUrl={APPS_SCRIPT_URL} />
        </div>
      </div>

      <div className="text-center pt-6 border-t border-border">
        <p className="text-sm text-muted-foreground">
          Gracias por usar HorasETT y por considerar apoyar el proyecto. 
          Cada pequeño gesto cuenta y me motiva a seguir mejorándolo. 💙
        </p>
      </div>
    </div>
  );
};

export default Apoyo;