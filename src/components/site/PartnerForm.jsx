import React, { useState } from 'react';
import { Building2, Check, Loader2, AlertCircle } from 'lucide-react';
import { base44 } from '@/api/base44Client';

const INTERESTS = [
  { value: 'internship', label: 'A supported internship' },
  { value: 'job_trial', label: 'A short job trial' },
  { value: 'hiring', label: 'Hiring a participant' },
  { value: 'volunteering', label: 'Volunteering or mentoring' },
  { value: 'donation_in_kind', label: 'Donating goods or services' },
  { value: 'other', label: 'Something else' },
];

/**
 * Employer / community-partner intake.
 *
 * On the current site the "For Employers" button points at the *families*
 * interest form, so an employer who clicks it is asked about their young adult.
 * This form gives that audience somewhere correct to land. Submissions appear
 * under `PartnerInquiry` in the Base44 dashboard.
 */
export default function PartnerForm() {
  const [state, setState] = useState('idle'); // idle | sending | done | error
  const [form, setForm] = useState({
    contact_name: '',
    organization: '',
    email: '',
    phone: '',
    interest: 'internship',
    message: '',
  });

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    if (state === 'sending') return;
    setState('sending');
    try {
      await base44.entities.PartnerInquiry.create({ ...form, status: 'new' });
      setState('done');
    } catch {
      setState('error');
    }
  };

  const field =
    'w-full rounded-2xl border-2 border-navy/15 bg-white px-4 py-3 text-ink placeholder:text-stone/60 focus:border-ocean';
  const label = 'block text-sm font-bold text-navy';

  return (
    <div id="partner" className="mt-16 scroll-mt-24 overflow-hidden rounded-[2rem] border border-navy/10 bg-white shadow-brand">
      <div className="grid lg:grid-cols-[0.85fr_1.15fr]">
        <div className="grad-deep p-8 text-white sm:p-10">
          <span className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-white/15">
            <Building2 className="h-7 w-7" aria-hidden="true" />
          </span>
          <h3 className="mt-6 font-display text-2xl font-black leading-tight sm:text-3xl">
            Employers: start here.
          </h3>
          <p className="mt-4 leading-relaxed text-white/85">
            You do not need a special programme, a dedicated budget, or prior experience with
            disability hiring. Tell us what your workplace does and SoloUp will do the rest — matching,
            coaching, and ongoing support for both the employee and your team.
          </p>
          <ul className="mt-6 space-y-2.5 text-[0.95rem] text-white/85">
            {['Coaching continues after placement', 'Start with a trial, not a commitment', 'Support for your existing staff too'].map(
              (t) => (
                <li key={t} className="flex items-start gap-2.5">
                  <Check className="mt-0.5 h-4.5 w-4.5 shrink-0 text-lime" aria-hidden="true" />
                  {t}
                </li>
              ),
            )}
          </ul>
        </div>

        <div className="p-8 sm:p-10">
          {state === 'done' ? (
            <div className="flex h-full flex-col items-center justify-center py-10 text-center">
              <span className="inline-flex h-16 w-16 items-center justify-center rounded-full grad-lime">
                <Check className="h-8 w-8 text-leaf" aria-hidden="true" />
              </span>
              <h4 className="mt-5 font-display text-2xl font-black text-navy">Thank you — that came through.</h4>
              <p className="mt-3 max-w-sm leading-relaxed text-stone">
                Someone from SoloUp will be in touch. If it is urgent, reach the team through the
                Queen Creek Botanical Gardens office.
              </p>
            </div>
          ) : (
            <form onSubmit={submit} className="space-y-4" noValidate>
              <h4 className="font-display text-xl font-black text-navy">Tell us about your workplace</h4>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className={label} htmlFor="pf-name">
                    Your name <span className="text-destructive">*</span>
                  </label>
                  <input id="pf-name" required value={form.contact_name} onChange={set('contact_name')} className={`${field} mt-1.5`} autoComplete="name" />
                </div>
                <div>
                  <label className={label} htmlFor="pf-org">Organisation</label>
                  <input id="pf-org" value={form.organization} onChange={set('organization')} className={`${field} mt-1.5`} autoComplete="organization" />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className={label} htmlFor="pf-email">
                    Email <span className="text-destructive">*</span>
                  </label>
                  <input id="pf-email" type="email" required value={form.email} onChange={set('email')} className={`${field} mt-1.5`} autoComplete="email" />
                </div>
                <div>
                  <label className={label} htmlFor="pf-phone">Phone (optional)</label>
                  <input id="pf-phone" type="tel" value={form.phone} onChange={set('phone')} className={`${field} mt-1.5`} autoComplete="tel" />
                </div>
              </div>

              <div>
                <label className={label} htmlFor="pf-interest">I am interested in</label>
                <select id="pf-interest" value={form.interest} onChange={set('interest')} className={`${field} mt-1.5`}>
                  {INTERESTS.map((o) => (
                    <option key={o.value} value={o.value}>{o.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className={label} htmlFor="pf-message">Anything else?</label>
                <textarea id="pf-message" rows={3} value={form.message} onChange={set('message')} className={`${field} mt-1.5 resize-y`} />
              </div>

              {state === 'error' && (
                <p role="alert" className="flex items-start gap-2 rounded-2xl bg-destructive/10 p-4 text-[0.95rem] text-destructive">
                  <AlertCircle className="mt-0.5 h-4.5 w-4.5 shrink-0" aria-hidden="true" />
                  That did not send. Please try again, or reach SoloUp through the Queen Creek
                  Botanical Gardens office.
                </p>
              )}

              <button
                type="submit"
                disabled={state === 'sending'}
                className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-navy px-7 py-4 text-lg font-bold text-white transition-transform hover:-translate-y-0.5 disabled:opacity-60 sm:w-auto"
              >
                {state === 'sending' && <Loader2 className="h-5 w-5 animate-spin" aria-hidden="true" />}
                {state === 'sending' ? 'Sending…' : 'Send to SoloUp'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
