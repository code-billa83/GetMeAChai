import React from "react";
import Link from "next/link";

export const metadata = {
  title: "About Us - Get Me A Chai",
  description: "Learn how Get Me A Chai helps creators and fans connect through micro-donations in India.",
};

const About = () => {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-14 space-y-16">
      {/* Hero Header */}
      <div className="text-center max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-semibold mb-4">
          <span>☕</span>
          <span>Our Mission</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight mb-6">
          Fueling the Creative Economy, <br />
          <span className="text-gradient">One Cup at a Time.</span>
        </h1>
        <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
          Get Me A Chai is a creator-first crowdfunding platform designed for Indian artists, open source programmers, writers, and educators. We believe great work deserves direct community support without hefty platform deductions or international currency friction.
        </p>
      </div>

      {/* How it Works Grid */}
      <div className="glass-panel rounded-3xl p-6 sm:p-10 border border-slate-800">
        <h2 className="text-2xl font-bold text-white mb-6 text-center sm:text-left">How It Works</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
          <div className="flex items-start gap-4 p-4 rounded-2xl bg-slate-900/50 border border-slate-800/80">
            <div className="size-16 rounded-2xl bg-slate-800 flex items-center justify-center shrink-0 p-2 border border-slate-700">
              <img className="size-10 object-contain" src="/group.gif" alt="Fans Want to Collaborate" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white mb-1">Fan-First Engagement</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Fans love connecting directly with their favorite creators and seeing their names on the Supporter Leaderboard.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4 p-4 rounded-2xl bg-slate-900/50 border border-slate-800/80">
            <div className="size-16 rounded-2xl bg-slate-800 flex items-center justify-center shrink-0 p-2 border border-slate-700">
              <img className="size-10 object-contain" src="/coin.gif" alt="Support Through Chai" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white mb-1">Seamless Micro-Donations</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Supporters purchase one or more cups of chai using familiar Indian payment rails like UPI and domestic debit cards.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Benefits Side by Side */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="glass-panel rounded-3xl p-8 border border-slate-800">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-xl">🎨</span>
            <h2 className="text-xl font-bold text-white">For Creators</h2>
          </div>
          <ul className="space-y-3 text-xs sm:text-sm text-slate-300">
            <li className="flex items-start gap-2">
              <span className="text-amber-400">✓</span>
              <span>100% direct fan-to-creator funding model.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-amber-400">✓</span>
              <span>Integrate your own Razorpay credentials for automated payouts.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-amber-400">✓</span>
              <span>Custom profile handle with public leaderboard and personal feed.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-amber-400">✓</span>
              <span>No mandatory subscriptions — fans can donate whenever they wish.</span>
            </li>
          </ul>
        </div>

        <div className="glass-panel rounded-3xl p-8 border border-slate-800">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-xl">❤️</span>
            <h2 className="text-xl font-bold text-white">For Supporters</h2>
          </div>
          <ul className="space-y-3 text-xs sm:text-sm text-slate-300">
            <li className="flex items-start gap-2">
              <span className="text-amber-400">✓</span>
              <span>No signup or login required to buy a chai.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-amber-400">✓</span>
              <span>Instant UPI payment via Google Pay, PhonePe, and Paytm.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-amber-400">✓</span>
              <span>Leave personal encouraging messages directly on the creator&apos;s wall.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-amber-400">✓</span>
              <span>Know 100% of your appreciation goes directly to the creator.</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Tech Stack Ribbon */}
      <div className="p-8 rounded-3xl bg-slate-900/60 border border-slate-800 text-center space-y-4">
        <h3 className="text-lg font-bold text-white">Built with Modern Web Technologies</h3>
        <p className="text-xs text-slate-400 max-w-xl mx-auto">
          Built with Next.js 16 App Router, React 19, Tailwind CSS v4, NextAuth.js, Razorpay Checkout SDK, and Mongoose for optimal speed and rock-solid reliability.
        </p>
        <div className="pt-2 flex flex-wrap justify-center gap-3 text-xs text-slate-400 font-mono">
          <span className="px-3 py-1 rounded-lg bg-slate-800 border border-slate-700">Next.js 16</span>
          <span className="px-3 py-1 rounded-lg bg-slate-800 border border-slate-700">React 19</span>
          <span className="px-3 py-1 rounded-lg bg-slate-800 border border-slate-700">Tailwind CSS 4</span>
          <span className="px-3 py-1 rounded-lg bg-slate-800 border border-slate-700">Razorpay API</span>
          <span className="px-3 py-1 rounded-lg bg-slate-800 border border-slate-700">NextAuth</span>
          <span className="px-3 py-1 rounded-lg bg-slate-800 border border-slate-700">MongoDB</span>
        </div>
      </div>

      {/* Bottom CTA */}
      <div className="text-center pt-4">
        <Link
          href="/login"
          className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-black font-extrabold rounded-2xl transition shadow-xl shadow-amber-500/25"
        >
          <span>Start Your Page in 60 Seconds</span>
          <span>→</span>
        </Link>
      </div>
    </div>
  );
};

export default About;