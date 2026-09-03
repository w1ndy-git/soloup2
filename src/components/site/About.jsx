import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Compass, Wrench, Sprout, ArrowRight } from 'lucide-react';
import { pillars, journey } from '@/lib/siteConfig';

const ICONS = { Compass, Wrench, Sprout };

/* Emoji on the current page (🧭 🛠️ 🌿) are announced literally by screen
   readers. Replaced with labelled SVG icons. */
export default function About() {
  const [step, setStep] = useState(0);

  return (
    <section id="about" className="scroll-mt-24 bg-cream py-20 sm:py-28">
      <div className="container-brand">
        {/* ── The SoloUp Journey ───────────────────────────────────────── */}
        <div className="mx-auto max-w-3xl text-center">
          <p className="eyebrow text-leaf">The SoloUp Journey</p>
          <h2 className="mt-3 font-display text-4xl font-black leading-tight tracking-tight text-carbon sm:text-5xl">
            From potential to purpose.
          </h2>
        </div>

        <div className="mt-14">
          {/* Progress rail */}
          <ol className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4" aria-label="SoloUp growth pathway">
            {journey.map((s, i) => {
              const isActive = i === step;
              return (
                <li key={s.n}>
                  <button
                    type="button"
                    onClick={() => setStep(i)}
                    aria-current={isActive ? 'step' : undefined}
                    className={[
                      'group h-full w-full rounded-[1.5rem] border-2 p-6 text-left transition-all duration-300',
                      isActive
                        ? 'border-leaf bg-white shadow-brand'
                        : 'border-carbon/10 bg-white/60 hover:border-leaf/40 hover:bg-white',
                    ].join(' ')}
                  >
                    <span
                      className={[
                        'inline-flex h-11 w-11 items-center justify-center rounded-full text-lg font-black transition-colors',
                        isActive ? 'bg-leaf text-white' : 'bg-lime text-carbon group-hover:bg-leaf/25',
                      ].join(' ')}
                      aria-hidden="true"
                    >
                      {s.n}
                    </span>
                    <h3 className="mt-4 text-lg font-extrabold text-carbon">
                      <span className="sr-only">Step {s.n}: </span>
                      {s.title}
                    </h3>
                    <p className="mt-1.5 text-[0.95rem] leading-relaxed text-stone">{s.body}</p>
                    <span
                      aria-hidden="true"
                      className={[
                        'mt-4 block h-1.5 rounded-full transition-all duration-500',
                        isActive ? 'bg-leaf' : 'bg-carbon/10',
                      ].join(' ')}
                    />
                  </button>
                </li>
              );
            })}
          </ol>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-[0.95rem] font-semibold text-stone">
            <span className="inline-flex items-center gap-2">
              <Sprout className="h-4.5 w-4.5 text-leaf" aria-hidden="true" />
              Grow at your pace
            </span>
            <span className="inline-flex items-center gap-2">
              <ArrowRight className="h-4.5 w-4.5 text-ocean" aria-hidden="true" />
              Supported every step
            </span>
          </div>
        </div>

        {/* ── Why SoloUp ───────────────────────────────────────────────── */}
        <div className="mx-auto mt-24 max-w-3xl text-center">
          <p className="eyebrow text-ocean">Why SoloUp</p>
          <h2 className="mt-3 font-display text-4xl font-black leading-tight tracking-tight text-carbon sm:text-5xl">
            Adulthood should open doors, not close them.
          </h2>
          <p className="mt-6 text-lg leading-relaxed text-stone">
            Too many young adults lose access to structured support after school and struggle to
            find a clear path toward work, independence, and community. SoloUp bridges that gap with
            practical experiences designed around each participant’s strengths.
          </p>
        </div>

        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {pillars.map((p, i) => {
            const Icon = ICONS[p.icon];
            return (
              <motion.article
                key={p.title}
                initial={{ opacity: 0, y: 22 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-80px' }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                className="group rounded-[1.75rem] border border-carbon/10 bg-white p-8 shadow-brand transition-transform duration-300 hover:-translate-y-1"
              >
                <span className="inline-flex h-14 w-14 items-center justify-center rounded-2xl grad-lime text-leaf">
                  <Icon className="h-7 w-7" aria-hidden="true" />
                </span>
                <h3 className="mt-6 text-xl font-extrabold text-carbon">{p.title}</h3>
                <p className="mt-3 leading-relaxed text-stone">{p.body}</p>
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
