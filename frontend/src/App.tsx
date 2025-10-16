import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import Layout from "./components/Layout";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Register from "./pages/Register";
import AssociateDashboard from "./pages/AssociateDashboard";
import ManagerDashboard from "./pages/ManagerDashboard";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

// Component to conditionally render Layout based on route
const AppContent = () => {
  const location = useLocation();
  const isDashboardRoute = location.pathname === '/associate' || location.pathname === '/manager';

  if (isDashboardRoute) {
    // Dashboard routes render without the public Layout (no header/footer)
    return (
      <Routes>
        <Route path="/associate" element={<AssociateDashboard />} />
        <Route path="/manager" element={<ManagerDashboard />} />
      </Routes>
    );
  }

  // Public routes render with Layout (includes header/footer)
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        {/* Legacy routes for backward compatibility */}
        <Route path="/dashboard" element={<Navigate to="/login" replace />} />
        {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Layout>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;