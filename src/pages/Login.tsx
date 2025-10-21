import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Eye, EyeOff, Lock, Mail, Leaf, Shield, Users, Zap } from "lucide-react";

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
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black relative overflow-hidden flex items-center justify-center p-4">
      {/* Enhanced Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Animated gradient orbs */}
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-r from-secondary/20 to-accent/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-accent/10 to-primary/10 rounded-full blur-3xl animate-pulse delay-500"></div>
        
        {/* Floating particles */}
        <div className="absolute top-20 left-20 w-2 h-2 bg-primary/40 rounded-full animate-bounce delay-300"></div>
        <div className="absolute top-40 right-32 w-1 h-1 bg-secondary/60 rounded-full animate-bounce delay-700"></div>
        <div className="absolute bottom-32 left-40 w-1.5 h-1.5 bg-accent/50 rounded-full animate-bounce delay-1000"></div>
        <div className="absolute bottom-20 right-20 w-1 h-1 bg-primary/30 rounded-full animate-bounce delay-500"></div>
        
        {/* Grid pattern overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:50px_50px]"></div>
      </div>

      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-8 relative z-10">
        {/* Left Side - Enhanced Dark Branding */}
        <div className="hidden lg:flex flex-col justify-center space-y-8 p-8">
          <div className="space-y-8">
            {/* Logo Section */}
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-primary to-secondary rounded-2xl blur-lg opacity-75"></div>
                <div className="relative p-4 bg-gradient-to-r from-primary to-secondary rounded-2xl">
                  <Leaf className="h-10 w-10 text-white" />
                </div>
              </div>
              <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
                  AeroGrowthSquad
                </h1>
                <p className="text-gray-400 text-lg">Vertical Farming Dashboard</p>
              </div>
            </div>

            {/* Main Heading */}
            <div className="space-y-6">
              <h2 className="text-3xl font-bold text-white leading-tight">
                Welcome to the
                <span className="block bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                  Future of Farming
                </span>
              </h2>
              <p className="text-gray-300 text-xl leading-relaxed">
                Monitor your aeroponic systems, track plant health, and optimize your vertical farming operations with our comprehensive dashboard.
              </p>
            </div>

            {/* Enhanced Features */}
            <div className="space-y-6">
              <div className="group flex items-center gap-4 p-4 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 transition-all duration-300">
                <div className="relative">
                  <div className="absolute inset-0 bg-primary/20 rounded-lg blur-md"></div>
                  <div className="relative p-3 bg-gradient-to-r from-primary/20 to-primary/10 rounded-lg">
                    <Shield className="h-6 w-6 text-primary" />
                  </div>
                </div>
                <div>
                  <h3 className="text-white font-semibold">Secure Monitoring</h3>
                  <p className="text-gray-400 text-sm">Advanced security and control systems</p>
                </div>
              </div>
              
              <div className="group flex items-center gap-4 p-4 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 transition-all duration-300">
                <div className="relative">
                  <div className="absolute inset-0 bg-secondary/20 rounded-lg blur-md"></div>
                  <div className="relative p-3 bg-gradient-to-r from-secondary/20 to-secondary/10 rounded-lg">
                    <Zap className="h-6 w-6 text-secondary" />
                  </div>
                </div>
                <div>
                  <h3 className="text-white font-semibold">Real-time Analytics</h3>
                  <p className="text-gray-400 text-sm">Live data monitoring and insights</p>
                </div>
              </div>
              
              <div className="group flex items-center gap-4 p-4 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 transition-all duration-300">
                <div className="relative">
                  <div className="absolute inset-0 bg-accent/20 rounded-lg blur-md"></div>
                  <div className="relative p-3 bg-gradient-to-r from-accent/20 to-accent/10 rounded-lg">
                    <Users className="h-6 w-6 text-accent" />
                  </div>
                </div>
                <div>
                  <h3 className="text-white font-semibold">Team Collaboration</h3>
                  <p className="text-gray-400 text-sm">Multi-user access and management</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Enhanced Dark Login Form */}
        <div className="flex flex-col justify-center space-y-6">
          <Card className="border-0 shadow-2xl bg-gray-900/90 backdrop-blur-xl border border-white/10">
            <CardHeader className="space-y-6 pb-8">
              {/* Mobile Logo */}
              <div className="text-center lg:hidden">
                <div className="flex items-center justify-center gap-3 mb-6">
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-primary to-secondary rounded-xl blur-md opacity-75"></div>
                    <div className="relative p-3 bg-gradient-to-r from-primary to-secondary rounded-xl">
                      <Leaf className="h-7 w-7 text-white" />
                    </div>
                  </div>
                  <span className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                    AeroGrowthSquad
                  </span>
                </div>
              </div>
              
              {/* Welcome Section */}
              <div className="text-center space-y-3">
                <CardTitle className="text-3xl text-white font-bold">Welcome Back</CardTitle>
                <p className="text-gray-400 text-lg">
                  Sign in to access your farming dashboard
                </p>
                <div className="w-20 h-1 bg-gradient-to-r from-primary to-secondary rounded-full mx-auto"></div>
              </div>
            </CardHeader>

            <CardContent className="space-y-8 px-8 pb-8">
              <form onSubmit={handleLogin} className="space-y-6">
                {/* Email Field */}
                <div className="space-y-3">
                  <Label htmlFor="email" className="text-sm font-medium text-gray-300">Email Address</Label>
                  <div className="relative group">
                    <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-primary transition-colors" />
                    <Input
                      id="email"
                      type="email"
                      value={credentials.email}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                      placeholder="Enter your email address"
                      className="pl-12 h-14 bg-gray-800/50 border-gray-700 text-white placeholder:text-gray-500 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-300"
                      required
                    />
                  </div>
                </div>

                {/* Password Field */}
                <div className="space-y-3">
                  <Label htmlFor="password" className="text-sm font-medium text-gray-300">Password</Label>
                  <div className="relative group">
                    <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-primary transition-colors" />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      value={credentials.password}
                      onChange={(e) => handleInputChange("password", e.target.value)}
                      placeholder="Enter your password"
                      className="pl-12 pr-12 h-14 bg-gray-800/50 border-gray-700 text-white placeholder:text-gray-500 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-300"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-primary transition-colors"
                    >
                      {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                </div>

                {/* Enhanced Login Button */}
                <div className="pt-4">
                  <Button
                    type="submit"
                    className="w-full h-14 text-lg font-semibold bg-gradient-to-r from-primary via-secondary to-accent hover:from-primary/90 hover:via-secondary/90 hover:to-accent/90 transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:-translate-y-0.5 relative overflow-hidden group"
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
                        Sign In to Dashboard
                        <div className="ml-2 opacity-70 group-hover:translate-x-1 transition-transform">
                          →
                        </div>
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Enhanced Demo Credentials */}
          <Card className="border-0 shadow-xl bg-gray-900/70 backdrop-blur-xl border border-white/10">
            <CardHeader className="pb-6">
              <CardTitle className="text-xl flex items-center gap-3 text-white">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg blur-md opacity-75"></div>
                  <div className="relative p-2 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-lg border border-blue-500/30">
                    <Shield className="h-5 w-5 text-blue-400" />
                  </div>
                </div>
                Demo Access
              </CardTitle>
              <p className="text-gray-400">
                Click below to auto-fill the demo credentials
              </p>
            </CardHeader>
            <CardContent>
              <button
                onClick={handleSampleLogin}
                className="w-full p-6 text-left rounded-xl bg-gradient-to-r from-gray-800/50 to-gray-700/50 border border-gray-600/50 hover:border-primary/50 hover:from-gray-700/50 hover:to-gray-600/50 transition-all duration-300 group relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-secondary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-lg">
                      <Users className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-lg font-semibold text-white group-hover:text-primary transition-colors">
                        {sampleCredential.role}
                      </p>
                      <p className="text-sm text-gray-400">Full dashboard access</p>
                    </div>
                  </div>
                  <div className="pl-11 space-y-1">
                    <p className="text-sm text-gray-300 font-mono">{sampleCredential.email}</p>
                    <p className="text-sm text-gray-400 font-mono">Password: {sampleCredential.password}</p>
                  </div>
                  <div className="pl-11">
                    <span className="inline-flex items-center gap-1 text-xs text-primary font-medium">
                      Click to auto-fill
                      <div className="w-1 h-1 bg-primary rounded-full animate-pulse"></div>
                    </span>
                  </div>
                </div>
              </button>
            </CardContent>
          </Card>

          {/* Enhanced Footer */}
          <div className="text-center space-y-3">
            <div className="flex items-center justify-center gap-2">
              <div className="w-8 h-px bg-gradient-to-r from-transparent via-gray-600 to-transparent"></div>
              <div className="w-2 h-2 bg-gradient-to-r from-primary to-secondary rounded-full"></div>
              <div className="w-8 h-px bg-gradient-to-r from-transparent via-gray-600 to-transparent"></div>
            </div>
            <div className="text-sm text-gray-400 space-y-1">
              <p>© 2025 AeroGrowthSquad. All rights reserved.</p>
              <p className="text-xs">Secure vertical farming management system</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;