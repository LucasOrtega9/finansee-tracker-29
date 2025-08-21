import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, NavLink } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Costs from "./pages/Costs";
import Budgets from "./pages/Budgets";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold">CAPEX & OPEX • TI</h1>
            <nav className="flex gap-6">
              <NavLink to="/" className={({ isActive }) => 
                `hover:text-primary transition-colors ${isActive ? 'text-primary font-medium' : 'text-muted-foreground'}`
              }>
                Dashboard
              </NavLink>
              <NavLink to="/costs" className={({ isActive }) => 
                `hover:text-primary transition-colors ${isActive ? 'text-primary font-medium' : 'text-muted-foreground'}`
              }>
                Custos
              </NavLink>
              <NavLink to="/budgets" className={({ isActive }) => 
                `hover:text-primary transition-colors ${isActive ? 'text-primary font-medium' : 'text-muted-foreground'}`
              }>
                Orçamentos
              </NavLink>
            </nav>
          </div>
        </div>
      </header>
      {children}
    </div>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Layout>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/costs" element={<Costs />} />
            <Route path="/budgets" element={<Budgets />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Layout>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
