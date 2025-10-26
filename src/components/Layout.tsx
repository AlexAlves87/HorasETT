import { ReactNode } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { 
  LayoutDashboard, 
  Clock, 
  Calculator, 
  Shield, 
  SlidersHorizontal,
  Moon,
  Sun,
  CalendarCheck,
  Heart,
  Menu
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const location = useLocation();
  const [isDark, setIsDark] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const darkMode = localStorage.getItem("darkMode") === "true" || 
      (!localStorage.getItem("darkMode") && window.matchMedia("(prefers-color-scheme: dark)").matches);
    setIsDark(darkMode);
    if (darkMode) {
      document.documentElement.classList.add("dark");
    }
  }, []);

  const toggleTheme = () => {
    const newDark = !isDark;
    setIsDark(newDark);
    localStorage.setItem("darkMode", String(newDark));
    document.documentElement.classList.toggle("dark");
  };

  const navItems = [
    { path: "/", icon: LayoutDashboard, label: "Dashboard" },
    { path: "/parte-diario", icon: CalendarCheck, label: "Parte Diario" },
    { path: "/horas", icon: Clock, label: "Horas y Tarifas" },
    { path: "/calculo", icon: Calculator, label: "Detalle Cálculo" },
    { path: "/derechos", icon: Shield, label: "Tus Derechos" },
    { path: "/apoyo", icon: Heart, label: "Apoyo" },
    { path: "/preferencias", icon: SlidersHorizontal, label: "Preferencias" },
  ];

  return (
    <div className="flex min-h-screen w-full">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex w-64 glass-sidebar flex-col">
        <div className="p-6 border-b border-border">
          <div className="flex items-center gap-3">
            <img src="/horasett_logo.png" alt="HorasETT Logo" className="w-10 h-10" />
            <div>
              <h1 className="text-2xl font-bold text-gradient-primary">HorasETT</h1>
              <p className="text-sm text-muted-foreground">Tu salario transparente</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                  isActive
                    ? "bg-primary text-primary-foreground font-medium shadow-md"
                    : "text-foreground hover:bg-secondary"
                }`}
              >
                <Icon className="w-5 h-5" />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </nav>

        <div className="p-4 border-t border-border">
          <Button
            variant="outline"
            size="sm"
            onClick={toggleTheme}
            className="w-full justify-start gap-2"
          >
            {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            {isDark ? "Modo Claro" : "Modo Oscuro"}
          </Button>
        </div>
      </aside>

      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 left-0 right-0 glass-nav z-50">
        <div className="flex items-center justify-between p-4">
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="sm">
                <Menu className="w-6 h-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-64 p-0 glass-card">
              <div className="p-6 border-b border-border">
                <div className="flex items-center gap-3">
                  <img src="/horasett_logo.png" alt="HorasETT Logo" className="w-10 h-10" />
                  <div>
                    <h1 className="text-2xl font-bold text-gradient-primary">HorasETT</h1>
                    <p className="text-sm text-muted-foreground">Tu salario transparente</p>
                  </div>
                </div>
              </div>
              
              <nav className="p-4 space-y-2">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = location.pathname === item.path;
                  
                  return (
                    <NavLink
                      key={item.path}
                      to={item.path}
                      onClick={() => setIsOpen(false)}
                      className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                        isActive
                          ? "bg-primary text-primary-foreground font-medium shadow-md"
                          : "text-foreground hover:bg-secondary"
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      <span>{item.label}</span>
                    </NavLink>
                  );
                })}
              </nav>

              <div className="p-4 border-t border-border absolute bottom-0 left-0 right-0">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={toggleTheme}
                  className="w-full justify-start gap-2"
                >
                  {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                  {isDark ? "Modo Claro" : "Modo Oscuro"}
                </Button>
              </div>
            </SheetContent>
          </Sheet>

          <div className="flex items-center gap-2">
            <img src="/horasett_logo.png" alt="HorasETT Logo" className="w-8 h-8" />
            <h1 className="text-xl font-bold text-gradient-primary">HorasETT</h1>
          </div>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleTheme}
          >
            {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <div className="pt-16 md:pt-0 pb-0 md:pb-0">
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;