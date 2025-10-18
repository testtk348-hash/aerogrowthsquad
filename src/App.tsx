import { useState } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Header } from "./components/layout/Header";
import { Footer } from "./components/layout/Footer";
import { LoadingScreen } from "./components/LoadingScreen";
import Dashboard from "./pages/Dashboard";
import Metrics from "./pages/Metrics";
import PestMonitoring from "./pages/PestMonitoring";
import Consultation from "./pages/Consultation";
import Blog from "./pages/Blog";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";
import About from "./pages/About";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <LoadingScreen onLoadingComplete={() => setIsLoading(false)} />
          <div className="flex flex-col min-h-screen">
            {!isLoading && <Header />}
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/metrics" element={<Metrics />} />
            <Route path="/pest-monitoring" element={<PestMonitoring />} />
            <Route path="/consultation" element={<Consultation />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/about" element={<About />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
          <Footer />
          </div>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
