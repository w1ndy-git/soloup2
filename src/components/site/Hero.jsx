import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Sprout, HandHeart, Briefcase } from 'lucide-react';
import { org } from '@/lib/siteConfig';

const badges = [
  { icon: Sprout, label: 'Strength-based coaching' },
  { icon: HandHeart, label: 'Real-world experience' },
  { icon: Briefcase, label: 'Purposeful employment' },
];

export default function Hero() {
  return (
    <section id="top" className="relative overflow-hidden grad-hero text-white">
      {/* Decorative growth arcs — echoes the arrow in the SoloUp mark. */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 opacity-[0.14]">
        <svg className="h-full w-full" viewBox="0 0 1200 600" preserveAspectRatio="xMidYMid slice">
          <defs>
            <linearGradient id="heroArc" x1="0" y1="1" x2="1" y2="0">
              <stop offset="0%" stopColor="#dcebcf" stopOpacity="0" />
              <stop offset="100%" stopColor="#dcebcf" />
            </linearGradient>
          </defs>
          {[0, 1, 2, 3, 4].map((i) => (
            <path
              key={i}
              d={`M-40 ${640 + i * 30} Q ${420 + i * 70} ${360 - i * 55} ${1260} ${120 - i * 40}`}
              fill="none"
              stroke="url(#heroArc)"
              strokeWidth={1.5}
            />
          ))}
        </svg>
      </div>

      <div className="container-brand relative py-20 sm:py-24 lg:py-32">
        <div className="grid items-center gap-14 lg:grid-cols-[1.05fr_0.95fr]">
          <div>
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-4 py-1.5 text-sm font-semibold tracking-wide text-lime"
            >
              {org.heroKicker}
            </motion.p>

            <motion.h1
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.06 }}
              className="mt-6 font-display text-[2.6rem] font-black leading-[1.05] tracking-tight sm:text-6xl lg:text-7xl"
            >
              Skills.{' '}
              <span className="block sm:inline">
                Confidence.{' '}
                <span className="relative inline-block">
                  Purpose.
                  <svg
                    aria-hidden="true"
                    viewBox="0 0 300 18"
                    className="absolute -bottom-2 left-0 w-full text-gold"
                    preserveAspectRatio="none"
                  >
                    <path
                      d="M4 12 C 80 4, 210 4, 296 10"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={7}
                      strokeLinecap="round"
                    />
                  </svg>
                </span>
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.14 }}
              className="mt-8 max-w-xl text-lg leading-relaxed text-white/85 sm:text-xl"
            >
              {org.heroBody}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.22 }}
              className="mt-10 flex flex-col gap-3 sm:flex-row sm:flex-wrap"
            >
              <a
                href="#involved"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-gold px-8 py-4 text-lg font-bold text-carbon shadow-brand-lg transition-transform hover:-translate-y-0.5"
              >
                Join the Movement
                <ArrowRight className="h-5 w-5" aria-hidden="true" />
              </a>
              <a
                href="#about"
                className="inline-flex items-center justify-center gap-2 rounded-full border-2 border-white/35 px-8 py-4 text-lg font-bold text-white transition-colors hover:bg-white/10"
              >
                Explore the Program
              </a>
            </motion.div>

            <motion.ul
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="mt-10 flex flex-wrap gap-x-6 gap-y-3"
            >
              {badges.map(({ icon: Icon, label }) => (
                <li key={label} className="inline-flex items-center gap-2 text-sm font-semibold text-lime">
                  <Icon className="h-4.5 w-4.5 shrink-0" aria-hidden="true" />
                  {label}
                </li>
              ))}
            </motion.ul>
          </div>

          {/* Logo lockup card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.18 }}
            className="relative mx-auto w-full max-w-md lg:max-w-none"
          >
            <div className="rounded-[2rem] border border-white/15 bg-white/10 p-8 backdrop-blur-sm sm:p-10">
              <img
                src="/brand/soloup-logo.png"
                width={480}
                height={140}
                alt=""
                className="logo-invert w-full"
              />
              <p className="mt-8 border-t border-white/20 pt-6 text-center font-alt text-base leading-relaxed text-white/85">
                Every participant starts somewhere. SoloUp makes sure that somewhere
                leads onward — to work, to community, to a life they choose.
              </p>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Wave into the cream page body */}
      <div aria-hidden="true" className="relative -mb-px">
        <svg viewBox="0 0 1440 90" className="block w-full text-cream" preserveAspectRatio="none">
          <path fill="currentColor" d="M0 90 L0 46 C 240 96, 480 6, 720 26 C 960 46, 1200 86, 1440 40 L1440 90 Z" />
        </svg>
      </div>
    </section>
  );
}
