import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Menu, X, Heart } from 'lucide-react';
import { navLinks, links, org } from '@/lib/siteConfig';

/**
 * Sticky site header.
 *
 * Fixes carried over from the audit of the current page:
 *  - the six `href="##"` dead anchors are gone; every link resolves
 *  - the logo now has a real alt text (it was alt="" twice)
 *  - the mobile menu is a proper disclosure: labelled trigger, Escape to close,
 *    scroll lock, focus returned to the trigger on close
 *  - the QC Gardens retail nav (Food & Drink, EGIFT Cards, Farmers Market) is
 *    dropped so the SoloUp ask is not competing with gift-shop links
 */
export default function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState('');
  const triggerRef = useRef(null);
  const panelRef = useRef(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  /* Highlight whichever section is currently in view. */
  useEffect(() => {
    const ids = navLinks.map((l) => l.href.slice(1));
    const sections = ids.map((id) => document.getElementById(id)).filter(Boolean);
    if (!sections.length) return;
    const obs = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) setActive(`#${visible.target.id}`);
      },
      { rootMargin: '-45% 0px -50% 0px', threshold: [0, 0.25, 0.6] },
    );
    sections.forEach((s) => obs.observe(s));
    return () => obs.disconnect();
  }, []);

  const close = useCallback(() => {
    setOpen(false);
    triggerRef.current?.focus();
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => {
      if (e.key === 'Escape') close();
    };
    document.addEventListener('keydown', onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    panelRef.current?.querySelector('a')?.focus();
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prev;
    };
  }, [open, close]);

  return (
    <header
      className={[
        'sticky top-0 z-50 transition-all duration-300',
        scrolled ? 'bg-cream/95 backdrop-blur-md shadow-brand' : 'bg-cream/80 backdrop-blur-sm',
      ].join(' ')}
    >
      <div className="container-brand">
        <div className="flex h-20 items-center justify-between gap-4">
          <a href="#top" className="flex shrink-0 items-center" aria-label={`${org.name} — home`}>
            <img
              src="/brand/soloup-logo.png"
              width={480}
              height={140}
              alt={`${org.name} — ${org.tagline}`}
              className="h-9 w-auto sm:h-11"
            />
          </a>

          <nav aria-label="Primary" className="hidden items-center gap-1 lg:flex">
            {navLinks.map((l) => (
              <a
                key={l.href}
                href={l.href}
                aria-current={active === l.href ? 'true' : undefined}
                className={[
                  'rounded-full px-4 py-2 text-[0.95rem] font-semibold transition-colors',
                  active === l.href ? 'bg-sky text-navy' : 'text-stone hover:bg-sky/70 hover:text-navy',
                ].join(' ')}
              >
                {l.label}
              </a>
            ))}
          </nav>

          <div className="hidden items-center gap-3 lg:flex">
            <a
              href={links.interestForm}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full border-2 border-navy/15 px-5 py-2.5 text-[0.95rem] font-bold text-navy transition-colors hover:border-navy/40 hover:bg-sky"
            >
              Get started
            </a>
            <a
              href={links.donate}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-navy px-5 py-2.5 text-[0.95rem] font-bold text-white shadow-brand transition-transform hover:-translate-y-0.5 hover:bg-deepsea"
            >
              <Heart className="h-4 w-4" aria-hidden="true" />
              Donate
            </a>
          </div>

          <button
            ref={triggerRef}
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label={open ? 'Close menu' : 'Open menu'}
            className="inline-flex h-12 w-12 items-center justify-center rounded-2xl border-2 border-navy/15 text-navy transition-colors hover:bg-sky lg:hidden"
          >
            {open ? <X className="h-6 w-6" aria-hidden="true" /> : <Menu className="h-6 w-6" aria-hidden="true" />}
          </button>
        </div>
      </div>

      {/* Mobile panel */}
      <div
        id="mobile-nav"
        ref={panelRef}
        hidden={!open}
        className="border-t border-navy/10 bg-cream lg:hidden"
      >
        <nav aria-label="Primary (mobile)" className="container-brand flex flex-col gap-1 py-4">
          {navLinks.map((l) => (
            <a
              key={l.href}
              href={l.href}
              onClick={close}
              className="rounded-2xl px-4 py-3.5 text-lg font-semibold text-navy transition-colors hover:bg-sky"
            >
              {l.label}
            </a>
          ))}
          <div className="mt-2 grid gap-2">
            <a
              href={links.interestForm}
              target="_blank"
              rel="noopener noreferrer"
              onClick={close}
              className="rounded-2xl border-2 border-navy/15 px-4 py-3.5 text-center text-lg font-bold text-navy"
            >
              Get started
            </a>
            <a
              href={links.donate}
              target="_blank"
              rel="noopener noreferrer"
              onClick={close}
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-navy px-4 py-3.5 text-center text-lg font-bold text-white"
            >
              <Heart className="h-5 w-5" aria-hidden="true" />
              Donate
            </a>
          </div>
        </nav>
      </div>
    </header>
  );
}
