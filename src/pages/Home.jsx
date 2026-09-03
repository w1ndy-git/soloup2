import React from "react";
import Header from "@/components/site/Header";
import Hero from "@/components/site/Hero";
import About from "@/components/site/About";
import Programs from "@/components/site/Programs";
import Testimonials from "@/components/site/Testimonials";
import ShareMovement from "@/components/site/ShareMovement";
import Impact from "@/components/site/Impact";
import GetInvolved from "@/components/site/GetInvolved";
import Footer from "@/components/site/Footer";

export default function Home() {
  return (
    <div className="min-h-screen bg-mist">
      <Header />
      <main>
        <Hero />
        <About />
        <Programs />
        <Testimonials />
        <ShareMovement />
        <Impact />
        <GetInvolved />
      </main>
      <Footer />
    </div>
  );
}