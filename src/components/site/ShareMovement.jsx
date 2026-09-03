import React, { useRef, useState } from "react";
import { Seed } from "@/components/site/Botanical";

const SHARE_URL = "https://soloup.org";
const QR_SRC = `https://api.qrserver.com/v1/create-qr-code/?size=400x400&data=${encodeURIComponent(SHARE_URL)}&color=1B4332&bgcolor=F8F9F1&margin=0&qzone=1`;
const CARD_IMG = "https://media.base44.com/images/public/6a98e133ceb86cb304e163c7/9e186c5c7_generated_b6b930d5.jpg";

const SHARE_PLATFORMS = [
  { label: "Facebook", href: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(SHARE_URL)}`, icon: "f" },
  { label: "X", href: `https://twitter.com/intent/tweet?url=${encodeURIComponent(SHARE_URL)}&text=${encodeURIComponent("Seeds of Limitless Opportunities — SoloUp helps young adults with disabilities grow beyond the classroom.")}`, icon: "𝕏" },
  { label: "WhatsApp", href: `https://wa.me/?text=${encodeURIComponent("Seeds of Limitless Opportunities — SoloUp: " + SHARE_URL)}`, icon: "✆" },
  { label: "Email", href: `mailto:?subject=${encodeURIComponent("SoloUp — Seeds of Limitless Opportunities")}&body=${encodeURIComponent("Check out SoloUp, helping young adults with disabilities grow beyond the classroom: " + SHARE_URL)}`, icon: "✉" },
];

