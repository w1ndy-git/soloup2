import React from 'react';
import Header from '@/components/site/Header';
import Hero from '@/components/site/Hero';
import About from '@/components/site/About';
import Programs from '@/components/site/Programs';
import Testimonials from '@/components/site/Testimonials';
import Impact from '@/components/site/Impact';
import GetInvolved from '@/components/site/GetInvolved';
import ShareMovement from '@/components/site/ShareMovement';
import Footer from '@/components/site/Footer';

export default function Home() {
  return (
    <div className="min-h-screen bg-cream">
      {/* Keyboard users can jump the nav — the previous site's skip link was
          present but the theme hid it behind the sticky header. */}
      <a href="#main" className="skip-link">Skip to main content</a>

      <Header />

      <main id="main">
        <Hero />
        <About />
        <Programs />
        <Testimonials />
        <Impact />
        <GetInvolved />
        <ShareMovement />
      </main>

      <Footer />
    </div>
  );
}
