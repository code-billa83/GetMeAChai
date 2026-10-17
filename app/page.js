"use client";

import React, { useState } from "react";
import Link from "next/link";

const FEATURED_CREATORS = [
  {
    name: "Shiva Mishra",
    username: "shiva",
    role: "Fullstack Engineer & Content Creator",
    chais: 142,
    avatar: "never.jpeg",
    cover: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=600&q=80",
  },
  {
    name: "Aman Sharma",
    username: "aman",
    role: "Open Source Contributor & YouTuber",
    chais: 89,
    avatar: "/avatar.gif",
    cover: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=600&q=80",
  },
  {
    name: "Priya Patel",
    username: "priya",
    role: "UI/UX Designer & Tech Writer",
    chais: 215,
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=300&q=80",
    cover: "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=600&q=80",
  },
];

const FAQS = [
  {
    q: "What is Get Me A Chai?",
    a: "Get Me A Chai is an Indian-tailored creator crowdfunding platform that allows your fans, audience, and community to support your work with micro-donations in the form of a 'cup of chai' (₹10, ₹20, ₹50, etc.).",
  },
  {
    q: "How does the payment gateway work?",
    a: "We integrate directly with Razorpay. Supporters can pay using UPI (Google Pay, PhonePe, Paytm), Credit/Debit Cards, and NetBanking. Funds are routed directly to the creator's configured Razorpay account.",
  },
  {
    q: "Do supporters need to register an account to donate?",
    a: "No! Supporters do not need an account. They can simply visit your link, select their preferred number of chais, leave an encouraging message, and pay within seconds.",
  },
  {
    q: "Can I use my own Razorpay API keys?",
    a: "Yes! In your creator dashboard, you can supply your own Razorpay Key ID and Secret so that all incoming payments flow straight into your business account.",
  },
];

