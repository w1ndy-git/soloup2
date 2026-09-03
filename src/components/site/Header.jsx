import React, { useEffect, useState } from "react";
import { Sprout } from "@/components/site/Botanical";
import { useMotion } from "@/components/site/MotionContext";

const NAV = [
  { label: "Our Path", href: "#path" },
  { label: "Voices", href: "#voices" },
  { label: "Grow the Movement", href: "#share" },
  { label: "Impact", href: "#impact" },
];

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const { reduceMotion, toggle } = useMotion();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Sun-path backlight temperature based on time of day
  const hour = new Date().getHours();
  const sunTemp =
    hour < 6 || hour >= 20 ? "from-forest-deep/90" :
    hour < 11 ? "from-petal-soft/85" :
    hour < 17 ? "from-terracotta-soft/80" :
    "from-petal/85";

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-500 ${
        scrolled ? "bg-mist/85 backdrop-blur-xl shadow-[0_8px_40px_-20px_rgba(27,67,50,0.35)]" : "bg-transparent"
      }`}
    >
      <div className={`pointer-events-none absolute inset-0 bg-gradient-to-b ${sunTemp} to-transparent opacity-30 transition-opacity duration-700`} aria-hidden="true" />
      <div className="relative mx-auto max-w-7xl px-5 sm:px-8">
        <div className="flex items-center justify-between h-18 py-4">
          <a href="#top" className="flex items-center gap-2.5 group" aria-label="SoloUp home">
            <span className="grid place-items-center w-11 h-11 rounded-full bg-forest text-petal shadow-lg shadow-forest/30 transition-transform group-hover:scale-105">
              <Sprout className="w-6 h-6 text-petal" />
            </span>
            <span className="leading-none">
              <span className="block font-display font-semibold text-xl text-forest tracking-tight">SoloUp</span>
              <span className="block text-[10px] uppercase tracking-[0.18em] text-forest/60 font-semibold">Seeds of Limitless Opportunities</span>
            </span>
          </a>

          <nav className="hidden md:flex items-center gap-1" aria-label="Primary">
            {NAV.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="relative px-4 py-2.5 rounded-full text-sm font-semibold text-forest/80 hover:text-forest hover:bg-forest/5 transition-colors min-h-[44px] flex items-center"
              >
                {item.label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <button
              onClick={toggle}
              aria-pressed={reduceMotion}
              aria-label={reduceMotion ? "Turn off reduced motion" : "Reduce motion"}
              title={reduceMotion ? "Motion reduced" : "Reduce motion"}
              className={`grid place-items-center w-11 h-11 rounded-full border-2 transition-colors min-w-[44px] ${
                reduceMotion
                  ? "bg-petal border-petal text-forest"
                  : "bg-transparent border-forest/20 text-forest/70 hover:border-forest/40"
              }`}
            >
              {reduceMotion ? (
                <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
                  <path d="M4 4l16 16M9 9a3 3 0 004 4" />
                </svg>
              ) : (
                <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 3v3M12 18v3M5.6 5.6l2.1 2.1M16.3 16.3l2.1 2.1M3 12h3M18 12h3M5.6 18.4l2.1-2.1M16.3 7.7l2.1-2.1" />
                  <circle cx="12" cy="12" r="3.5" />
                </svg>
              )}
            </button>

            <a
              href="#involved"
              className="hidden sm:inline-flex items-center gap-1.5 px-5 py-3 rounded-full bg-forest text-mist font-semibold text-sm shadow-lg shadow-forest/25 hover:bg-forest-deep transition-colors min-h-[44px]"
            >
              Plant a Seed
            </a>

            <button
              onClick={() => setOpen((o) => !o)}
              aria-label="Open menu"
              aria-expanded={open}
              className="md:hidden grid place-items-center w-11 h-11 rounded-full border-2 border-forest/20 text-forest min-w-[44px]"
            >
              <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round">
                {open ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {open && (
          <div className="md:hidden pb-5">
            <nav className="flex flex-col gap-1 bg-mist/95 backdrop-blur rounded-3xl p-3 shadow-xl border border-forest/10" aria-label="Mobile">
              {NAV.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="px-4 py-3 rounded-2xl text-base font-semibold text-forest/80 hover:bg-forest/5 min-h-[44px] flex items-center"
                >
                  {item.label}
                </a>
              ))}
              <a
                href="#involved"
                onClick={() => setOpen(false)}
                className="mt-1 px-4 py-3 rounded-2xl bg-forest text-mist font-semibold text-center min-h-[44px] flex items-center justify-center"
              >
                Plant a Seed
              </a>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}