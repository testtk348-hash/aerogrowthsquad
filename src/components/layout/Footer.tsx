import { Mail, Instagram, Linkedin, Youtube } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export const Footer = () => {
  return (
    <footer className="border-t bg-muted/30 mt-auto mobile-footer">
      <div className="container py-4 sm:py-8 px-4">
        <div className="flex flex-col items-center gap-4 sm:gap-6">
          <div className="flex items-center gap-2 sm:gap-4">
            <a href="https://www.instagram.com/aerogrowthsquad?igsh=MWJoanBrbjl1dm92Zw==" target="_blank" rel="noopener noreferrer">
              <Button variant="ghost" size="icon" className="h-8 w-8 sm:h-10 sm:w-10">
                <Instagram className="h-4 w-4" />
              </Button>
            </a>
            <a href="https://www.linkedin.com/in/aerogrowthsquad" target="_blank" rel="noopener noreferrer">
              <Button variant="ghost" size="icon" className="h-8 w-8 sm:h-10 sm:w-10">
                <Linkedin className="h-4 w-4" />
              </Button>
            </a>
            <a href="https://www.youtube.com/channel/UCQHPN7LR0lDppS0Vn5PJBhQ" target="_blank" rel="noopener noreferrer">
              <Button variant="ghost" size="icon" className="h-8 w-8 sm:h-10 sm:w-10">
                <Youtube className="h-4 w-4" />
              </Button>
            </a>
            <a
              href="mailto:aerogrowthsquad@gmail.com"
              className="text-muted-foreground hover:text-primary transition-colors"
            >
              <Button variant="ghost" size="icon" className="h-8 w-8 sm:h-10 sm:w-10">
                <Mail className="h-4 w-4" />
              </Button>
            </a>
          </div>
          <div className="text-center space-y-1">
            <p className="text-xs sm:text-sm text-muted-foreground">
              © 2025 AeroGrowthSquad. All rights reserved.
            </p>
            <Link to="/about" className="text-xs text-muted-foreground hover:text-primary transition-colors">
              Documentation & Support
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
