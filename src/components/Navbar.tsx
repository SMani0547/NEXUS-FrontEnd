import { Link, useRouterState } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
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

const navItemKey = (item: (typeof navItems)[number]) => `${item.to}${item.hash || ""}`;

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [indicator, setIndicator] = useState({ left: 0, width: 0, opacity: 0 });
  const navRef = useRef<HTMLElement>(null);
  const location = useRouterState({ select: (r) => r.location });
  const pathname = location.pathname;
  const hash = location.hash || "";
  const heroTransparentMode = pathname === "/" && !scrolled;
  const showSlidingPill = true;
  const activeItem =
    navItems.find((item) => pathname === item.to && (item.hash ? item.hash === hash : !hash)) ??
    navItems.find((item) => pathname === item.to && !item.hash) ??
    navItems[0];
  const activeKey = navItemKey(activeItem);

  const moveIndicatorTo = (key: string) => {
    const el = navRef.current?.querySelector<HTMLAnchorElement>(`[data-nav-key="${key}"]`);
    if (!el) return;
    setIndicator({
      left: el.offsetLeft,
      width: el.offsetWidth,
      opacity: 1,
    });
  };

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!showSlidingPill) {
      setIndicator((prev) => ({ ...prev, opacity: 0 }));
      return;
    }
    moveIndicatorTo(activeKey);
    const onResize = () => moveIndicatorTo(activeKey);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [activeKey, showSlidingPill]);

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
          <img
            src="/logo.png"
            alt="NEXUS"
            className="h-18 w-18 object-contain"
          />
          <span
            className={`font-display font-bold text-lg tracking-tight ${
              heroTransparentMode ? "text-white" : "text-foreground"
            }`}
          >
            NEXUS
          </span>
        </Link>

        <nav
          ref={navRef}
          onMouseLeave={() => showSlidingPill && moveIndicatorTo(activeKey)}
          className="hidden lg:flex items-center gap-1 relative"
        >
          {showSlidingPill && (
            <span
              className={`pointer-events-none absolute h-8 rounded-md transition-all duration-300 ${
                heroTransparentMode ? "bg-white/12" : "bg-accent/15"
              }`}
              style={{
                left: `${indicator.left}px`,
                width: `${indicator.width}px`,
                opacity: indicator.opacity,
                transitionTimingFunction: "cubic-bezier(0.22, 1, 0.36, 1)",
              }}
            />
          )}
          {navItems.map((item) => {
            const active =
              pathname === item.to && (item.hash ? item.hash === hash : !hash);
            const id = item.hash.replace("#", "");
            return (
              <Link
                key={item.label}
                data-nav-key={navItemKey(item)}
                to={item.to}
                hash={id || undefined}
                onMouseEnter={() => showSlidingPill && moveIndicatorTo(navItemKey(item))}
                onFocus={() => showSlidingPill && moveIndicatorTo(navItemKey(item))}
                onClick={(e) => {
                  if (id && pathname === item.to) {
                    e.preventDefault();
                    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
                    history.replaceState(null, "", `${item.to}#${id}`);
                  }
                }}
                className={`${showSlidingPill ? "relative z-10" : ""} px-3 py-1.5 text-sm rounded-md transition-colors ${
                  active
                    ? heroTransparentMode
                      ? "text-white font-medium"
                      : "text-foreground font-medium"
                    : heroTransparentMode
                      ? "text-white/80 hover:text-white"
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
            {navItems.map((item) => {
              const id = item.hash.replace("#", "");
              return (
                <Link
                  key={item.label}
                  to={item.to}
                  hash={id || undefined}
                  onClick={(e) => {
                    setOpen(false);
                    if (id && pathname === item.to) {
                      e.preventDefault();
                      setTimeout(() => {
                        document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
                        history.replaceState(null, "", `${item.to}#${id}`);
                      }, 0);
                    }
                  }}
                  className="px-3 py-2 text-sm text-muted-foreground hover:text-foreground"
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>
      )}
    </header>
  );
}
