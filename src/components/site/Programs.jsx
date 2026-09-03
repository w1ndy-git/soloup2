import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, GraduationCap, Hammer, Handshake, ChevronDown } from 'lucide-react';
import { phases } from '@/lib/siteConfig';

const ICONS = { Search, GraduationCap, Hammer, Handshake };

/**
 * "How It Works" — the four programme phases.
 * Tabs on desktop, an accordion on small screens so nothing is hidden behind a
 * horizontal scroll on a phone.
 */
export default function Programs() {
  const [open, setOpen] = useState(0);

  return (
    <section id="how" className="scroll-mt-24 grad-page py-20 sm:py-28">
      <div className="container-brand">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-leaf">How It Works</p>
          <h2 className="mt-3 font-display text-4xl font-black leading-tight tracking-tight text-carbon sm:text-5xl">
            A supported pathway toward greater independence.
          </h2>
          <p className="mt-6 text-lg leading-relaxed text-stone">
            SoloUp combines coaching, hands-on learning, community partnership, and job development
            into one practical progression.
          </p>
        </div>

        {/* Desktop: tab strip */}
        <div className="mt-14 hidden lg:block">
          <div role="tablist" aria-label="Programme phases" className="grid grid-cols-4 gap-3">
            {phases.map((p, i) => {
              const Icon = ICONS[p.icon];
              const selected = i === open;
              return (
                <button
                  key={p.phase}
                  role="tab"
                  id={`phase-tab-${i}`}
                  aria-selected={selected}
                  aria-controls={`phase-panel-${i}`}
                  tabIndex={selected ? 0 : -1}
                  onClick={() => setOpen(i)}
                  onKeyDown={(e) => {
                    if (e.key === 'ArrowRight') setOpen((i + 1) % phases.length);
                    if (e.key === 'ArrowLeft') setOpen((i - 1 + phases.length) % phases.length);
                  }}
                  className={[
                    'rounded-[1.5rem] border-2 p-6 text-left transition-all duration-300',
                    selected
                      ? 'border-ocean bg-white shadow-brand'
                      : 'border-carbon/10 bg-white/50 hover:border-ocean/40 hover:bg-white',
                  ].join(' ')}
                >
                  <span
                    className={[
                      'inline-flex h-12 w-12 items-center justify-center rounded-2xl transition-colors',
                      selected ? 'bg-ocean text-white' : 'bg-sky text-ocean',
                    ].join(' ')}
                  >
                    <Icon className="h-6 w-6" aria-hidden="true" />
                  </span>
                  <p className="mt-4 text-xs font-bold uppercase tracking-[0.14em] text-stone">{p.phase}</p>
                  <p className="mt-1 text-xl font-extrabold text-carbon">{p.title}</p>
                </button>
              );
            })}
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={open}
              id={`phase-panel-${open}`}
              role="tabpanel"
              aria-labelledby={`phase-tab-${open}`}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.28 }}
              className="mt-6 rounded-[1.75rem] border border-carbon/10 bg-white p-10 shadow-brand"
            >
              <p className="max-w-3xl text-xl leading-relaxed text-ink">{phases[open].body}</p>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Mobile: accordion */}
        <div className="mt-12 space-y-3 lg:hidden">
          {phases.map((p, i) => {
            const Icon = ICONS[p.icon];
            const expanded = i === open;
            return (
              <div key={p.phase} className="overflow-hidden rounded-[1.5rem] border-2 border-carbon/10 bg-white">
                <h3>
                  <button
                    type="button"
                    onClick={() => setOpen(expanded ? -1 : i)}
                    aria-expanded={expanded}
                    aria-controls={`phase-acc-${i}`}
                    className="flex w-full items-center gap-4 p-5 text-left"
                  >
                    <span
                      className={[
                        'inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl transition-colors',
                        expanded ? 'bg-ocean text-white' : 'bg-sky text-ocean',
                      ].join(' ')}
                    >
                      <Icon className="h-6 w-6" aria-hidden="true" />
                    </span>
                    <span className="flex-1">
                      <span className="block text-xs font-bold uppercase tracking-[0.14em] text-stone">
                        {p.phase}
                      </span>
                      <span className="block text-lg font-extrabold text-carbon">{p.title}</span>
                    </span>
                    <ChevronDown
                      aria-hidden="true"
                      className={`h-5 w-5 shrink-0 text-stone transition-transform duration-300 ${
                        expanded ? 'rotate-180' : ''
                      }`}
                    />
                  </button>
                </h3>
                <div id={`phase-acc-${i}`} hidden={!expanded} className="px-5 pb-6">
                  <p className="leading-relaxed text-ink">{p.body}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
