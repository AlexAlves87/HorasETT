import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import ScrollToTop from "./components/ScrollToTop";
import Dashboard from "./pages/Dashboard";
import ParteDiario from "./pages/ParteDiario";
import Horas from "./pages/Horas";
import Calculo from "./pages/Calculo";
import Derechos from "./pages/Derechos";
import Preferencias from "./pages/Preferencias";
import Apoyo from "./pages/Apoyo";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <ScrollToTop />
        <Layout>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/parte-diario" element={<ParteDiario />} />
            <Route path="/horas" element={<Horas />} />
            <Route path="/calculo" element={<Calculo />} />
            <Route path="/derechos" element={<Derechos />} />
            <Route path="/apoyo" element={<Apoyo />} />
            <Route path="/preferencias" element={<Preferencias />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Layout>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;