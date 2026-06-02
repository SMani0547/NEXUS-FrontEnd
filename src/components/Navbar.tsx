import { Link, useRouterState } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Menu, X, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const navItems = [
  { label: "Home", to: "/", hash: "" },
  { label: "About", to: "/", hash: "#about" },
  { label: "Story", to: "/", hash: "#story" },
  { label: "Explorer", to: "/explorer", hash: "" },
  { label: "Insights", to: "/", hash: "#insights" },
  { label: "Pacific Map", to: "/map", hash: "" },
  { label: "Nexus AI", to: "/ai", hash: "" },
  { label: "Team", to: "/", hash: "#team" },
  { label: "Data", to: "/", hash: "#sources" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const pathname = useRouterState({ select: (r) => r.location.pathname });

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-background/80 backdrop-blur-xl border-b border-border"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="relative w-8 h-8 rounded-lg bg-gradient-ocean flex items-center justify-center shadow-glow">
            <div className="w-2 h-2 bg-white rounded-full" />
          </div>
          <span className="font-display font-bold text-lg tracking-tight">
            NEXUS
          </span>
        </Link>

        <nav className="hidden lg:flex items-center gap-1">
          {navItems.map((item) => {
            const active = pathname === item.to && !item.hash;
            const id = item.hash.replace("#", "");
            return (
              <Link
                key={item.label}
                to={item.to}
                hash={id || undefined}
                onClick={(e) => {
                  if (id && pathname === item.to) {
                    e.preventDefault();
                    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
                    history.replaceState(null, "", `${item.to}#${id}`);
                  }
                }}
                className={`px-3 py-1.5 text-sm rounded-md transition-colors ${
                  active
                    ? "text-foreground font-medium"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          <Link to="/explorer" className="hidden sm:block">
            <Button size="sm" className="bg-gradient-ocean text-white border-0 hover:opacity-90 shadow-glow">
              Explore Data <ArrowRight className="ml-1 w-4 h-4" />
            </Button>
          </Link>
          <button
            className="lg:hidden p-2"
            onClick={() => setOpen(!open)}
            aria-label="menu"
          >
            {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {open && (
        <div className="lg:hidden bg-background border-t border-border">
          <nav className="max-w-7xl mx-auto px-6 py-3 grid grid-cols-2 gap-1">
            {navItems.map((item) => (
              <Link
                key={item.label}
                to={item.to}
                hash={item.hash || undefined}
                onClick={() => setOpen(false)}
                className="px-3 py-2 text-sm text-muted-foreground hover:text-foreground"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
