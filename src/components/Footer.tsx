import { Heart } from "lucide-react";

const Footer = () => (
  <footer className="hero-gradient border-t border-primary-foreground/10 py-8">
    <div className="container text-center">
      <div className="flex items-center justify-center gap-2 mb-2">
        <Heart className="h-4 w-4 text-secondary" fill="currentColor" />
        <span className="font-display text-sm font-semibold text-primary-foreground">
          HopeRise Foundation
        </span>
      </div>
      <p className="text-xs text-primary-foreground/60">
        © {new Date().getFullYear()} HopeRise Foundation. Empowering lives through financial support.
      </p>
    </div>
  </footer>
);

export default Footer;
