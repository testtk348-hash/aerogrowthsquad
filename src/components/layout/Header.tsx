import { Menu, X, Leaf, User, Settings, LogOut, Home, BarChart3, Bug, MessageCircle, BookOpen, Info, Phone, ChevronDown } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useState, useEffect } from "react";
import { shouldUseMobileLayout, forceMenuVisibility } from "@/utils/mobileDetection";

const navLinks = [
  { name: "Dashboard", href: "/", icon: Home },
  { name: "Metrics", href: "/metrics", icon: BarChart3 },
  { name: "Pest Monitor", href: "/pest-monitoring", icon: Bug },
  { name: "Consultation", href: "/consultation", icon: MessageCircle },
  { name: "Blog", href: "/blog", icon: BookOpen },
  { name: "About", href: "/about", icon: Info },
  { name: "Contact", href: "/contact", icon: Phone },
];

export const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [isMobileView, setIsMobileView] = useState(false);
  const { logout, userRole, userEmail } = useAuth();
  const location = useLocation();

  // Enhanced mobile detection for Capacitor apps
  useEffect(() => {
    const checkMobileView = () => {
      setIsMobileView(shouldUseMobileLayout());
      forceMenuVisibility();
    };

    checkMobileView();
    window.addEventListener('resize', checkMobileView);
    window.addEventListener('orientationchange', () => {
      setTimeout(checkMobileView, 150); // Delay to ensure orientation change is complete
    });

    return () => {
      window.removeEventListener('resize', checkMobileView);
      window.removeEventListener('orientationchange', checkMobileView);
    };
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
    setUserMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [mobileMenuOpen]);

  return (
    <>
      {/* Main Header */}
      <header className="sticky top-0 z-50 w-full bg-background/95 backdrop-blur-lg border-b border-border shadow-[var(--shadow-sm)]">
        <div className="w-full px-0">
          <div className="flex items-center justify-between h-16 w-full px-4">
            
            {/* Logo */}
            <div className="flex-shrink-0">
              <Link to="/" className="flex items-center gap-2.5 group">
                <div className="w-9 h-9 gradient-primary rounded-lg flex items-center justify-center shadow-[var(--shadow-sm)] transition-all duration-300 group-hover:scale-110">
                  <Leaf className="h-5 w-5 text-primary-foreground" />
                </div>
                <div className="flex flex-col">
                  <span className="text-base font-bold text-foreground leading-tight">AeroGrowth</span>
                  <span className="text-[10px] text-primary font-medium leading-tight hidden sm:inline">Vertical Farming</span>
                </div>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <nav className={`${isMobileView ? 'hidden' : 'flex'} items-center gap-1`}>
              {navLinks.map((link) => {
                const isActive = location.pathname === link.href;
                const Icon = link.icon;
                return (
                  <Link
                    key={link.href}
                    to={link.href}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                      isActive
                        ? 'bg-primary text-primary-foreground shadow-[var(--shadow-sm)]'
                        : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    <span>{link.name}</span>
                  </Link>
                );
              })}
            </nav>

            {/* Desktop User Menu */}
            <div className={`${isMobileView ? 'hidden' : 'block'} relative`}>
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center gap-2 px-3 py-2 rounded-lg bg-muted/50 hover:bg-muted transition-all duration-200"
              >
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                  <User className="h-4 w-4 text-primary" />
                </div>
                <div className="hidden xl:flex flex-col items-start">
                  <span className="text-xs font-semibold text-foreground leading-tight">{userRole}</span>
                  <span className="text-[10px] text-muted-foreground leading-tight">{userEmail.split('@')[0]}</span>
                </div>
                <ChevronDown className={`h-4 w-4 text-muted-foreground transition-transform duration-200 ${userMenuOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* Desktop User Dropdown */}
              {userMenuOpen && (
                <>
                  <div 
                    className="fixed inset-0 z-40" 
                    onClick={() => setUserMenuOpen(false)}
                  />
                  <div className="absolute right-0 top-full mt-2 w-56 bg-background border border-border rounded-lg shadow-[var(--shadow-lg)] z-50 overflow-hidden">
                    <div className="p-3 border-b border-border bg-muted/30">
                      <p className="text-sm font-semibold text-foreground">{userRole}</p>
                      <p className="text-xs text-muted-foreground truncate">{userEmail}</p>
                    </div>
                    <div className="p-1.5">
                      <Link
                        to="/profile"
                        onClick={() => setUserMenuOpen(false)}
                        className="flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium text-foreground hover:bg-muted transition-colors duration-200"
                      >
                        <User className="h-4 w-4 text-primary" />
                        Profile
                      </Link>
                      <Link
                        to="/settings"
                        onClick={() => setUserMenuOpen(false)}
                        className="flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium text-foreground hover:bg-muted transition-colors duration-200"
                      >
                        <Settings className="h-4 w-4 text-primary" />
                        Settings
                      </Link>
                      <button
                        onClick={() => {
                          setUserMenuOpen(false);
                          logout();
                        }}
                        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium text-destructive hover:bg-destructive/10 transition-colors duration-200"
                      >
                        <LogOut className="h-4 w-4" />
                        Sign Out
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Mobile Menu Button */}
            <div className="flex-shrink-0">
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setMobileMenuOpen(!mobileMenuOpen);
                }}
                className={`mobile-menu-button ${isMobileView ? 'flex' : 'hidden'} items-center justify-center p-2 rounded-lg hover:bg-muted transition-colors duration-200 min-w-[44px] min-h-[44px]`}
                type="button"
                aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
              >
                {mobileMenuOpen ? (
                  <X className="h-6 w-6 text-foreground" />
                ) : (
                  <Menu className="h-6 w-6 text-foreground" />
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      <div
        className={`${isMobileView ? 'block' : 'hidden'} fixed inset-0 z-50 transition-all duration-300 ${
          mobileMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
        }`}
      >
        {/* Backdrop */}
        <div
          className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          onClick={() => setMobileMenuOpen(false)}
        />

        {/* Menu Panel */}
        <div
          className={`mobile-menu-panel absolute right-0 top-0 bottom-0 w-full max-w-sm bg-background border-l border-border shadow-[var(--shadow-lg)] transform transition-transform duration-300 ${
            mobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
        >
          {/* Menu Header */}
          <div className="flex items-center justify-between p-5 border-b border-border bg-gradient-to-r from-primary/5 to-transparent">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 gradient-primary rounded-lg flex items-center justify-center shadow-[var(--shadow-sm)]">
                <Leaf className="h-5 w-5 text-primary-foreground" />
              </div>
              <div className="flex flex-col">
                <span className="text-base font-bold text-foreground leading-tight">Menu</span>
                <span className="text-xs text-muted-foreground leading-tight">Navigate</span>
              </div>
            </div>
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="p-2 rounded-lg hover:bg-muted transition-colors duration-200"
            >
              <X className="h-5 w-5 text-foreground" />
            </button>
          </div>

          {/* Menu Content */}
          <div className="flex flex-col h-[calc(100%-73px)] overflow-y-auto">
            {/* User Info */}
            <div className="p-5 border-b border-border bg-muted/30">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                  <User className="h-6 w-6 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-foreground truncate">{userRole}</p>
                  <p className="text-xs text-muted-foreground truncate">{userEmail}</p>
                </div>
              </div>
            </div>

            {/* Navigation Links */}
            <div className="flex-1 p-4 overflow-y-auto">
              <nav className="space-y-2">
                {navLinks.map((link) => {
                  const isActive = location.pathname === link.href;
                  const Icon = link.icon;
                  return (
                    <Link
                      key={link.href}
                      to={link.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`flex items-center gap-3 px-4 py-4 rounded-lg text-base font-medium transition-all duration-200 w-full ${
                        isActive
                          ? 'bg-primary text-primary-foreground shadow-[var(--shadow-sm)]'
                          : 'text-foreground hover:bg-muted'
                      }`}
                    >
                      <Icon className="h-5 w-5 flex-shrink-0" />
                      <span className="flex-1 text-left">{link.name}</span>
                    </Link>
                  );
                })}
              </nav>
            </div>

            {/* Bottom Actions */}
            <div className="p-4 border-t border-border space-y-2 bg-muted/20 flex-shrink-0">
              <Link to="/profile" onClick={() => setMobileMenuOpen(false)} className="block w-full">
                <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-foreground hover:bg-muted transition-colors duration-200">
                  <User className="h-4 w-4 text-primary flex-shrink-0" />
                  <span className="flex-1 text-left">Profile</span>
                </button>
              </Link>
              <Link to="/settings" onClick={() => setMobileMenuOpen(false)} className="block w-full">
                <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-foreground hover:bg-muted transition-colors duration-200">
                  <Settings className="h-4 w-4 text-primary flex-shrink-0" />
                  <span className="flex-1 text-left">Settings</span>
                </button>
              </Link>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  logout();
                }}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-destructive hover:bg-destructive/10 transition-colors duration-200"
              >
                <LogOut className="h-4 w-4 flex-shrink-0" />
                <span className="flex-1 text-left">Sign Out</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
