import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  AlertTriangle, 
  FileText, 
  Scale, 
  DollarSign, 
  ExternalLink,
  Shield,
  UserCheck,
  Briefcase,
  Clock,
  Calendar,
  HardHat
} from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const Derechos = () => {
  const derechosInfo = [
    {
      icon: AlertTriangle,
      title: "Acoso Laboral",
      description: "Si sufres acoso psicológico (mobbing), acoso sexual o acoso por razón de sexo, tienes derecho a denunciarlo. Tu empresa está legalmente obligada a tener un protocolo de prevención y actuación frente al acoso.",
      detalle: "Es fundamental que documentes todos los incidentes (fecha, hora, testigos). Consulta el protocolo interno de tu empresa, contacta con los representantes de los trabajadores y, si es necesario, presenta denuncia ante la Inspección de Trabajo.",
      actions: [
        { label: "Buzón de denuncias ITSS", url: "https://oeitss.gob.es/tramites/personas-trabajadoras/denuncia.html" },
        { label: "Protocolo oficial BOE", url: "https://www.boe.es/diario_boe/txt.php?id=BOE-A-2024-6273" }
      ],
      color: "destructive"
    },
    {
      icon: DollarSign,
      title: "Impagos y Salarios",
      description: "Tu salario debe pagarse puntualmente. Dispones de UN AÑO desde la fecha de impago para reclamarlo. Pasado ese plazo, el derecho prescribe y no podrás reclamar.",
      detalle: "Proceso: 1) Presenta una papeleta de conciliación en el SMAC de tu comunidad autónoma (esto interrumpe la prescripción). 2) Si no hay acuerdo, presenta demanda ante el Juzgado de lo Social.",
      actions: [
        { label: "Información sobre trámites", url: "https://oeitss.gob.es/tramites/personas-trabajadoras/denuncia.html" },
        { label: "FOGASA (Fondo de Garantía)", url: "https://www.mites.gob.es/fogasa/default.html" }
      ],
      color: "warning"
    },
    {
      icon: UserCheck,
      title: "Contratos Temporales",
      description: "Los trabajadores temporales tienen los mismos derechos que los indefinidos: igual salario, vacaciones, formación y protección social. Además, al finalizar el contrato tienes derecho a una indemnización de 12 días de salario por año trabajado.",
      detalle: "Tu contrato se convierte en indefinido si: se superan los plazos máximos legales, falta justificación de la causa temporal, o no te dan de alta en la Seguridad Social tras el período de prueba.",
      actions: [
        { label: "Estatuto de los Trabajadores", url: "https://www.boe.es/buscar/act.php?id=BOE-A-2015-11430" },
        { label: "Guía contratos temporales (SEPE)", url: "https://www.sepe.es/HomeSepe/que-es-el-sepe/comunicacion-institucional/publicaciones/publicaciones-oficiales/listado-pub-empleo/guia-contratos/guia-contratos-introduccion/contrato-temporal.html" }
      ],
      color: "primary"
    },
    {
      icon: Scale,
      title: "Finiquito, Indemnización y Paro",
      description: "Es crucial diferenciar tres conceptos: El FINIQUITO es la liquidación de cantidades pendientes (se cobra siempre). La INDEMNIZACIÓN es una compensación por ciertos despidos. La PRESTACIÓN POR DESEMPLEO (paro) la paga el SEPE, no la empresa.",
      detalle: "Finiquito: salario pendiente + pagas extras proporcionales + vacaciones no disfrutadas. Indemnización: 20 días/año (despido objetivo) o 33 días/año (despido improcedente). El paro se calcula según tus cotizaciones.",
      actions: [
        { label: "Calcular prestación por desempleo", url: "https://sede.sepe.gob.es/dgsimulador/introSimulador.do" },
        { label: "Papeleta de conciliación", url: "https://oeitss.gob.es/tramites/personas-trabajadoras/denuncia.html" }
      ],
      color: "accent"
    },
    {
      icon: FileText,
      title: "Convenios Colectivos",
      description: "Tu convenio colectivo regula condiciones específicas como salarios, jornada, descansos y permisos, normalmente mejorando los mínimos legales. Tienes derecho a conocer qué convenio te aplica.",
      detalle: "Para encontrar tu convenio: accede al REGCON, busca por nombre del sector y filtra por tu provincia o comunidad autónoma. Busca el acuerdo vigente más reciente.",
      actions: [
        { label: "Consultar REGCON (oficial)", url: "https://expinterweb.mites.gob.es/regcon/pub/buscadorTextosEstatal" },
        { label: "Registro de convenios", url: "https://expinterweb.mites.gob.es/regcon/" }
      ],
      color: "secondary"
    },
    {
      icon: Briefcase,
      title: "Prestaciones por Desempleo",
      description: "Si pierdes tu empleo, puedes solicitar la prestación contributiva si has cotizado al menos 360 días en los últimos 6 años. La cuantía es el 70% de tu base reguladora los primeros 6 meses.",
      detalle: "Duración: mínimo 4 meses, máximo 2 años según lo cotizado. Solicítala online en la Sede Electrónica del SEPE con certificado digital, Cl@ve o DNIe.",
      actions: [
        { label: "Solicitar prestación (Sede SEPE)", url: "https://sede.sepe.gob.es/portalSede/es/procedimientos-y-servicios/personas/proteccion-por-desempleo/solicitud-de-prestaciones.html" },
        { label: "Calculadora de prestaciones", url: "https://sede.sepe.gob.es/dgsimulador/introSimulador.do" }
      ],
      color: "primary"
    },
    {
      icon: Clock,
      title: "Jornada, Descansos y Vacaciones",
      description: "Jornada máxima: 40h semanales (9h diarias salvo convenio). Descanso entre jornadas: mínimo 12h. Descanso en jornada continua >6h: mínimo 15 minutos. Vacaciones: mínimo 30 días naturales al año, no sustituibles por dinero.",
      detalle: "La empresa debe llevar registro diario de tu jornada. Si no se respetan estos límites, puedes denunciarlo ante la Inspección de Trabajo.",
      actions: [
        { label: "Estatuto (Jornada art. 34)", url: "https://www.boe.es/buscar/act.php?id=BOE-A-2015-11430#a34" },
        { label: "Estatuto (Vacaciones art. 38)", url: "https://www.boe.es/buscar/act.php?id=BOE-A-2015-11430#a38" }
      ],
      color: "primary"
    },
    {
      icon: HardHat,
      title: "Prevención de Riesgos Laborales",
      description: "Tienes derecho a trabajar en condiciones seguras. Tu empresa debe evaluar riesgos, planificar la prevención, proporcionarte EPIs gratuitos (cascos, guantes, etc.) y formarte en seguridad. Puedes interrumpir el trabajo si hay riesgo grave.",
      detalle: "Obligaciones del empresario: evaluar riesgos, proporcionar EPIs, formar e informar. Tus deberes: usar correctamente los EPIs, informar de riesgos y cooperar para garantizar la seguridad.",
      actions: [
        { label: "Ley de Prevención de Riesgos", url: "https://www.boe.es/buscar/act.php?id=BOE-A-1995-24292" },
        { label: "Denunciar incumplimientos", url: "https://oeitss.gob.es/tramites/personas-trabajadoras/denuncia.html" }
      ],
      color: "warning"
    }
  ];

  const permisosRetribuidos = [
    { motivo: "Matrimonio o pareja de hecho", duracion: "15 días naturales" },
    { motivo: "Accidente/enfermedad grave, hospitalización", duracion: "5 días laborables (cónyuge, pareja o hasta 2º grado)" },
    { motivo: "Fallecimiento (cónyuge, pareja, hasta 2º grado)", duracion: "2 días hábiles (4 si requiere desplazamiento)" },
    { motivo: "Traslado de domicilio habitual", duracion: "1 día" },
  ];

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <Shield className="w-8 h-8 text-primary" />
          Tus Derechos Laborales
        </h1>
        <p className="text-muted-foreground">
          Información completa y verificada sobre tus derechos como trabajador en España
        </p>
      </div>

      {/* Tarjetas de derechos con acordeones */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {derechosInfo.map((derecho, index) => {
          const Icon = derecho.icon;
          
          return (
            <Card key={index} className="shadow-card hover:shadow-card-hover transition-shadow">
              <CardHeader>
                <div className="flex items-start gap-3">
                  <div className={`p-2 rounded-lg bg-${derecho.color}/10`}>
                    <Icon className={`w-6 h-6 text-${derecho.color}`} />
                  </div>
                  <div className="flex-1">
                    <CardTitle className="text-lg">{derecho.title}</CardTitle>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <CardDescription className="text-sm">
                  {derecho.description}
                </CardDescription>

                {derecho.detalle && (
                  <Accordion type="single" collapsible>
                    <AccordionItem value="detalle" className="border-0">
                      <AccordionTrigger className="text-sm py-2 hover:no-underline">
                        Ver más detalles
                      </AccordionTrigger>
                      <AccordionContent className="text-sm text-muted-foreground">
                        {derecho.detalle}
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                )}

                <div className="space-y-2">
                  {derecho.actions.map((action, actionIndex) => (
                    <Button
                      key={actionIndex}
                      variant="outline"
                      size="sm"
                      className="w-full justify-between"
                      onClick={() => window.open(action.url, "_blank")}
                    >
                      {action.label}
                      <ExternalLink className="w-4 h-4" />
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Tabla de permisos retribuidos */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            Permisos Retribuidos Clave
          </CardTitle>
          <CardDescription>
            Principales permisos laborales según el Estatuto de los Trabajadores
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-2">Motivo</th>
                  <th className="text-left p-2">Duración</th>
                </tr>
              </thead>
              <tbody>
                {permisosRetribuidos.map((permiso, index) => (
                  <tr key={index} className="border-b last:border-0">
                    <td className="p-2">{permiso.motivo}</td>
                    <td className="p-2 text-muted-foreground">{permiso.duracion}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-xs text-muted-foreground mt-4">
            Nota: Estos son los permisos mínimos legales. Tu convenio colectivo puede mejorarlos.
          </p>
        </CardContent>
      </Card>

      {/* Información de contacto oficial */}
      <Card className="shadow-card border-primary/30 bg-primary/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5" />
            Organismos Oficiales de Ayuda
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <h4 className="font-semibold text-sm">Inspección de Trabajo y Seguridad Social</h4>
              <p className="text-sm text-muted-foreground">
                Denuncia fraudes, irregularidades y condiciones laborales abusivas
              </p>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => window.open("https://expinterweb.mites.gob.es/buzonfraude/", "_blank")}
              >
                Buzón de denuncias
                <ExternalLink className="w-4 h-4 ml-2" />
              </Button>
            </div>

            <div className="space-y-2">
              <h4 className="font-semibold text-sm">SEPE (Servicio Público de Empleo)</h4>
              <p className="text-sm text-muted-foreground">
                Prestaciones por desempleo, formación y orientación laboral
              </p>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => window.open("https://www.sepe.es", "_blank")}
              >
                Acceder a SEPE
                <ExternalLink className="w-4 h-4 ml-2" />
              </Button>
            </div>

            <div className="space-y-2">
              <h4 className="font-semibold text-sm">Ministerio de Trabajo</h4>
              <p className="text-sm text-muted-foreground">
                Información oficial sobre normativa laboral y convenios
              </p>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => window.open("https://www.mites.gob.es", "_blank")}
              >
                Portal del Ministerio
                <ExternalLink className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Aviso Legal */}
      <Card className="border-warning/50 bg-warning/5">
        <CardContent className="pt-6">
          <p className="text-sm">
            <strong>⚖️ Aviso Legal:</strong> La información proporcionada en esta página es de carácter 
            orientativo y no constituye asesoramiento legal profesional. No sustituye la consulta con un 
            abogado o graduado social. Los contenidos se basan en la legislación española vigente, pero 
            las circunstancias particulares de cada caso pueden requerir análisis específico. 
            Consulta siempre con profesionales cualificados para tu situación concreta.
          </p>
        </CardContent>
      </Card>

      {/* Aviso de empoderamiento */}
      <Card className="border-accent/50 bg-accent/5">
        <CardContent className="pt-6">
          <p className="text-sm">
            <strong>✅ Recuerda:</strong> Conocer tus derechos es el primer paso para defenderlos. 
            No dudes en contactar con los organismos oficiales si tienes dudas o enfrentas situaciones 
            irregulares. Tu bienestar laboral es prioritario y existen mecanismos legales para protegerte. 
            Los enlaces proporcionados te llevan directamente a las fuentes oficiales más relevantes.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default Derechos;