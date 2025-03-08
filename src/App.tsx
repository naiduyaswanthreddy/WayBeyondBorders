
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Bookings from "./pages/Bookings";
import RoutesPage from "./pages/Routes";
import Analytics from "./pages/Analytics";
import Compare from "./pages/Compare";
import NotFound from "./pages/NotFound";
import { RouteChangeAlertProvider } from "./components/alerts/RouteChangeAlertProvider";
import { EcoPointsProvider } from "./context/EcoPointsContext";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <EcoPointsProvider>
        <RouteChangeAlertProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/login" element={<Login />} />
              <Route path="/bookings" element={<Bookings />} />
              <Route path="/routes" element={<RoutesPage />} />
              <Route path="/analytics" element={<Analytics />} />
              <Route path="/compare" element={<Compare />} />
              {/* Redirect /dashboard to /bookings */}
              <Route path="/dashboard" element={<Navigate to="/bookings" replace />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </RouteChangeAlertProvider>
      </EcoPointsProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
