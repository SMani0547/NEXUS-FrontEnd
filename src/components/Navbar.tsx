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
    <>
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
            className={`lg:hidden rounded-md p-2 transition-colors ${
              heroTransparentMode
                ? "text-white hover:bg-white/10"
                : "text-foreground hover:bg-accent/10"
            }`}
            onClick={() => setOpen(!open)}
            aria-label="menu"
          >
            {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
        </div>
      </header>

      <div
        className={`fixed inset-0 z-[60] transition-opacity duration-300 ease-out lg:hidden ${
          open ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
        }`}
      >
          <button
            type="button"
            className="absolute inset-0 bg-black/35 backdrop-blur-[2px]"
            aria-label="close menu"
            onClick={() => setOpen(false)}
          />
          <aside
            className={`absolute right-0 top-0 h-dvh w-[min(82vw,22rem)] bg-background shadow-elegant transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] ${
              open ? "translate-x-0" : "translate-x-full"
            }`}
          >
            <div className="flex h-16 items-center justify-between border-b border-border px-6">
              <Link to="/" className="flex items-center gap-2" onClick={() => setOpen(false)}>
                <img src="/logo.png" alt="NEXUS" className="h-12 w-12 object-contain" />
                <span className="font-display text-lg font-bold text-foreground">NEXUS</span>
              </Link>
              <button
                className="rounded-md p-2 text-foreground transition-colors hover:bg-accent/10"
                onClick={() => setOpen(false)}
                aria-label="close menu"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <nav className="grid gap-1 px-4 py-5">
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
                    className="rounded-md px-3 py-3 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent/10 hover:text-foreground"
                  >
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          </aside>
        </div>
    </>
  );
}
