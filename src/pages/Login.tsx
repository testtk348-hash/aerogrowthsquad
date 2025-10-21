import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/utils/toast";
import { Eye, EyeOff, Lock, Mail, Leaf, ArrowRight, Smartphone, Wifi, WifiOff } from "lucide-react";

interface LoginCredentials {
  email: string;
  password: string;
}

interface LoginPageProps {
  onLogin: () => void;
}

const Login = ({ onLogin }: LoginPageProps) => {
  const [credentials, setCredentials] = useState<LoginCredentials>({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Sample login credential
  const sampleCredential = { 
    email: "demo@aerogrowthsquad.com", 
    password: "demo123", 
    role: "Demo User" 
  };

  const handleInputChange = (field: keyof LoginCredentials, value: string) => {
    setCredentials(prev => ({ ...prev, [field]: value }));
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Basic validation
    if (!credentials.email || !credentials.password) {
      toast.error("Please fill in all fields");
      setIsLoading(false);
      return;
    }

    // Simulate API call
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Check credentials
      const isValidCredential = 
        credentials.email === sampleCredential.email && 
        credentials.password === sampleCredential.password;

      if (isValidCredential) {
        toast.success(`Welcome back! Logged in as ${sampleCredential.role}`);
        localStorage.setItem("isAuthenticated", "true");
        localStorage.setItem("userRole", sampleCredential.role);
        localStorage.setItem("userEmail", sampleCredential.email);
        onLogin();
      } else {
        toast.error("Invalid email or password. Please use the demo credentials below.");
      }
    } catch (error) {
      toast.error("Login failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSampleLogin = () => {
    setCredentials({ 
      email: sampleCredential.email, 
      password: sampleCredential.password 
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-900 via-green-800 to-teal-900 relative overflow-hidden">
      {/* Mobile-First Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-primary/10 via-transparent to-secondary/10"></div>
        <div className="absolute -top-20 -right-20 w-40 h-40 bg-primary/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-secondary/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      {/* Mobile-Optimized Container */}
      <div className="relative z-10 min-h-screen flex flex-col">
        {/* Header Section - Mobile First */}
        <div className="flex-shrink-0 pt-safe-top px-4 py-8">
          <div className="text-center space-y-4">
            {/* Logo */}
            <div className="flex items-center justify-center gap-3 mb-6">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-primary to-secondary rounded-2xl blur-lg opacity-75"></div>
                <div className="relative p-3 bg-gradient-to-r from-primary to-secondary rounded-2xl shadow-2xl">
                  <Leaf className="h-8 w-8 text-white" />
                </div>
              </div>
              <div className="text-left">
                <h1 className="text-2xl font-bold text-white">AeroGrowthSquad</h1>
                <p className="text-sm text-emerald-200">Vertical Farming</p>
              </div>
            </div>

            {/* Welcome Text */}
            <div className="space-y-2">
              <h2 className="text-3xl font-bold text-white">Welcome Back</h2>
              <p className="text-emerald-200 text-lg">Sign in to your farming dashboard</p>
            </div>

            {/* Status Indicators */}
            <div className="flex items-center justify-center gap-4 pt-2">
              <div className="flex items-center gap-2 px-3 py-1 bg-white/10 rounded-full backdrop-blur-sm">
                <Smartphone className="h-4 w-4 text-emerald-300" />
                <span className="text-xs text-emerald-200">Mobile Optimized</span>
              </div>
              <div className="flex items-center gap-2 px-3 py-1 bg-white/10 rounded-full backdrop-blur-sm">
                <WifiOff className="h-4 w-4 text-emerald-300" />
                <span className="text-xs text-emerald-200">Offline Ready</span>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content - Centered */}
        <div className="flex-1 flex items-center justify-center px-4 py-8">
          <div className="w-full max-w-sm space-y-6">
            {/* Login Form */}
            <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 overflow-hidden">
              <div className="p-6 space-y-6">
                <form onSubmit={handleLogin} className="space-y-5">
                  {/* Email Field */}
                  <div className="space-y-2">
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <Input
                        id="email"
                        type="email"
                        value={credentials.email}
                        onChange={(e) => handleInputChange("email", e.target.value)}
                        placeholder="Email address"
                        className="pl-12 h-14 bg-gray-50 border-gray-200 text-gray-900 placeholder:text-gray-500 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-300 rounded-2xl text-base"
                        required
                      />
                    </div>
                  </div>

                  {/* Password Field */}
                  <div className="space-y-2">
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        value={credentials.password}
                        onChange={(e) => handleInputChange("password", e.target.value)}
                        placeholder="Password"
                        className="pl-12 pr-12 h-14 bg-gray-50 border-gray-200 text-gray-900 placeholder:text-gray-500 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-300 rounded-2xl text-base"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-primary transition-colors p-1"
                      >
                        {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                      </button>
                    </div>
                  </div>

                  {/* Login Button */}
                  <Button
                    type="submit"
                    className="w-full h-14 text-lg font-semibold bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:-translate-y-0.5 rounded-2xl relative overflow-hidden group"
                    disabled={isLoading}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
                    {isLoading ? (
                      <>
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white mr-3" />
                        Signing In...
                      </>
                    ) : (
                      <>
                        Sign In
                        <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                      </>
                    )}
                  </Button>
                </form>
              </div>
            </div>

            {/* Demo Credentials */}
            <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-xl border border-white/20 overflow-hidden">
              <div className="p-5">
                <div className="text-center mb-4">
                  <h3 className="text-lg font-semibold text-gray-800 mb-1">Demo Access</h3>
                  <p className="text-sm text-gray-600">Tap to auto-fill credentials</p>
                </div>
                
                <button
                  onClick={handleSampleLogin}
                  className="w-full p-4 text-left rounded-2xl bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 hover:border-primary hover:from-emerald-100 hover:to-teal-100 transition-all duration-300 group"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-2 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-xl">
                      <Smartphone className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-800 group-hover:text-primary transition-colors">
                        {sampleCredential.role}
                      </p>
                      <p className="text-sm text-gray-600">Full dashboard access</p>
                    </div>
                  </div>
                  <div className="space-y-1 pl-11">
                    <p className="text-sm text-gray-700 font-mono">{sampleCredential.email}</p>
                    <p className="text-sm text-gray-600 font-mono">Password: {sampleCredential.password}</p>
                  </div>
                  <div className="flex items-center justify-center mt-3 pt-3 border-t border-emerald-200">
                    <span className="text-xs text-primary font-medium flex items-center gap-1">
                      Tap to auto-fill
                      <ArrowRight className="h-3 w-3" />
                    </span>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex-shrink-0 pb-safe-bottom px-4 py-6">
          <div className="text-center space-y-2">
            <div className="flex items-center justify-center gap-2">
              <div className="w-8 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent"></div>
              <div className="w-2 h-2 bg-gradient-to-r from-primary to-secondary rounded-full"></div>
              <div className="w-8 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent"></div>
            </div>
            <p className="text-sm text-emerald-200">© 2025 AeroGrowthSquad</p>
            <p className="text-xs text-emerald-300">Secure • Mobile • Offline Ready</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;