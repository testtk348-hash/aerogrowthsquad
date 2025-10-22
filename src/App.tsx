import { useState, useEffect } from "react";

import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useNavigationGuard } from "./hooks/useNavigationGuard";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { Header } from "./components/layout/Header";
import { Footer } from "./components/layout/Footer";
import { LoadingScreen } from "./components/LoadingScreen";
import { initializeMobileApp } from "./mobile-init";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Metrics from "./pages/Metrics";
import PestMonitoring from "./pages/PestMonitoring";
import Consultation from "./pages/Consultation";
import Blog from "./pages/Blog";
import Contact from "./pages/Contact";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";
import About from "./pages/About";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const NavigationGuard = ({ children }: { children: React.ReactNode }) => {
  const { isRapidNavigation } = useNavigationGuard();
  const [showWarning, setShowWarning] = useState(false);

  useEffect(() => {
    if (isRapidNavigation) {
      setShowWarning(true);
      const timer = setTimeout(() => setShowWarning(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [isRapidNavigation]);

  return (
    <div className={isRapidNavigation ? 'navigation-blocked' : ''}>
      {showWarning && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 bg-yellow-500 text-white px-4 py-2 rounded-lg shadow-lg">
          Navigation temporarily disabled to prevent accidental changes
        </div>
      )}
      {children}
    </div>
  );
};

const AppContent = () => {
  const [isLoading, setIsLoading] = useState(true);
  const { isAuthenticated, login } = useAuth();

  useEffect(() => {
    // Initialize mobile app features
    initializeMobileApp();
  }, []);

  if (!isAuthenticated) {
    return <Login onLogin={login} />;
  }

  return (
    <BrowserRouter>
      <NavigationGuard>
        <LoadingScreen onLoadingComplete={() => setIsLoading(false)} />
        <div className="flex flex-col min-h-screen bg-gradient-to-br from-gray-50 to-white">
          {!isLoading && <Header />}
          <main className="flex-1 main-content">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/metrics" element={<Metrics />} />
              <Route path="/pest-monitoring" element={<PestMonitoring />} />
              <Route path="/consultation" element={<Consultation />} />
              <Route path="/blog" element={<Blog />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/about" element={<About />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </NavigationGuard>
    </BrowserRouter>
  );
};

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <AppContent />
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default App;
