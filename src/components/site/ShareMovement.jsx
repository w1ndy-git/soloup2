import React, { useCallback, useEffect, useRef, useState } from 'react';
import QRCode from 'qrcode';
import {
  Download, Copy, Check, Share2, Printer, QrCode as QrIcon,
  Facebook, Instagram, Linkedin, Mail, MessageCircle, Link2,
} from 'lucide-react';
import { SITE_URL, org, links, shareMessages } from '@/lib/siteConfig';

/* Where a printed code can point. An event table wants the donate page, a
   school night wants the interest form, a flyer wants the homepage. */
const TARGETS = [
  { key: 'home', label: 'The SoloUp page', url: SITE_URL, hint: 'Best for flyers and posters' },
  { key: 'donate', label: 'Donate directly', url: links.donate, hint: 'Best for events and giving tables' },
  { key: 'interest', label: 'Interest form', url: links.interestForm, hint: 'Best for schools and families' },
];

/* The code is drawn in the logo's own ink so a printed flyer matches the mark. */
const CARBON = '#111111';
const CREAM = '#fbfaf4';
const LEAF = '#3f6b33';
const OCEAN = '#2f6f9f';

export default function ShareMovement() {
  const canvasRef = useRef(null);
  const logoRef = useRef(null);
  const [target, setTarget] = useState(TARGETS[0]);
  const [msgKey, setMsgKey] = useState(shareMessages[0].key);
  const [copied, setCopied] = useState('');
  const [canNativeShare, setCanNativeShare] = useState(false);

  const message = shareMessages.find((m) => m.key === msgKey) || shareMessages[0];
  const shareText = message.text.replace(SITE_URL, target.url);

  useEffect(() => {
    setCanNativeShare(typeof navigator !== 'undefined' && typeof navigator.share === 'function');
  }, []);

  /* Preload the logo once so the QR can be redrawn without a flash. */
  useEffect(() => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = '/brand/soloup-logo.png';
    img.onload = () => {
      logoRef.current = img;
      draw();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const draw = useCallback(async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const size = 720;
    canvas.width = size;
    canvas.height = size;

    /* Error-correction level H tolerates ~30% occlusion, which is what lets the
       logo sit in the middle without breaking the scan. */
    await QRCode.toCanvas(canvas, target.url, {
      errorCorrectionLevel: 'H',
      margin: 2,
      width: size,
      color: { dark: CARBON, light: CREAM },
    });

    const ctx = canvas.getContext('2d');
    const logo = logoRef.current;
    if (!ctx || !logo) return;

    /* Knockout plate + wordmark, centred. Kept under 22% of the code area. */
    const plateW = size * 0.34;
    const plateH = plateW * (logo.height / logo.width) + size * 0.035;
    const x = (size - plateW) / 2;
    const y = (size - plateH) / 2;

    ctx.fillStyle = CREAM;
    const r = 14;
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.arcTo(x + plateW, y, x + plateW, y + plateH, r);
    ctx.arcTo(x + plateW, y + plateH, x, y + plateH, r);
    ctx.arcTo(x, y + plateH, x, y, r);
    ctx.arcTo(x, y, x + plateW, y, r);
    ctx.closePath();
    ctx.fill();

    const lw = plateW * 0.88;
    const lh = lw * (logo.height / logo.width);
    ctx.drawImage(logo, x + (plateW - lw) / 2, y + (plateH - lh) / 2, lw, lh);
  }, [target]);

  useEffect(() => {
    draw();
  }, [draw]);

  const copy = async (text, key) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(key);
      setTimeout(() => setCopied(''), 2000);
    } catch {
      /* clipboard blocked — the text is selectable on screen either way */
    }
  };

  const downloadQr = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const a = document.createElement('a');
    a.download = `soloup-qr-${target.key}.png`;
    a.href = canvas.toDataURL('image/png');
    a.click();
  };

  /* A printable flyer: headline, tagline, the code, and the URL in plain text
     so it still works for anyone who cannot or will not scan. */
  const printPoster = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dataUrl = canvas.toDataURL('image/png');
    const w = window.open('', '_blank', 'width=880,height=1100');
    if (!w) return;
    w.document.write(`<!doctype html><html lang="en"><head><meta charset="utf-8">
<title>SoloUp — printable flyer</title>
<style>
  @page { size: letter portrait; margin: 0.6in; }
  * { box-sizing: border-box; }
  body { margin:0; font-family: Inter, -apple-system, "Segoe UI", sans-serif; color:${CARBON};
         background:${CREAM}; display:flex; align-items:center; justify-content:center; }
  .sheet { width:100%; max-width:7.3in; text-align:center; padding:0.3in 0; }
  .logo { width:3.1in; margin:0 auto 0.22in; display:block; }
  .kicker { font-size:11pt; font-weight:800; letter-spacing:.16em; text-transform:uppercase; color:${LEAF}; margin:0 0 .12in; }
  h1 { font-size:30pt; font-weight:900; line-height:1.08; letter-spacing:-.01em; margin:0 0 .16in; }
  p.lede { font-size:12.5pt; line-height:1.5; max-width:5.6in; margin:0 auto .26in; color:${CARBON}; }
  /* The logo's keyline box, around the code. */
  .qr { width:3.15in; height:3.15in; border:3px solid ${CARBON}; border-radius:10px; padding:8px; background:${CREAM}; }
  .cta { font-size:15pt; font-weight:800; margin:.2in 0 .06in; }
  .url { font-size:12pt; font-weight:700; color:${OCEAN}; word-break:break-all; }
  .foot { margin-top:.24in; font-size:9.5pt; color:#5a6066; line-height:1.5; }
  @media print { .no-print { display:none !important; } body { background:#fff; } }
  .no-print { margin-top:.3in; }
  .no-print button { font:inherit; font-weight:800; padding:10px 22px; border-radius:999px;
                     border:0; background:${CARBON}; color:#fff; cursor:pointer; }
</style></head><body><div class="sheet">
  <img class="logo" src="/brand/soloup-logo.png" alt="${org.name} — ${org.tagline}">
  <p class="kicker">${org.heroKicker}</p>
  <h1>${org.heroHeadline}</h1>
  <p class="lede">${org.heroBody}</p>
  <img class="qr" src="${dataUrl}" alt="QR code linking to ${target.url}">
  <p class="cta">Scan to ${target.key === 'donate' ? 'give' : target.key === 'interest' ? 'join the interest list' : 'learn more'}</p>
  <p class="url">${target.url}</p>
  <p class="foot">${org.footerBlurb}</p>
  <div class="no-print"><button onclick="window.print()">Print this flyer</button></div>
</div></body></html>`);
    w.document.close();
  };

  const nativeShare = async () => {
    try {
      await navigator.share({ title: `${org.name} — ${org.tagline}`, text: shareText, url: target.url });
    } catch {
      /* user dismissed the sheet */
    }
  };

  const enc = encodeURIComponent;
  const socials = [
    { label: 'Facebook', Icon: Facebook, href: `https://www.facebook.com/sharer/sharer.php?u=${enc(target.url)}` },
    { label: 'LinkedIn', Icon: Linkedin, href: `https://www.linkedin.com/sharing/share-offsite/?url=${enc(target.url)}` },
    { label: 'WhatsApp', Icon: MessageCircle, href: `https://wa.me/?text=${enc(shareText)}` },
    { label: 'Email', Icon: Mail, href: `mailto:?subject=${enc(`${org.name} — ${org.tagline}`)}&body=${enc(shareText)}` },
    { label: 'Text message', Icon: MessageCircle, href: `sms:?&body=${enc(shareText)}` },
  ];

  return (
    <section id="share" className="scroll-mt-24 grad-page py-20 sm:py-28">
      <div className="container-brand">
        <div className="mx-auto max-w-3xl text-center">
          <p className="eyebrow text-ocean">Spread the Word</p>
          <h2 className="mt-3 font-display text-4xl font-black leading-tight tracking-tight text-carbon sm:text-5xl">
            Put SoloUp in front of the people who can help.
          </h2>
          <p className="mt-6 text-lg leading-relaxed text-stone">
            Most people have never heard of a program like this — and the ones who could hire a
            participant, fund a scholarship or enroll their own young adult are usually one
            conversation away. Take the code. Post it, print it, hand it to someone.
          </p>
        </div>

        <div className="mt-14 grid gap-8 lg:grid-cols-[minmax(0,440px)_1fr] lg:items-start">
          {/* QR panel */}
          <div className="rounded-[1.75rem] border border-carbon/10 bg-white p-6 shadow-brand sm:p-8">
            <div className="mx-auto w-full max-w-[320px]">
              <canvas
                ref={canvasRef}
                className="aspect-square w-full rounded-2xl border-2 border-carbon/10"
                role="img"
                aria-label={`QR code linking to ${target.url}`}
              />
            </div>

            <fieldset className="mt-6">
              <legend className="text-sm font-bold uppercase tracking-[0.14em] text-stone">
                Where should it point?
              </legend>
              <div className="mt-3 space-y-2">
                {TARGETS.map((t) => (
                  <label
                    key={t.key}
                    className={[
                      'flex cursor-pointer items-start gap-3 rounded-2xl border-2 p-3.5 transition-colors',
                      target.key === t.key ? 'border-ocean bg-sky' : 'border-carbon/10 hover:bg-sky/60',
                    ].join(' ')}
                  >
                    <input
                      type="radio"
                      name="qr-target"
                      value={t.key}
                      checked={target.key === t.key}
                      onChange={() => setTarget(t)}
                      className="mt-0.5 h-6 w-6 shrink-0 accent-[#2f6f9f]"
                    />
                    <span>
                      <span className="block font-bold text-carbon">{t.label}</span>
                      <span className="block text-sm text-stone">{t.hint}</span>
                    </span>
                  </label>
                ))}
              </div>
            </fieldset>

            <div className="mt-5 grid gap-2 sm:grid-cols-2">
              <button
                type="button"
                onClick={downloadQr}
                className="inline-flex items-center justify-center gap-2 rounded-full bg-carbon px-5 py-3 font-bold text-white transition-transform hover:-translate-y-0.5"
              >
                <Download className="h-4.5 w-4.5" aria-hidden="true" />
                Download PNG
              </button>
              <button
                type="button"
                onClick={printPoster}
                className="inline-flex items-center justify-center gap-2 rounded-full border-2 border-carbon/15 px-5 py-3 font-bold text-carbon transition-colors hover:bg-sky"
              >
                <Printer className="h-4.5 w-4.5" aria-hidden="true" />
                Printable flyer
              </button>
            </div>
          </div>

          {/* Share panel */}
          <div className="space-y-6">
            <div className="rounded-[1.75rem] border border-carbon/10 bg-white p-6 shadow-brand sm:p-8">
              <h3 className="text-xl font-extrabold text-carbon">Pick what to say</h3>
              <div className="mt-4 flex flex-wrap gap-2">
                {shareMessages.map((m) => (
                  <button
                    key={m.key}
                    type="button"
                    onClick={() => setMsgKey(m.key)}
                    aria-pressed={msgKey === m.key}
                    className={[
                      'rounded-full px-4 py-2 text-sm font-bold transition-colors',
                      msgKey === m.key ? 'bg-carbon text-white' : 'border-2 border-carbon/15 text-carbon hover:bg-sky',
                    ].join(' ')}
                  >
                    {m.label}
                  </button>
                ))}
              </div>

              <p className="mt-5 rounded-2xl bg-sky p-5 leading-relaxed text-ink">{shareText}</p>

              <div className="mt-4 flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => copy(shareText, 'caption')}
                  className="inline-flex items-center gap-2 rounded-full border-2 border-carbon/15 px-5 py-2.5 font-bold text-carbon transition-colors hover:bg-sky"
                >
                  {copied === 'caption' ? (
                    <Check className="h-4.5 w-4.5 text-leaf" aria-hidden="true" />
                  ) : (
                    <Copy className="h-4.5 w-4.5" aria-hidden="true" />
                  )}
                  {copied === 'caption' ? 'Copied' : 'Copy caption'}
                </button>
                <button
                  type="button"
                  onClick={() => copy(target.url, 'url')}
                  className="inline-flex items-center gap-2 rounded-full border-2 border-carbon/15 px-5 py-2.5 font-bold text-carbon transition-colors hover:bg-sky"
                >
                  {copied === 'url' ? (
                    <Check className="h-4.5 w-4.5 text-leaf" aria-hidden="true" />
                  ) : (
                    <Link2 className="h-4.5 w-4.5" aria-hidden="true" />
                  )}
                  {copied === 'url' ? 'Copied' : 'Copy link'}
                </button>
                {canNativeShare && (
                  <button
                    type="button"
                    onClick={nativeShare}
                    className="inline-flex items-center gap-2 rounded-full bg-gold px-5 py-2.5 font-bold text-carbon transition-transform hover:-translate-y-0.5"
                  >
                    <Share2 className="h-4.5 w-4.5" aria-hidden="true" />
                    Share…
                  </button>
                )}
              </div>
            </div>

            <div className="rounded-[1.75rem] border border-carbon/10 bg-white p-6 shadow-brand sm:p-8">
              <h3 className="text-xl font-extrabold text-carbon">Post it</h3>
              <ul className="mt-4 flex flex-wrap gap-2">
                {socials.map(({ label, Icon, href }) => (
                  <li key={label}>
                    <a
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 rounded-full border-2 border-carbon/15 px-4 py-2.5 font-bold text-carbon transition-colors hover:bg-sky"
                    >
                      <Icon className="h-4.5 w-4.5" aria-hidden="true" />
                      {label}
                    </a>
                  </li>
                ))}
              </ul>

              <p className="mt-5 text-sm leading-relaxed text-stone">
                Instagram has no share-by-link option — download the code above and post it to a
                story, then add the link sticker.
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                <a
                  href={links.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-full grad-ocean px-4 py-2.5 font-bold text-white transition-transform hover:-translate-y-0.5"
                >
                  <Instagram className="h-4.5 w-4.5" aria-hidden="true" />
                  Follow on Instagram
                </a>
                <a
                  href={links.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-full grad-ocean px-4 py-2.5 font-bold text-white transition-transform hover:-translate-y-0.5"
                >
                  <Facebook className="h-4.5 w-4.5" aria-hidden="true" />
                  Follow on Facebook
                </a>
              </div>
            </div>

            <div className="flex items-start gap-3 rounded-2xl bg-lime p-5">
              <QrIcon className="mt-0.5 h-5 w-5 shrink-0 text-leaf" aria-hidden="true" />
              <p className="text-[0.95rem] leading-relaxed text-ink">
                <strong className="font-bold">Where a printed code earns its keep:</strong> library and
                church noticeboards, the counter at a partner business, school transition-night
                tables, garden events, and the back of a business card.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
