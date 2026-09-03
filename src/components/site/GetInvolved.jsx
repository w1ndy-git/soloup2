import React from 'react';
import { motion } from 'framer-motion';
import { Heart, Building2, Sparkles, ArrowRight, ExternalLink } from 'lucide-react';
import { audiences, closing, links } from '@/lib/siteConfig';
import PartnerForm from './PartnerForm';

const ICONS = { Heart, Building2, Sparkles };

const TONES = {
  gold: { chip: 'bg-gold/20 text-carbon', rule: 'bg-gold' },
  ocean: { chip: 'bg-sky text-ocean', rule: 'bg-ocean' },
  leaf: { chip: 'grad-lime text-leaf', rule: 'bg-leafbright' },
};

export default function GetInvolved() {
  return (
    <section id="involved" className="scroll-mt-24 bg-cream py-20 sm:py-28">
      <div className="container-brand">
        <div className="mx-auto max-w-3xl text-center">
          <p className="eyebrow text-leaf">Get Involved</p>
          <h2 className="mt-3 font-display text-4xl font-black leading-tight tracking-tight text-carbon sm:text-5xl">
            Help build a future where everyone can contribute.
          </h2>
          <p className="mt-6 text-lg leading-relaxed text-stone">
            SoloUp grows through families, donors, employers, volunteers, and community partners who
            believe every person deserves a pathway to purpose.
          </p>
        </div>

        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {audiences.map((a, i) => {
            const Icon = ICONS[a.icon];
            const tone = TONES[a.tone];
            const external = !a.internal;
            return (
              <motion.article
                key={a.key}
                initial={{ opacity: 0, y: 22 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-70px' }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                className="flex flex-col overflow-hidden rounded-[1.75rem] border border-carbon/10 bg-white shadow-brand transition-transform duration-300 hover:-translate-y-1"
              >
                <span aria-hidden="true" className={`h-1.5 w-full ${tone.rule}`} />
                <div className="flex flex-1 flex-col p-8">
                  <span className={`inline-flex h-14 w-14 items-center justify-center rounded-2xl ${tone.chip}`}>
                    <Icon className="h-7 w-7" aria-hidden="true" />
                  </span>
                  <h3 className="mt-6 text-xl font-extrabold text-carbon">{a.title}</h3>
                  <p className="mt-3 leading-relaxed text-stone">{a.body}</p>
                  {a.note && (
                    <p className="mt-3 rounded-xl bg-lime px-4 py-3 text-[0.9rem] font-semibold leading-relaxed text-ink">
                      {a.note}
                    </p>
                  )}
                  <span className="flex-1" aria-hidden="true" />
                  <a
                    href={a.href}
                    {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                    className="mt-6 inline-flex items-center gap-2 self-start py-1 text-[0.95rem] font-bold text-ocean hover:text-carbon"
                  >
                    {a.cta}
                    {external ? (
                      <ExternalLink className="h-4 w-4" aria-hidden="true" />
                    ) : (
                      <ArrowRight className="h-4 w-4" aria-hidden="true" />
                    )}
                    {external && <span className="sr-only">(opens in a new tab)</span>}
                  </a>
                </div>
              </motion.article>
            );
          })}
        </div>

        {/* Employer intake — the fix for the mis-pointed "For Employers" button. */}
        <PartnerForm />

        {/* Closing call to action */}
        <div className="on-dark mt-16 overflow-hidden rounded-[2rem] grad-hero px-8 py-14 text-center text-white sm:px-14">
          <h2 className="mx-auto max-w-3xl font-display text-3xl font-black leading-tight tracking-tight sm:text-5xl">
            {closing.heading}
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-lg leading-relaxed text-white/85">{closing.body}</p>
          <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">
            <a
              href={links.donate}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-gold px-8 py-4 text-lg font-bold text-carbon shadow-brand-lg transition-transform hover:-translate-y-0.5"
            >
              <Heart className="h-5 w-5" aria-hidden="true" />
              Donate
            </a>
            <a
              href={links.interestForm}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-full border-2 border-white/35 px-8 py-4 text-lg font-bold text-white transition-colors hover:bg-white/10"
            >
              Join the interest list
            </a>
            <a
              href="#share"
              className="inline-flex items-center justify-center gap-2 rounded-full border-2 border-white/35 px-8 py-4 text-lg font-bold text-white transition-colors hover:bg-white/10"
            >
              Share the code
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
