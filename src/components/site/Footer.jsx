import React from 'react';
import { Instagram, Facebook, Mail, Phone, MapPin, ExternalLink, Heart } from 'lucide-react';
import { org, links, contact, navLinks } from '@/lib/siteConfig';

/**
 * Footer.
 *
 * Fixes from the audit:
 *  - the old page closed with "Copyright 2026 © Queen Creek Botanical Gardens"
 *    on a SoloUp/Cultivate Goodness page. Attribution is now explicit about the
 *    programme-within-an-organisation relationship.
 *  - social links now exist (the previous page had none anywhere)
 *  - contact rows render only when a real value is set in siteConfig, so the
 *    footer never shows an invented email or phone number.
 */
export default function Footer() {
  const year = new Date().getFullYear();
  const hasContact = contact.email || contact.phone || contact.addressLines;

  return (
    <footer className="on-dark bg-carbon text-white">
      <div className="container-brand py-16">
        <div className="grid gap-12 lg:grid-cols-[1.4fr_1fr_1fr]">
          <div>
            <img
              src="/brand/soloup-logo.png"
              width={480}
              height={140}
              alt={`${org.name} — ${org.tagline}`}
              className="logo-invert h-12 w-auto"
            />
            <p className="mt-6 max-w-md leading-relaxed text-white/75">{org.footerBlurb}</p>

            <ul className="mt-7 flex gap-3">
              <li>
                <a
                  href={links.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex h-12 w-12 items-center justify-center rounded-2xl border border-white/20 transition-colors hover:bg-white/10"
                >
                  <Instagram className="h-5 w-5" aria-hidden="true" />
                  <span className="sr-only">SoloUp on Instagram (opens in a new tab)</span>
                </a>
              </li>
              <li>
                <a
                  href={links.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex h-12 w-12 items-center justify-center rounded-2xl border border-white/20 transition-colors hover:bg-white/10"
                >
                  <Facebook className="h-5 w-5" aria-hidden="true" />
                  <span className="sr-only">SoloUp on Facebook (opens in a new tab)</span>
                </a>
              </li>
            </ul>
          </div>

          <nav aria-labelledby="footer-explore">
            <h2 id="footer-explore" className="eyebrow text-lime">
              Explore
            </h2>
            <ul className="mt-5 space-y-3">
              {navLinks.map((l) => (
                <li key={l.href}>
                  <a href={l.href} className="inline-block py-1 text-white/75 transition-colors hover:text-white">
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <h2 className="eyebrow text-lime">Take action</h2>
            <ul className="mt-5 space-y-3">
              <li>
                <a
                  href={links.donate}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 py-1 text-white/75 transition-colors hover:text-white"
                >
                  Donate <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
                </a>
              </li>
              <li>
                <a
                  href={links.interestForm}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 py-1 text-white/75 transition-colors hover:text-white"
                >
                  Interest list <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
                </a>
              </li>
              <li>
                <a href="#partner" className="inline-block py-1 text-white/75 transition-colors hover:text-white">
                  Employer partnership
                </a>
              </li>
              <li>
                <a
                  href={links.volunteer}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 py-1 text-white/75 transition-colors hover:text-white"
                >
                  Volunteer <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
                </a>
              </li>
              <li>
                <a
                  href={links.cultivateGoodness}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 py-1 text-white/75 transition-colors hover:text-white"
                >
                  Cultivate Goodness <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
                </a>
              </li>
            </ul>

            {hasContact && (
              <ul className="mt-7 space-y-3 border-t border-white/15 pt-6 text-white/75">
                {contact.email && (
                  <li className="flex items-start gap-2.5">
                    <Mail className="mt-1 h-4 w-4 shrink-0 text-lime" aria-hidden="true" />
                    <a href={`mailto:${contact.email}`} className="hover:text-white">{contact.email}</a>
                  </li>
                )}
                {contact.phone && (
                  <li className="flex items-start gap-2.5">
                    <Phone className="mt-1 h-4 w-4 shrink-0 text-lime" aria-hidden="true" />
                    <a href={`tel:${contact.phone.replace(/[^+\d]/g, '')}`} className="hover:text-white">
                      {contact.phone}
                    </a>
                  </li>
                )}
                {contact.addressLines && (
                  <li className="flex items-start gap-2.5">
                    <MapPin className="mt-1 h-4 w-4 shrink-0 text-lime" aria-hidden="true" />
                    <span>
                      {contact.addressLines.map((line) => (
                        <span key={line} className="block">{line}</span>
                      ))}
                    </span>
                  </li>
                )}
              </ul>
            )}
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-4 border-t border-white/15 pt-8 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm leading-relaxed text-white/60">
            © {year} {org.name} — a program of{' '}
            <a href={links.cultivateGoodness} target="_blank" rel="noopener noreferrer" className="underline hover:text-white">
              {org.parentProgram}
            </a>{' '}
            at{' '}
            <a href={links.parentSite} target="_blank" rel="noopener noreferrer" className="underline hover:text-white">
              {org.parentOrg}
            </a>
            .
            {contact.ein && <span className="block sm:inline"> 501(c)(3) EIN {contact.ein}.</span>}
          </p>
          <a
            href={links.donate}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex shrink-0 items-center justify-center gap-2 rounded-full bg-gold px-6 py-3 font-bold text-carbon transition-transform hover:-translate-y-0.5"
          >
            <Heart className="h-4.5 w-4.5" aria-hidden="true" />
            Support SoloUp
          </a>
        </div>
      </div>
    </footer>
  );
}
