# HorasETT - Calculadora de Salario para Trabajadores Temporales

**HorasETT** es una aplicación web moderna y empática diseñada para trabajadores de ETT (Empresas de Trabajo Temporal) que desean calcular su salario neto real aproximado, registrar sus horas trabajadas y conocer sus derechos laborales.

## 🎯 Características Principales

### 📊 Dashboard Interactivo
- Resumen mensual de horas trabajadas (diurnas, nocturnas, festivas, extras)
- Visualización con gráfico circular del desglose salarial
- Cálculo automático de salario bruto y neto estimado
- Acceso rápido a funciones principales

### ⏰ Registro de Horas y Tarifas
- Formulario intuitivo para introducir:
  - Horas diurnas (jornada normal)
  - Horas nocturnas (22:00-06:00, +25%)
  - Horas festivas (domingos y festivos, +75%)
  - Horas extras (límite 80h/año, +50%)
- Configuración personalizada de tarifas por hora
- Guardado de valores predeterminados

### ⚙️ Ajustes Personales
- Configuración de % IRPF según situación personal
- Registro de convenio colectivo aplicable
- Personalización de cotizaciones a la Seguridad Social:
  - Contingencias comunes (6.65%)
  - Desempleo (1.55%)
  - Formación profesional (0.10%)
- Tooltips informativos con explicaciones

### 📈 Detalle del Cálculo
- Tabla completa de ingresos brutos por tipo de hora
- Desglose detallado de deducciones (IRPF, SS, desempleo, formación)
- Gráfico de barras comparativo
- Visualización del salario neto real aproximado
- Funciones de exportación (PDF/CSV) - *próximamente*

### 🛡️ Tus Derechos Laborales
Información clara y accesible sobre:
- Acoso laboral y cómo denunciarlo
- Impagos e irregularidades salariales
- Derechos en contratos temporales
- Finiquitos y despidos
- Convenios colectivos
- Prestaciones por desempleo

Enlaces directos a organismos oficiales:
- Inspección de Trabajo
- SEPE (Servicio Público de Empleo)
- Ministerio de Trabajo
- Sindicatos (UGT, CCOO)

### 🎨 Preferencias
- Toggle modo claro/oscuro
- Selector de idioma (ES/EN) - *próximamente*
- Gestión de privacidad y datos locales
- Información del proyecto open source

## 🎨 Diseño

### Paleta de Colores
- **Primary:** Azul profesional (`hsl(210, 80%, 45%)`)
- **Accent:** Verde éxito (`hsl(142, 70%, 45%)`)
- **Warning:** Naranja suave (`hsl(25, 90%, 55%)`)
- **Destructive:** Rojo error (`hsl(0, 70%, 50%)`)
- Modo oscuro completo con paleta adaptada

### Tipografía
- **Fuente:** Inter (Google Fonts)
- Sistema jerárquico claro con pesos 300-700

### Componentes UI
- Diseño basado en shadcn/ui
- Tarjetas con sombras suaves
- Transiciones fluidas
- Gráficos con recharts
- Formularios validados
- Tooltips informativos

## 🏗️ Estructura del Proyecto

```
src/
├── components/
│   ├── ui/                  # Componentes shadcn/ui
│   ├── Layout.tsx           # Layout principal con sidebar y navegación
│   └── MetricCard.tsx       # Tarjeta de métrica reutilizable
│
├── pages/
│   ├── Dashboard.tsx        # Pantalla principal con resumen
│   ├── Horas.tsx           # Formulario de horas y tarifas
│   ├── Ajustes.tsx         # Configuración personal
│   ├── Calculo.tsx         # Detalle del cálculo completo
│   ├── Derechos.tsx        # Información de derechos laborales
│   ├── Preferencias.tsx    # Preferencias de la app
│   └── NotFound.tsx        # Página 404
│
├── App.tsx                  # Configuración de rutas
├── index.css               # Design system y estilos globales
└── main.tsx                # Punto de entrada
```

## 🚀 Navegación

### Desktop
- Sidebar lateral con iconos y etiquetas
- Toggle de tema en la parte inferior
- Resalta la ruta activa

### Mobile
- Header superior con logo y toggle de tema
- Navegación inferior sticky con iconos
- Diseño responsive adaptado

## 📱 Rutas de la Aplicación

| Ruta | Componente | Descripción |
|------|-----------|-------------|
| `/` | Dashboard | Resumen mensual y métricas |
| `/horas` | Horas | Registro de horas y tarifas |
| `/ajustes` | Ajustes | Configuración personal |
| `/calculo` | Calculo | Detalle completo del cálculo |
| `/derechos` | Derechos | Información sobre derechos |
| `/preferencias` | Preferencias | Configuración de la app |

## 🔒 Privacidad

**100% Local - Sin Backend**

- Todos los datos se almacenan en `localStorage` del navegador
- No se envía ninguna información a servidores externos
- No se recopilan datos personales
- Código auditable y open source

## ⚠️ Aviso Legal

Los cálculos proporcionados por HorasETT son **orientativos** y no sustituyen una nómina oficial. Las retenciones y cotizaciones pueden variar según:
- Situación personal y familiar
- Comunidad autónoma
- Convenio colectivo aplicable
- Otros factores laborales

**Siempre consulta tu nómina oficial y, en caso de dudas, contacta con los organismos competentes.**

## 🛠️ Tecnologías

- **React 18** - Framework UI
- **TypeScript** - Tipado estático
- **Vite** - Build tool
- **Tailwind CSS** - Estilos
- **shadcn/ui** - Componentes UI
- **React Router** - Navegación
- **Recharts** - Gráficos
- **Lucide React** - Iconos

## 📦 Instalación y Desarrollo

```bash
# Clonar el repositorio
git clone https://github.com/horasett/horasett.git
cd horasett

# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm run dev

# Build para producción
npm run build
```

## 📄 Licencia

Este proyecto está bajo licencia **MIT** - software libre y auditable.

## 🤝 Contribuir

¡Las contribuciones son bienvenidas! Si encuentras errores o quieres proponer mejoras:

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 🔗 Enlaces Útiles

- [Inspección de Trabajo](https://expinterweb.mites.gob.es/buzonfraude/)
- [SEPE](https://www.sepe.es)
- [Consulta de Convenios](https://www.convenioscolectivos.com/)
- [Estatuto de los Trabajadores](https://www.boe.es/buscar/act.php?id=BOE-A-2015-11430)

## 👥 Contacto

**HorasETT** es un proyecto comunitario. Para dudas, sugerencias o reportar problemas, abre un issue en GitHub.

---

**Desarrollado con ❤️ para trabajadores temporales**
