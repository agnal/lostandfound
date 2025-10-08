import React from 'react';
import { MenuBar } from '../components/MenuBar';
import { Button } from '../components/ui/Button';

const featureItems = [
  {
    icon: 'https://c.animaapp.com/mg7at5dvnSTE4c/img/vector.svg',
    title: 'For Lost Items',
    description:
      'Quickly report your lost items, share details, and get notified when a match is found—so you can recover what matters most.',
  },
  {
    icon: 'https://c.animaapp.com/mg7at5dvnSTE4c/img/vector-1.svg',
    title: 'For Found Items',
    description:
      'Easily report found items with photos and location, and connect securely with owners—so every item finds its way home.',
  },
];

const Home = () => {
  return (
    <div className="bg-white overflow-hidden w-full min-w-[320px] min-h-[2145px] relative">
      <div className="w-full">
        <MenuBar />
      </div>

      <section className="flex flex-col w-full items-center gap-24 pt-24 pb-0 px-10 relative bg-[#f5fff9] rounded-b-2xl overflow-hidden">
        <div className="flex flex-col lg:flex-row w-full max-w-6xl items-center gap-20">
          <div className="flex flex-col items-start gap-12 max-w-xl">
            <div className="flex flex-col items-start gap-6">
              <h1 className="font-bold text-5xl text-[#2d4f20]">Back2You</h1>
              <p className="text-xl text-[#2d4f20]/80">
                Helping lost things find their way home!
              </p>
            </div>

            <Button
              className="bg-[#2d4f20] hover:bg-[#1f3517] text-white rounded-full px-6 py-3"
              onClick={() => (window.location.href = '/lost-items')}
            >
              Report Lost Item
            </Button>
          </div>

          <img
            className="w-full max-w-md rounded-3xl shadow-lg"
            alt="Lost and found illustration"
            src="https://c.animaapp.com/mg7at5dvnSTE4c/img/chatgpt-image-sep-29--2025-at-03-01-33-pm-1.png"
          />
        </div>
      </section>

      <section className="flex flex-col items-center bg-[#f1fff5] py-24 px-10">
        <div className="max-w-5xl text-center space-y-6">
          <span className="text-[#2d4f20] uppercase tracking-wide text-sm">Services</span>
          <h2 className="text-4xl font-bold text-[#2d4f20]">
            We provide a simple platform to report lost and found items, search and claim belongings, connect securely with finders
            or owners and track the status of your items until they are safely returned.
          </h2>
          <p className="text-lg text-[#2d4f20]/80">Found something? Help it find its way back home.</p>
          <Button
            className="bg-[#2d4f20] hover:bg-[#1f3517] text-white rounded-full px-6 py-3"
            onClick={() => (window.location.href = '/found-items')}
          >
            Report Found Item
          </Button>
        </div>
      </section>

      <section className="flex flex-col items-start gap-10 px-10 pb-24 max-w-6xl mx-auto">
        <header className="flex flex-col lg:flex-row items-start gap-10 w-full">
          <h2 className="flex-1 text-4xl font-bold text-[#2d4f20]">Track it, report it, recover it!</h2>
          <p className="flex-1 text-lg text-[#2d4f20]/80">
            At Back2You, we believe that every lost item deserves a chance to be reunited—whether it is a student's backpack, a
            traveler's passport or a child's favorite toy.
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
          {featureItems.map((feature) => (
            <div key={feature.title} className="border-l-4 border-[#2d4f20] pl-12 py-8 bg-white rounded-2xl shadow-sm">
              <img src={feature.icon} alt="" className="w-10 h-10 mb-6" />
              <h3 className="text-2xl font-semibold text-[#2d4f20] mb-4">{feature.title}</h3>
              <p className="text-[#2d4f20]/80 text-base leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      <footer className="bg-[#2d4f20] text-white px-10 py-10">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-start justify-between gap-8">
          <div>
            <h3 className="font-bold text-3xl">Back2You</h3>
            <p className="text-white/80 text-sm mt-2 max-w-sm">Helping lost things find their way home.</p>
          </div>

          <div className="text-right space-y-4">
            <h4 className="text-lg font-semibold">Need Help?</h4>
            <div className="space-y-2">
              <div>
                <span className="text-xs uppercase tracking-wide text-white/60">Phone</span>
                <a href="tel:+61000000000" className="block text-base text-white hover:text-white/80">
                  +61 000 0000 0000
                </a>
              </div>
              <div>
                <span className="text-xs uppercase tracking-wide text-white/60">Email</span>
                <a href="mailto:help@back2you.com" className="block text-base text-white hover:text-white/80">
                  help@back2you.com
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-white/20 mt-8 pt-6 text-center text-sm text-white/70">
          © 2024 Back2You. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default Home;