export default function ShareMovement() {
  const cardRef = useRef(null);
  const [generating, setGenerating] = useState(false);
  const [ready, setReady] = useState(false);

  const generateCard = async () => {
    if (!cardRef.current) return;
    setGenerating(true);
    try {
      const html2canvas = (await import("html2canvas")).default;
      const canvas = await html2canvas(cardRef.current, {
        scale: 2,
        useCORS: true,
        backgroundColor: null,
        logging: false,
      });
      const dataUrl = canvas.toDataURL("image/png");
      const link = document.createElement("a");
      link.href = dataUrl;
      link.download = "soloup-share-the-movement.png";
      link.click();
      setReady(true);
    } catch (e) {
      // CORS or capture failure — fall back to sharing the link directly
      try {
        if (navigator.share) {
          await navigator.share({ title: "SoloUp — Seeds of Limitless Opportunities", url: SHARE_URL });
        } else {
          await navigator.clipboard.writeText(SHARE_URL);
          alert("Card capture wasn't available here — we copied the link instead. Paste it into your story!");
        }
      } catch {
        alert("Couldn't generate the card just now — please use the Share link button below.");
      }
    } finally {
      setGenerating(false);
    }
  };

  const nativeShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: "SoloUp — Seeds of Limitless Opportunities",
          text: "Help young adults with disabilities grow beyond the classroom into meaningful adult lives.",
          url: SHARE_URL,
        });
      } else {
        await navigator.clipboard.writeText(SHARE_URL);
        alert("Link copied — share it anywhere!");
      }
    } catch {
      /* cancelled */
    }
  };

  return (
    <section id="share" className="relative bg-gradient-to-b from-forest to-forest-deep py-24 sm:py-32 overflow-hidden">
      <Seed className="absolute -top-10 -left-10 w-72 text-petal/10 animate-sway" />
      <Seed className="absolute -bottom-16 -right-10 w-80 text-terracotta/10 animate-sway" />
      <div className="relative mx-auto max-w-7xl px-5 sm:px-8">
        <div className="text-center max-w-2xl mx-auto">
          <span className="text-petal font-semibold uppercase tracking-[0.2em] text-xs">Grow the Movement</span>
          <h2 className="mt-3 font-display font-light text-display text-mist text-balance">
            Share a seed. <span className="italic text-petal">Grow a future.</span>
          </h2>
          <p className="mt-5 text-lg text-mist/70">
            One tap turns you into an ambassador. Scan the seed, post a card, and help the world discover
            what we're growing together.
          </p>
        </div>

        <div className="mt-14 grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          {/* QR seed */}
          <div className="flex flex-col items-center">
            <div className="relative">
              <div className="absolute -inset-6 rounded-full bg-petal/20 blur-2xl animate-pulse-glow" aria-hidden="true" />
              <div className="relative mask-leaf bg-mist p-7 rounded-[2.5rem] shadow-2xl">
                <img
                  src={QR_SRC}
                  alt="QR code linking to soloup.org"
                  className="w-56 h-56 sm:w-64 sm:h-64"
                  crossOrigin="anonymous"
                />
                <div className="absolute inset-0 grid place-items-center pointer-events-none">
                  <span className="grid place-items-center w-14 h-14 rounded-full bg-forest text-petal shadow-lg">
                    <Seed className="w-8 h-8 text-petal" />
                  </span>
                </div>
              </div>
            </div>
            <p className="mt-6 text-mist/80 font-medium text-center max-w-xs">
              Scan with your camera to open <span className="text-petal font-semibold">soloup.org</span>
            </p>
            <div className="mt-5 flex flex-wrap justify-center gap-2">
              {SHARE_PLATFORMS.map((p) => (
                <a
                  key={p.label}
                  href={p.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Share on ${p.label}`}
                  className="grid place-items-center w-12 h-12 rounded-full bg-mist/10 border border-mist/20 text-mist hover:bg-petal hover:text-forest hover:border-petal transition-colors min-w-[44px] font-bold"
                >
                  {p.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Social card generator */}
          <div>
            <p className="text-mist/80 text-lg leading-relaxed">
              Generate a ready-to-post story card — a golden-hour garden moment, our tagline, and the QR seed
              all in one. Perfect for Instagram or Facebook stories.
            </p>

            {/* Hidden render target for html2canvas (9:16 story format) */}
            <div className="absolute -left-[9999px] top-0" aria-hidden="true">
              <div
                ref={cardRef}
                style={{ width: 1080, height: 1920, background: "#1B4332", position: "relative", overflow: "hidden", fontFamily: "'Plus Jakarta Sans', sans-serif" }}
              >
                <img src={CARD_IMG} crossOrigin="anonymous" style={{ position: "absolute", inset: 0, width: "100%", height: "62%", objectFit: "cover" }} alt="" />
                <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, rgba(20,53,39,0.35) 0%, rgba(27,67,50,0.2) 45%, #1B4332 62%)" }} />
                <div style={{ position: "absolute", top: 70, left: 70, right: 70 }}>
                  <span style={{ display: "inline-block", padding: "14px 28px", borderRadius: 999, background: "rgba(248,249,241,0.15)", border: "2px solid rgba(248,249,241,0.3)", color: "#F8F9F1", fontSize: 26, fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase" }}>SoloUp</span>
                </div>
                <div style={{ position: "absolute", bottom: 360, left: 70, right: 70 }}>
                  <p style={{ color: "#FFD166", fontFamily: "'Fraunces', serif", fontSize: 96, fontWeight: 300, lineHeight: 1.05, margin: 0 }}>Seeds of<br />Limitless<br />Opportunities</p>
                </div>
                <div style={{ position: "absolute", bottom: 70, left: 70, display: "flex", alignItems: "center", gap: 36 }}>
                  <img src={QR_SRC} crossOrigin="anonymous" style={{ width: 220, height: 220, borderRadius: 28, background: "#F8F9F1", padding: 12 }} alt="" />
                  <div>
                    <p style={{ color: "#F8F9F1", fontSize: 34, fontWeight: 700, margin: 0 }}>Scan to grow<br />the movement</p>
                    <p style={{ color: "rgba(248,249,241,0.7)", fontSize: 28, marginTop: 14 }}>soloup.org</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
              <button
                onClick={generateCard}
                disabled={generating}
                className="inline-flex items-center gap-2 px-7 py-4 rounded-full bg-petal text-forest font-bold shadow-xl shadow-petal/30 hover:bg-petal-soft transition-colors disabled:opacity-60 min-h-[52px]"
              >
                {generating ? (
                  <>
                    <span className="w-5 h-5 border-2 border-forest/30 border-t-forest rounded-full animate-spin" />
                    Growing your card…
                  </>
                ) : (
                  <>
                    <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="4" /><path d="M3 15l5-5 4 4 3-3 6 6" /><circle cx="9" cy="9" r="2" /></svg>
                    Generate My Social Card
                  </>
                )}
              </button>
              <button
                onClick={nativeShare}
                className="inline-flex items-center gap-2 px-7 py-4 rounded-full bg-mist/10 border border-mist/30 text-mist font-semibold hover:bg-mist/20 transition-colors min-h-[52px]"
              >
                <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><circle cx="18" cy="5" r="3" /><circle cx="6" cy="12" r="3" /><circle cx="18" cy="19" r="3" /><path d="M8.6 13.5l6.8 4M15.4 6.5l-6.8 4" /></svg>
                Share link
              </button>
            </div>
            {ready && (
              <p className="mt-4 text-petal font-semibold flex items-center gap-2">
                <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12l5 5L20 7" /></svg>
                Card saved! Post it to your story and tag a friend to keep it growing.
              </p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}