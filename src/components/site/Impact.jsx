import React from 'react';
import { motion } from 'framer-motion';
import { Quote } from 'lucide-react';
import { impact } from '@/lib/siteConfig';

export default function Impact() {
  return (
    <section id="impact" className="scroll-mt-24 grad-hero py-20 text-white sm:py-28">
      <div className="container-brand">
        <div className="grid gap-14 lg:grid-cols-[1fr_1fr] lg:items-center">
          <div>
            <p className="eyebrow text-lime">The Impact</p>
            <h2 className="mt-3 font-display text-4xl font-black leading-tight tracking-tight sm:text-5xl">
              {impact.heading}
            </h2>
            <p className="mt-6 text-lg leading-relaxed text-white/85">{impact.body}</p>

            <figure className="mt-10 rounded-[1.75rem] border border-white/20 bg-white/10 p-8 backdrop-blur-sm">
              <Quote className="h-8 w-8 text-gold" aria-hidden="true" />
              <blockquote className="mt-4 text-xl font-medium leading-relaxed text-white">
                {impact.pullQuote}
              </blockquote>
              <figcaption className="mt-4 text-sm font-semibold text-lime">
                — The SoloUp program promise
              </figcaption>
            </figure>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {impact.markers.map((m, i) => (
              <motion.div
                key={m.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                className="rounded-[1.5rem] border border-white/20 bg-white/10 p-7 backdrop-blur-sm"
              >
                <p className="font-display text-4xl font-black leading-none text-gold sm:text-5xl">
                  {m.label}
                </p>
                <p className="mt-3 leading-relaxed text-white/85">{m.body}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
