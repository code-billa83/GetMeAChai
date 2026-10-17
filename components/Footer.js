import React from "react";
import Link from "next/link";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full bg-slate-950 border-t border-slate-900 mt-auto text-slate-400 text-xs sm:text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div className="space-y-3 md:col-span-2">
            <div className="flex items-center gap-2">
              <span className="text-xl">☕</span>
              <span className="font-extrabold text-white text-base">Get Me A Chai</span>
            </div>
            <p className="text-xs text-slate-400 max-w-sm">
              An open-source crowdfunding platform built for developers, artists, and educators to monetize their passion through community micro-donations.
            </p>
            <div className="flex items-center gap-3 pt-2 text-xs text-slate-500">
              <span>⚡ Powered by Next.js & Razorpay</span>
              <span>•</span>
              <span>🔒 256-bit SSL Encrypted</span>
            </div>
          </div>

          <div>
            <p className="font-bold text-white text-xs uppercase tracking-wider mb-3">Quick Navigation</p>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/" className="hover:text-amber-400 transition">Home</Link>
              </li>
              <li>
                <Link href="/shiva" className="hover:text-amber-400 transition">Sample Creator (@shiva)</Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-amber-400 transition">About Get Me A Chai</Link>
              </li>
              <li>
                <Link href="/dashboard" className="hover:text-amber-400 transition">Creator Dashboard</Link>
              </li>
            </ul>
          </div>

          <div>
            <p className="font-bold text-white text-xs uppercase tracking-wider mb-3">Community & Security</p>
            <ul className="space-y-2 text-xs">
              <li className="flex items-center gap-1.5 text-slate-400">
                <span className="size-1.5 rounded-full bg-emerald-400" />
                <span>Razorpay Gateway: Online</span>
              </li>
              <li className="flex items-center gap-1.5 text-slate-400">
                <span className="size-1.5 rounded-full bg-emerald-400" />
                <span>UPI & Card Payments Active</span>
              </li>
              <li>
                <span className="text-slate-500">Built for creator freedom</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-6 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {currentYear} Get Me A Chai. Crafted with ☕ for creators worldwide.</p>
          <div className="flex items-center gap-4">
            <Link href="/about" className="hover:text-slate-300 transition">Terms</Link>
            <Link href="/about" className="hover:text-slate-300 transition">Privacy</Link>
            <Link href="/shiva" className="text-amber-400/80 hover:text-amber-400 font-medium transition">Donate a Chai</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;