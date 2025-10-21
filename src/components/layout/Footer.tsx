import { Mail, Instagram, Linkedin, Youtube } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export const Footer = () => {
  return (
    <footer className="border-t bg-muted/30 mt-auto">
      <div className="container py-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-sm text-muted-foreground">
            © 2025 Aeroponics. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <Link to="/about" className="text-sm text-muted-foreground hover:text-primary transition-colors">
              Documentation
            </Link>
            <a
              href="mailto:aerogrowthsquad@gmail.com"
              className="text-sm text-muted-foreground hover:text-primary transition-colors flex items-center gap-1"
            >
              <Mail className="h-4 w-4" />
              Contact
            </a>
          </div>
          <div className="flex items-center gap-2">
            <a href="https://www.instagram.com/aerogrowthsquad?igsh=MWJoanBrbjl1dm92Zw==" target="_blank" rel="noopener noreferrer">
              <Button variant="ghost" size="icon">
                <Instagram className="h-4 w-4" />
              </Button>
            </a>
            <a href="https://www.linkedin.com/in/aerogrowthsquad" target="_blank" rel="noopener noreferrer">
              <Button variant="ghost" size="icon">
                <Linkedin className="h-4 w-4" />
              </Button>
            </a>
            <a href="https://www.youtube.com/channel/UCQHPN7LR0lDppS0Vn5PJBhQ" target="_blank" rel="noopener noreferrer">
              <Button variant="ghost" size="icon">
                <Youtube className="h-4 w-4" />
              </Button>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};
