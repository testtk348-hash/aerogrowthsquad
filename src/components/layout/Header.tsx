import { Menu, Settings, User, Instagram, Linkedin, Youtube, LogOut } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useAuth } from "@/contexts/AuthContext";
import { useState } from "react";

const navigation = [
  { name: "Home", href: "/" },
  { name: "Metrics", href: "/metrics" },
  { name: "Pest Monitoring", href: "/pest-monitoring" },
  { name: "Consultation", href: "/consultation" },
  { name: "Blog", href: "/blog" },
  { name: "About", href: "/about" },
  { name: "Contact", href: "/contact" },
];

export const Header = () => {
  const [open, setOpen] = useState(false);
  const { logout, userRole, userEmail } = useAuth();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-6">
          <Link to="/" className="flex items-center gap-2">
            <span className="text-xl font-bold text-primary">Aeroponics</span>
          </Link>

          <nav className="hidden md:flex items-center gap-6">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
              >
                {item.name}
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-2">
          <a href="https://www.instagram.com/aerogrowthsquad?igsh=MWJoanBrbjl1dm92Zw==" target="_blank" rel="noopener noreferrer">
            <Button variant="ghost" size="icon" className="hidden md:flex">
              <Instagram className="h-5 w-5" />
            </Button>
          </a>
          <a href="https://www.linkedin.com/in/aerogrowthsquad" target="_blank" rel="noopener noreferrer">
            <Button variant="ghost" size="icon" className="hidden md:flex">
              <Linkedin className="h-5 w-5" />
            </Button>
          </a>
          <a href="https://www.youtube.com/channel/UCQHPN7LR0lDppS0Vn5PJBhQ" target="_blank" rel="noopener noreferrer">
            <Button variant="ghost" size="icon" className="hidden md:flex">
              <Youtube className="h-5 w-5" />
            </Button>
          </a>
          <Link to="/settings">
            <Button variant="ghost" size="icon" className="hidden md:flex">
              <Settings className="h-5 w-5" />
            </Button>
          </Link>
          
          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="hidden md:flex">
                <User className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <div className="px-2 py-1.5">
                <p className="text-sm font-medium">{userRole}</p>
                <p className="text-xs text-muted-foreground">{userEmail}</p>
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link to="/profile" className="w-full">
                  <User className="h-4 w-4 mr-2" />
                  Profile
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/settings" className="w-full">
                  <Settings className="h-4 w-4 mr-2" />
                  Settings
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                onClick={() => {
                  if (confirm("Are you sure you want to sign out?")) {
                    logout();
                  }
                }} 
                className="text-red-600 focus:text-red-600"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-64">
              <nav className="flex flex-col gap-4 mt-8">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    to={item.href}
                    onClick={() => setOpen(false)}
                    className="text-base font-medium text-foreground hover:text-primary transition-colors py-2"
                  >
                    {item.name}
                  </Link>
                ))}
                <div className="border-t pt-4 mt-4 flex flex-col gap-2">
                  <Link to="/settings" onClick={() => setOpen(false)}>
                    <Button variant="ghost" className="justify-start w-full">
                      <Settings className="h-5 w-5 mr-2" />
                      Settings
                    </Button>
                  </Link>
                  <Link to="/profile" onClick={() => setOpen(false)}>
                    <Button variant="ghost" className="justify-start w-full">
                      <User className="h-5 w-5 mr-2" />
                      Profile
                    </Button>
                  </Link>
                  
                  <div className="border-t pt-4 mt-4">
                    <div className="mb-4 px-2">
                      <p className="text-sm font-medium text-foreground">{userRole}</p>
                      <p className="text-xs text-muted-foreground">{userEmail}</p>
                    </div>
                    
                    <Button 
                      variant="ghost" 
                      className="justify-start w-full text-red-600 hover:text-red-600 hover:bg-red-50"
                      onClick={() => {
                        setOpen(false);
                        if (confirm("Are you sure you want to sign out?")) {
                          logout();
                        }
                      }}
                    >
                      <LogOut className="h-5 w-5 mr-2" />
                      Sign Out
                    </Button>
                  </div>
                  
                  <div className="border-t pt-4 mt-4">
                    <p className="text-sm font-medium mb-3 text-muted-foreground">Follow Us</p>
                    <div className="flex gap-2">
                      <a href="https://www.instagram.com/aerogrowthsquad?igsh=MWJoanBrbjl1dm92Zw==" target="_blank" rel="noopener noreferrer">
                        <Button variant="ghost" size="icon">
                          <Instagram className="h-5 w-5" />
                        </Button>
                      </a>
                      <a href="https://www.linkedin.com/in/aerogrowthsquad" target="_blank" rel="noopener noreferrer">
                        <Button variant="ghost" size="icon">
                          <Linkedin className="h-5 w-5" />
                        </Button>
                      </a>
                      <a href="https://www.youtube.com/channel/UCQHPN7LR0lDppS0Vn5PJBhQ" target="_blank" rel="noopener noreferrer">
                        <Button variant="ghost" size="icon">
                          <Youtube className="h-5 w-5" />
                        </Button>
                      </a>
                    </div>
                  </div>
                </div>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
};
