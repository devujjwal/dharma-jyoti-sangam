import { Link } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { ChevronRight, Home } from "lucide-react";

interface Crumb {
  label: string;
  href?: string;
}

interface Props {
  crumbs: Crumb[];
}

const Breadcrumbs = ({ crumbs }: Props) => {
  const { language } = useLanguage();
  const isHi = language === "hi";

  return (
    <nav aria-label="Breadcrumb" className="flex items-center gap-1 text-xs font-devanagari text-muted-foreground mb-4 flex-wrap">
      <Link to="/" className="hover:text-primary transition-colors flex items-center gap-1">
        <Home className="w-3 h-3" />
        {isHi ? "होम" : "Home"}
      </Link>
      {crumbs.map((crumb, i) => (
        <span key={i} className="flex items-center gap-1">
          <ChevronRight className="w-3 h-3 text-muted-foreground/50" />
          {crumb.href ? (
            <Link to={crumb.href} className="hover:text-primary transition-colors">
              {crumb.label}
            </Link>
          ) : (
            <span className="text-foreground font-medium">{crumb.label}</span>
          )}
        </span>
      ))}
    </nav>
  );
};

export default Breadcrumbs;
