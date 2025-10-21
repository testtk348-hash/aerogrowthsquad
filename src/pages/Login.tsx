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

  // Sample login credentials
  const sampleCredentials = [
    { email: "admin@aerogrowthsquad.com", password: "admin123", role: "Administrator" },
    { email: "farmer@aerogrowthsquad.com", password: "farmer123", role: "Farm Manager" },
    { email: "tech@aerogrowthsquad.com", password: "tech123", role: "Technical Support" },
    { email: "demo@aerogrowthsquad.com", password: "demo123", role: "Demo User" },
  ];

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
      const validCredential = sampleCredentials.find(
        cred => cred.email === credentials.email && cred.password === credentials.password
      );

      if (validCredential) {
        toast.success(`Welcome back! Logged in as ${validCredential.role}`);
        localStorage.setItem("isAuthenticated", "true");
        localStorage.setItem("userRole", validCredential.role);
        localStorage.setItem("userEmail", validCredential.email);
        onLogin();
      } else {
        toast.error("Invalid email or password. Please check the sample credentials below.");
      }
    } catch (error) {
      toast.error("Login failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSampleLogin = (email: string, password: string) => {
    setCredentials({ email, password });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/5 relative overflow-hidden flex items-center justify-center p-4">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-secondary/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-accent/5 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-8 relative z-10">
        {/* Left Side - Branding */}
        <div className="hidden lg:flex flex-col justify-center space-y-8 p-8">
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-gradient-to-r from-primary to-secondary rounded-xl">
                <Leaf className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
                  AeroGrowthSquad
                </h1>
                <p className="text-muted-foreground">Vertical Farming Dashboard</p>
              </div>
            </div>

            <div className="space-y-4">
              <h2 className="text-2xl font-semibold text-gray-900">
                Welcome to the Future of Farming
              </h2>
              <p className="text-muted-foreground text-lg leading-relaxed">
                Monitor your aeroponic systems, track plant health, and optimize your vertical farming operations with our comprehensive dashboard.
              </p>
            </div>

            {/* Features */}
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Shield className="h-5 w-5 text-primary" />
                </div>
                <span className="text-gray-700">Secure monitoring and control</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-secondary/10 rounded-lg">
                  <Zap className="h-5 w-5 text-secondary" />
                </div>
                <span className="text-gray-700">Real-time data analytics</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-accent/10 rounded-lg">
                  <Users className="h-5 w-5 text-accent" />
                </div>
                <span className="text-gray-700">Multi-user collaboration</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className="flex flex-col justify-center space-y-6">
          <Card className="border-0 shadow-2xl bg-white/80 backdrop-blur-sm">
            <CardHeader className="space-y-4 pb-6">
              <div className="text-center lg:hidden">
                <div className="flex items-center justify-center gap-2 mb-4">
                  <div className="p-2 bg-gradient-to-r from-primary to-secondary rounded-lg">
                    <Leaf className="h-6 w-6 text-white" />
                  </div>
                  <span className="text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                    AeroGrowthSquad
                  </span>
                </div>
              </div>
              <CardTitle className="text-2xl text-center">Sign In</CardTitle>
              <p className="text-center text-muted-foreground">
                Access your vertical farming dashboard
              </p>
            </CardHeader>

            <CardContent className="space-y-6">
              <form onSubmit={handleLogin} className="space-y-4">
                {/* Email Field */}
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-medium">Email Address</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      value={credentials.email}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                      placeholder="Enter your email"
                      className="pl-10 h-12 transition-all duration-200 focus:ring-2 focus:ring-primary/20"
                      required
                    />
                  </div>
                </div>

                {/* Password Field */}
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-sm font-medium">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      value={credentials.password}
                      onChange={(e) => handleInputChange("password", e.target.value)}
                      placeholder="Enter your password"
                      className="pl-10 pr-10 h-12 transition-all duration-200 focus:ring-2 focus:ring-primary/20"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                {/* Login Button */}
                <Button
                  type="submit"
                  className="w-full h-12 text-lg font-semibold bg-gradient-to-r from-primary via-secondary to-accent hover:from-primary/90 hover:via-secondary/90 hover:to-accent/90 transition-all duration-300 shadow-lg hover:shadow-xl"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2" />
                      Signing In...
                    </>
                  ) : (
                    "Sign In"
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Sample Credentials */}
          <Card className="border-0 shadow-xl bg-white/60 backdrop-blur-sm">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg flex items-center gap-2">
                <div className="p-1.5 bg-blue-100 rounded-lg">
                  <Shield className="h-4 w-4 text-blue-600" />
                </div>
                Demo Credentials
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                Click on any credential below to auto-fill the login form
              </p>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {sampleCredentials.map((cred, index) => (
                  <button
                    key={index}
                    onClick={() => handleSampleLogin(cred.email, cred.password)}
                    className="p-3 text-left rounded-lg border border-gray-200 hover:border-primary/50 hover:bg-primary/5 transition-all duration-200 group"
                  >
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-gray-900 group-hover:text-primary transition-colors">
                        {cred.role}
                      </p>
                      <p className="text-xs text-muted-foreground">{cred.email}</p>
                      <p className="text-xs text-muted-foreground">Password: {cred.password}</p>
                    </div>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Footer */}
          <div className="text-center text-sm text-muted-foreground">
            <p>© 2025 AeroGrowthSquad. All rights reserved.</p>
            <p className="mt-1">Secure vertical farming management system</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;