export default function Home() {
  const [calculatorFans, setCalculatorFans] = useState(150);
  const [chaiPrice, setChaiPrice] = useState(50);
  const [openFaq, setOpenFaq] = useState(null);

  const estimatedEarnings = calculatorFans * chaiPrice;

  return (
    <div className="space-y-24 pb-20 overflow-hidden">
      {/* 1. Hero Section */}
      <section className="relative pt-12 sm:pt-20 text-center max-w-5xl mx-auto px-4 sm:px-6">
        {/* Glowing badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs sm:text-sm font-semibold mb-6 animate-pulse">
          <span>☕</span>
          <span>The #1 Creator Crowdfunding Platform</span>
        </div>

        <h1 className="text-4xl sm:text-6xl md:text-7xl font-black text-white tracking-tight leading-[1.1] mb-6">
          Fund Your Creative Passion, <br className="hidden sm:block" />
          <span className="text-gradient">One Chai at a Time.</span>
        </h1>

        <p className="max-w-2xl mx-auto text-base sm:text-xl text-slate-300 leading-relaxed mb-10">
          Empower your audience to support your coding tutorials, open source projects, and art. Zero hassle, instant UPI & Card payments powered by Razorpay.
        </p>

        {/* Dual Primary CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
          <Link
            href="/login"
            className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-amber-500 via-orange-500 to-amber-500 hover:from-amber-600 hover:to-orange-600 text-black font-extrabold rounded-2xl transition duration-300 shadow-xl shadow-amber-500/25 flex items-center justify-center gap-2 text-base"
          >
            <span>Start My Creator Page</span>
            <span>→</span>
          </Link>
          <Link
            href="/shiva"
            className="w-full sm:w-auto px-8 py-4 bg-slate-900/90 hover:bg-slate-800 border border-slate-700/80 hover:border-slate-600 text-slate-200 font-bold rounded-2xl transition duration-300 flex items-center justify-center gap-2 text-base"
          >
            <span>See Sample Page (@shiva)</span>
            <span>☕</span>
          </Link>
        </div>

        {/* Trust Stats Ribbon */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-6 glass-panel rounded-3xl border border-slate-800 text-center">
          <div>
            <p className="text-2xl sm:text-3xl font-black text-amber-400">₹18.5L+</p>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">Total Chai Funded</p>
          </div>
          <div>
            <p className="text-2xl sm:text-3xl font-black text-white">4,200+</p>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">Active Creators</p>
          </div>
          <div>
            <p className="text-2xl sm:text-3xl font-black text-orange-400">68,000+</p>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">Cups of Chai</p>
          </div>
          <div>
            <p className="text-2xl sm:text-3xl font-black text-emerald-400">99.9%</p>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">Payment Success</p>
          </div>
        </div>
      </section>

      {/* 2. Interactive Earnings Calculator */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="glass-panel border border-amber-500/30 rounded-3xl p-6 sm:p-10 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="text-center max-w-xl mx-auto mb-8">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white mb-2">
              Calculate Your Potential Chai Income 💰
            </h2>
            <p className="text-slate-400 text-xs sm:text-sm">
              See how much you could earn every month if your supporters buy you a cup of chai.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div className="space-y-6">
              <div>
                <div className="flex justify-between text-sm font-semibold mb-2">
                  <span className="text-slate-300">Monthly Supporters</span>
                  <span className="text-amber-400 font-bold">{calculatorFans} Supporters</span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="1000"
                  step="10"
                  value={calculatorFans}
                  onChange={(e) => setCalculatorFans(Number(e.target.value))}
                  className="w-full accent-amber-500 cursor-pointer h-2 bg-slate-800 rounded-lg"
                />
              </div>

              <div>
                <div className="flex justify-between text-sm font-semibold mb-2">
                  <span className="text-slate-300">Average Chai Support</span>
                  <span className="text-amber-400 font-bold">₹{chaiPrice} / Supporter</span>
                </div>
                <div className="flex gap-2">
                  {[20, 50, 100, 200].map((amt) => (
                    <button
                      key={amt}
                      type="button"
                      onClick={() => setChaiPrice(amt)}
                      className={`flex-1 py-2 rounded-xl text-xs font-bold border transition ${
                        chaiPrice === amt
                          ? "bg-amber-500 text-black border-amber-400"
                          : "bg-slate-900 text-slate-300 border-slate-800 hover:border-slate-700"
                      }`}
                    >
                      ₹{amt}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="bg-slate-950/80 rounded-2xl p-6 border border-slate-800 text-center">
              <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold">You Could Make Approx</p>
              <p className="text-4xl sm:text-5xl font-black text-amber-400 my-2">
                ₹{estimatedEarnings.toLocaleString("en-IN")}
              </p>
              <p className="text-xs text-slate-400 mb-5">every single month directly from your fans!</p>
              <Link
                href="/login"
                className="inline-block w-full py-3 bg-amber-500 hover:bg-amber-600 text-black font-extrabold rounded-xl text-sm transition shadow-lg shadow-amber-500/20"
              >
                Claim My Chai Link Now
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Value Proposition Cards (With Original Asset GIFs) */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-xl mx-auto mb-12">
          <h2 className="text-3xl font-extrabold text-white mb-3">Why Creators Choose Get Me A Chai</h2>
          <p className="text-slate-400 text-sm">
            Everything you need to turn your passion into a sustainable creative career.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="glass-panel glass-panel-hover rounded-3xl p-8 border border-slate-800/80 text-center">
            <div className="size-20 mx-auto mb-6 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center p-2">
              <img src="/man.gif" alt="Fans Want to Help" className="size-14 object-contain" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Fans Want to Support</h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              Your community loves what you build. Give them a frictionless, instant way to show their appreciation with a cup of chai.
            </p>
          </div>

          <div className="glass-panel glass-panel-hover rounded-3xl p-8 border border-slate-800/80 text-center">
            <div className="size-20 mx-auto mb-6 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center p-2">
              <img src="/coin.gif" alt="Direct Payments" className="size-14 object-contain" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Instant Razorpay UPI</h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              No foreign currency conversion cuts. Supporters pay directly via UPI, GPay, PhonePe, and domestic cards in Indian Rupees.
            </p>
          </div>

          <div className="glass-panel glass-panel-hover rounded-3xl p-8 border border-slate-800/80 text-center">
            <div className="size-20 mx-auto mb-6 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center p-2">
              <img src="/group.gif" alt="Community Growth" className="size-14 object-contain" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Engaged Supporter Feed</h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              Honor your biggest backers on your dedicated public supporter wall. Celebrate top leaders and build genuine relationships.
            </p>
          </div>
        </div>
      </section>

      {/* 4. Featured Creators Showcase */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-10">
          <div>
            <h2 className="text-3xl font-extrabold text-white">Featured Creators</h2>
            <p className="text-slate-400 text-sm mt-1">Discover inspiring creators funded by their passionate community.</p>
          </div>
          <Link
            href="/shiva"
            className="text-amber-400 hover:text-amber-300 text-sm font-semibold flex items-center gap-1"
          >
            <span>Explore Shiva&apos;s Page</span>
            <span>→</span>
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {FEATURED_CREATORS.map((creator) => (
            <div
              key={creator.username}
              className="glass-panel glass-panel-hover rounded-3xl border border-slate-800/80 overflow-hidden shadow-xl"
            >
              <div className="h-28 overflow-hidden relative">
                <img src={creator.cover} alt="Cover" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent" />
              </div>
              <div className="p-6 pt-0 relative">
                <div className="size-16 rounded-full border-4 border-slate-950 bg-slate-800 overflow-hidden shadow-lg -mt-8 mb-3 ring-2 ring-amber-500/30">
                  <img src={creator.avatar} alt={creator.name} className="w-full h-full object-cover" />
                </div>
                <h3 className="font-bold text-white text-lg">{creator.name}</h3>
                <p className="text-xs text-amber-400 font-semibold mb-2">@{creator.username}</p>
                <p className="text-xs text-slate-400 mb-4">{creator.role}</p>

                <div className="flex items-center justify-between pt-4 border-t border-slate-800">
                  <span className="text-xs text-slate-400">☕ {creator.chais} Chais Received</span>
                  <Link
                    href={`/${creator.username}`}
                    className="px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-black text-xs font-bold rounded-xl transition"
                  >
                    Support →
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 5. How It Works (3 Steps) */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 text-center">
        <h2 className="text-3xl font-extrabold text-white mb-3">How It Works in 3 Simple Steps</h2>
        <p className="text-slate-400 text-sm max-w-lg mx-auto mb-12">
          From signup to receiving your very first chai in under 2 minutes.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800/80 relative">
            <span className="text-4xl font-black text-amber-500/20 absolute top-4 right-4">01</span>
            <div className="size-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-lg mb-4">
              📝
            </div>
            <h3 className="text-base font-bold text-white mb-2">Claim Your Page</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Create your account in 30 seconds and grab your personalized link at getmeachai.com/@yourname.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800/80 relative">
            <span className="text-4xl font-black text-amber-500/20 absolute top-4 right-4">02</span>
            <div className="size-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-lg mb-4">
              🔗
            </div>
            <h3 className="text-base font-bold text-white mb-2">Share With Fans</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Drop your chai link in your YouTube video descriptions, GitHub repositories, and social bios.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800/80 relative">
            <span className="text-4xl font-black text-amber-500/20 absolute top-4 right-4">03</span>
            <div className="size-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-lg mb-4">
              ☕
            </div>
            <h3 className="text-base font-bold text-white mb-2">Receive Payments</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Fans pay instantly through UPI and cards. Funds are credited directly via Razorpay without hidden cuts.
            </p>
          </div>
        </div>
      </section>

      {/* 6. FAQ Accordion */}
      <section className="max-w-3xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-extrabold text-white mb-2">Frequently Asked Questions</h2>
          <p className="text-slate-400 text-sm">Got questions? We&apos;ve got answers.</p>
        </div>

        <div className="space-y-3">
          {FAQS.map((faq, idx) => {
            const isOpen = openFaq === idx;
            return (
              <div
                key={idx}
                className="rounded-2xl bg-slate-900/70 border border-slate-800/80 overflow-hidden transition"
              >
                <button
                  type="button"
                  onClick={() => setOpenFaq(isOpen ? null : idx)}
                  className="w-full p-5 text-left flex items-center justify-between gap-4 font-semibold text-white text-sm hover:text-amber-400 transition"
                >
                  <span>{faq.q}</span>
                  <span className="text-amber-400 text-base">{isOpen ? "−" : "+"}</span>
                </button>
                {isOpen && (
                  <div className="px-5 pb-5 text-xs sm:text-sm text-slate-400 border-t border-slate-800/60 pt-3 leading-relaxed">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* 7. Bottom Final CTA */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="glass-panel border border-amber-500/40 rounded-3xl p-8 sm:p-14 text-center relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-400 via-orange-500 to-amber-400" />
          <span className="text-4xl mb-4 inline-block">☕✨</span>
          <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight mb-4">
            Ready to Start Getting Funded?
          </h2>
          <p className="max-w-xl mx-auto text-slate-300 text-sm sm:text-base mb-8">
            Join thousands of independent creators and let your biggest supporters buy you a cup of chai today.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/login"
              className="w-full sm:w-auto px-8 py-3.5 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-black font-extrabold rounded-xl transition shadow-lg shadow-amber-500/25"
            >
              Claim My Free Page →
            </Link>
            <Link
              href="/shiva"
              className="w-full sm:w-auto px-8 py-3.5 bg-slate-900 hover:bg-slate-800 text-white font-semibold rounded-xl border border-slate-800 transition"
            >
              Test Donation on @shiva
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}