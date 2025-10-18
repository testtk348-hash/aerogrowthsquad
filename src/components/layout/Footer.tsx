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
              href="mailto:contact@aeroponics.example"
              className="text-sm text-muted-foreground hover:text-primary transition-colors flex items-center gap-1"
            >
              <Mail className="h-4 w-4" />
              Contact
            </a>
          </div>
          <div className="flex items-center gap-2">
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
              <Button variant="ghost" size="icon">
                <Instagram className="h-4 w-4" />
              </Button>
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer">
              <Button variant="ghost" size="icon">
                <Linkedin className="h-4 w-4" />
              </Button>
            </a>
            <a href="https://youtube.com" target="_blank" rel="noopener noreferrer">
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
