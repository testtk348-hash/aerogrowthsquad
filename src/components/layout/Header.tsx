import { Menu, Settings, User, LogOut, Home, BarChart3, Bug, MessageCircle, BookOpen, Info, Phone, X, Leaf } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useAuth } from "@/contexts/AuthContext";
import { useState, useEffect } from "react";

const navigation = [
  { name: "Home", href: "/", icon: Home },
  { name: "Metrics", href: "/metrics", icon: BarChart3 },
  { name: "Pest Monitoring", href: "/pest-monitoring", icon: Bug },
  { name: "Consultation", href: "/consultation", icon: MessageCircle },
  { name: "Blog", href: "/blog", icon: BookOpen },
  { name: "About", href: "/about", icon: Info },
  { name: "Contact", href: "/contact", icon: Phone },
];

export const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { logout, userRole, userEmail } = useAuth();
  const location = useLocation();

  // Close mobile menu when route changes
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
      document.body.classList.add('mobile-app', 'overflow-hidden');
    } else {
      document.body.style.overflow = 'unset';
      document.body.classList.remove('overflow-hidden');
    }
    
    return () => {
      document.body.style.overflow = 'unset';
      document.body.classList.remove('overflow-hidden');
    };
  }, [mobileMenuOpen]);

  return (
    <>
      {/* Enhanced Header with Glass Morphism */}
      <header className="sticky top-0 z-50 w-full bg-background/80 backdrop-blur-xl border-b border-border/50 shadow-[var(--shadow-sm)] transition-all duration-300">
        <div className="flex h-16 items-center justify-between px-4 md:px-6 lg:px-8 max-w-7xl mx-auto">
          
          {/* Enhanced Logo */}
          <Link to="/" className="flex items-center gap-3 flex-shrink-0 group">
            <div className="w-10 h-10 gradient-primary rounded-xl flex items-center justify-center shadow-[var(--shadow-md)] transition-all duration-300 group-hover:scale-105 group-hover:shadow-[var(--shadow-lg)]">
              <Leaf className="h-5 w-5 text-primary-foreground transition-transform duration-300 group-hover:rotate-12" />
            </div>
            <div className="hidden sm:block">
              <span className="text-lg font-bold text-foreground transition-colors duration-200 group-hover:text-primary">AeroGrowthSquad</span>
              <p className="text-xs text-primary font-medium -mt-0.5 transition-colors duration-200 group-hover:text-secondary">Vertical Farming</p>
            </div>
            <span className="sm:hidden text-lg font-bold text-foreground transition-colors duration-200 group-hover:text-primary">AeroGrowth</span>
          </Link>

          {/* Enhanced Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1.5 desktop-nav">
            {navigation.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.href;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`group flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-300 ${
                    isActive 
                      ? 'gradient-primary text-primary-foreground shadow-[var(--shadow-md)]' 
                      : 'text-muted-foreground hover:text-primary hover:bg-muted/50 hover:shadow-[var(--shadow-sm)]'
                  }`}
                >
                  <Icon className={`h-4 w-4 transition-transform duration-300 ${!isActive && 'group-hover:scale-110'}`} />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>

          {/* Enhanced Desktop User Menu */}
          <div className="hidden lg:flex items-center gap-2 desktop-user-menu">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="gap-2 px-3 hover:bg-muted/50 transition-all duration-200 hover:shadow-[var(--shadow-sm)]">
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center transition-colors duration-200 group-hover:bg-primary/20">
                    <User className="h-4 w-4 text-primary" />
                  </div>
                  <span className="hidden xl:inline text-sm font-medium text-foreground">{userRole}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 bg-background/95 backdrop-blur-xl border-border/50 shadow-[var(--shadow-lg)]">
                <div className="px-3 py-2 bg-muted/30 rounded-t-lg">
                  <p className="text-sm font-semibold text-foreground">{userRole}</p>
                  <p className="text-xs text-muted-foreground truncate">{userEmail}</p>
                </div>
                <DropdownMenuSeparator className="bg-border/50" />
                <DropdownMenuItem asChild>
                  <Link to="/profile" className="w-full cursor-pointer hover:bg-muted/50 transition-colors duration-200">
                    <User className="h-4 w-4 mr-3 text-primary" />
                    <span className="font-medium">Profile</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/settings" className="w-full cursor-pointer hover:bg-muted/50 transition-colors duration-200">
                    <Settings className="h-4 w-4 mr-3 text-primary" />
                    <span className="font-medium">Settings</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-border/50" />
                <DropdownMenuItem 
                  onClick={logout} 
                  className="text-destructive focus:text-destructive hover:bg-destructive/10 transition-colors duration-200 cursor-pointer"
                >
                  <LogOut className="h-4 w-4 mr-3" />
                  <span className="font-medium">Sign Out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Enhanced Mobile Menu Button */}
          <div className="lg:hidden mobile-menu-trigger">
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => setMobileMenuOpen(true)}
              className="h-10 w-10 rounded-lg hover:bg-muted/50 hover:shadow-[var(--shadow-sm)] transition-all duration-200 mobile-hamburger-btn group"
            >
              <Menu className="h-5 w-5 text-foreground transition-transform duration-200 group-hover:scale-110" />
            </Button>
          </div>
        </div>
      </header>

      {/* Enhanced Mobile Menu with Glass Morphism */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-50">
          {/* Enhanced Backdrop with Blur */}
          <div 
            className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity duration-300"
            onClick={() => setMobileMenuOpen(false)}
          />
          
          {/* Enhanced Mobile Menu Panel */}
          <div className="absolute top-0 right-0 bottom-0 w-80 max-w-[85vw] bg-background/95 backdrop-blur-xl shadow-[var(--shadow-lg)] border-l border-border/50 animate-in slide-in-from-right duration-300">
            
            {/* Enhanced Header */}
            <div className="flex items-center justify-between p-5 border-b border-border/50 bg-gradient-to-r from-primary/5 via-transparent to-secondary/5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 gradient-primary rounded-xl flex items-center justify-center shadow-[var(--shadow-md)]">
                  <Leaf className="h-5 w-5 text-primary-foreground" />
                </div>
                <div>
                  <span className="font-bold text-foreground">Navigation</span>
                  <p className="text-xs text-muted-foreground">Choose a page</p>
                </div>
              </div>
              <Button 
                variant="ghost" 
                size="icon"
                onClick={() => setMobileMenuOpen(false)}
                className="h-10 w-10 hover:bg-muted/50 transition-colors duration-200 group"
              >
                <X className="h-5 w-5 text-foreground transition-transform duration-200 group-hover:rotate-90" />
              </Button>
            </div>

            {/* Enhanced Navigation */}
            <div className="flex-1 overflow-y-auto p-5 mobile-scroll">
              <nav className="space-y-1.5">
                {navigation.map((item) => {
                  const Icon = item.icon;
                  const isActive = location.pathname === item.href;
                  return (
                    <Link
                      key={item.name}
                      to={item.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`group flex items-center gap-4 px-4 py-3.5 rounded-lg font-medium transition-all duration-200 mobile-touch-target ${
                        isActive 
                          ? 'gradient-primary text-primary-foreground shadow-[var(--shadow-md)]' 
                          : 'text-foreground hover:bg-muted/50 hover:shadow-[var(--shadow-sm)]'
                      }`}
                    >
                      <Icon className={`h-5 w-5 transition-transform duration-200 ${!isActive && 'group-hover:scale-110'}`} />
                      <span className="text-base">{item.name}</span>
                    </Link>
                  );
                })}
              </nav>

              {/* Enhanced User Section */}
              <div className="mt-6 pt-6 border-t border-border/50">
                <div className="flex items-center gap-3 mb-4 p-3.5 bg-gradient-to-br from-muted/50 to-muted/30 rounded-lg border border-border/30 shadow-[var(--shadow-sm)]">
                  <div className="w-10 h-10 gradient-primary rounded-lg flex items-center justify-center shadow-[var(--shadow-sm)]">
                    <User className="h-5 w-5 text-primary-foreground" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-foreground truncate">{userRole}</p>
                    <p className="text-xs text-muted-foreground truncate">{userEmail}</p>
                  </div>
                </div>
                
                <div className="space-y-1">
                  <Link to="/profile" onClick={() => setMobileMenuOpen(false)}>
                    <Button variant="ghost" className="justify-start w-full h-12 hover:bg-muted/50 hover:shadow-[var(--shadow-sm)] transition-all duration-200 group">
                      <User className="h-4 w-4 mr-3 text-primary transition-transform duration-200 group-hover:scale-110" />
                      <span className="font-medium">Profile</span>
                    </Button>
                  </Link>
                  <Link to="/settings" onClick={() => setMobileMenuOpen(false)}>
                    <Button variant="ghost" className="justify-start w-full h-12 hover:bg-muted/50 hover:shadow-[var(--shadow-sm)] transition-all duration-200 group">
                      <Settings className="h-4 w-4 mr-3 text-primary transition-transform duration-200 group-hover:scale-110" />
                      <span className="font-medium">Settings</span>
                    </Button>
                  </Link>
                  <Button 
                    variant="ghost" 
                    className="justify-start w-full h-12 text-destructive hover:text-destructive hover:bg-destructive/10 transition-all duration-200 group"
                    onClick={() => {
                      setMobileMenuOpen(false);
                      logout();
                    }}
                  >
                    <LogOut className="h-4 w-4 mr-3 transition-transform duration-200 group-hover:translate-x-1" />
                    <span className="font-medium">Sign Out</span>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
