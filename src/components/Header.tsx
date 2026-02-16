import { Link, useLocation } from "react-router-dom";
import { Heart } from "lucide-react";

const Header = () => {
  const location = useLocation();

  const linkClass = (path: string) =>
    `text-sm font-medium transition-colors hover:text-secondary ${location.pathname === path
      ? "text-secondary"
      : "text-primary-foreground/80"
    }`;

  return (
    <header className="hero-gradient sticky top-0 z-50 border-b border-primary-foreground/10">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <Heart className="h-6 w-6 text-secondary" fill="currentColor" />
          <span className="font-display text-lg font-bold text-primary-foreground">
            Almira Aldhabi Foundation
          </span>
        </Link>
        <nav className="flex items-center gap-6">
          <Link to="/" className={linkClass("/")}>
            Home
          </Link>
          <Link to="/register" className={linkClass("/register")}>
            Register
          </Link>

        </nav>
      </div>
    </header>
  );
};

export default Header;
