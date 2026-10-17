"use client";

import React, { useState, useEffect, useRef } from "react";
import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const Navbar = () => {
  const { data: session } = useSession();
  const [showDropdown, setShowDropdown] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const dropdownRef = useRef(null);
  const pathname = usePathname();

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Close menus on route change
  useEffect(() => {
    setShowDropdown(false);
    setMobileMenuOpen(false);
  }, [pathname]);

  const activeUsername = session?.user?.name || "shiva";

  return (
    <nav className="sticky top-0 z-40 w-full backdrop-blur-md bg-slate-950/80 border-b border-slate-800/80 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo & Brand */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative size-10 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 p-0.5 shadow-md shadow-amber-500/20 group-hover:shadow-amber-500/40 transition">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center overflow-hidden">
                <img src="/tea.gif" alt="Chai" className="size-7 object-contain group-hover:scale-110 transition duration-200" />
              </div>
            </div>
            <div>
              <span className="font-extrabold text-lg sm:text-xl tracking-tight text-white flex items-center gap-1">
                Get Me A <span className="text-gradient">Chai</span>
              </span>
              <span className="hidden sm:block text-[10px] font-semibold text-slate-400 tracking-wider uppercase -mt-1">
                Creator Crowdfunding
              </span>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-7 text-sm font-medium text-slate-300">
            <Link
              href="/"
              className={`hover:text-amber-400 transition ${pathname === "/" ? "text-amber-400 font-semibold" : ""}`}
            >
              Home
            </Link>
            <Link
              href="/shiva"
              className={`hover:text-amber-400 transition ${pathname === "/shiva" ? "text-amber-400 font-semibold" : ""}`}
            >
              Sample Creator
            </Link>
            <Link
              href="/about"
              className={`hover:text-amber-400 transition ${pathname === "/about" ? "text-amber-400 font-semibold" : ""}`}
            >
              About
            </Link>
          </div>

          {/* Right Action Buttons */}
          <div className="hidden md:flex items-center gap-4">
            {session ? (
              <div className="relative" ref={dropdownRef}>
                <button
                  type="button"
                  onClick={() => setShowDropdown(!showDropdown)}
                  className="flex items-center gap-2.5 p-1.5 pr-3 rounded-full bg-slate-900 border border-slate-800 hover:border-slate-700 transition"
                >
                  <div className="size-8 rounded-full bg-amber-500/20 border border-amber-500/40 flex items-center justify-center font-bold text-amber-400 text-xs overflow-hidden">
                    {session.user?.image ? (
                      <img src={session.user.image} alt="Profile" className="w-full h-full object-cover" />
                    ) : (
                      activeUsername.charAt(0).toUpperCase()
                    )}
                  </div>
                  <span className="text-xs font-semibold text-white max-w-[100px] truncate">
                    @{activeUsername}
                  </span>
                  <svg className={`w-3.5 h-3.5 text-slate-400 transition-transform ${showDropdown ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {/* Dropdown Menu */}
                {showDropdown && (
                  <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl py-2 z-50 animate-fade-in divide-y divide-slate-800/80">
                    <div className="px-4 py-2.5">
                      <p className="text-xs text-slate-400">Signed in as</p>
                      <p className="text-sm font-bold text-white truncate">@{activeUsername}</p>
                    </div>

                    <div className="py-1">
                      <Link
                        href={`/${activeUsername}`}
                        className="flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-slate-300 hover:bg-slate-800 hover:text-amber-400 transition"
                      >
                        <span className="text-base">☕</span>
                        <span>My Public Page</span>
                      </Link>
                      <Link
                        href="/dashboard"
                        className="flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-slate-300 hover:bg-slate-800 hover:text-amber-400 transition"
                      >
                        <span className="text-base">⚙️</span>
                        <span>Creator Dashboard</span>
                      </Link>
                    </div>

                    <div className="py-1">
                      <button
                        type="button"
                        onClick={() => signOut({ callbackUrl: "/" })}
                        className="w-full flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-rose-400 hover:bg-rose-500/10 transition text-left"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                        <span>Sign out</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link
                  href="/login"
                  className="px-4 py-2 text-xs font-semibold text-slate-300 hover:text-white transition"
                >
                  Sign in
                </Link>
                <Link
                  href="/login"
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-black text-xs font-bold transition shadow-md shadow-amber-500/20"
                >
                  Start My Page
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Hamburger */}
          <div className="flex md:hidden items-center gap-2">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-white"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {mobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-slate-800 space-y-3">
            <Link href="/" className="block px-3 py-2 rounded-lg text-sm font-medium text-slate-300 hover:bg-slate-900">
              Home
            </Link>
            <Link href="/shiva" className="block px-3 py-2 rounded-lg text-sm font-medium text-slate-300 hover:bg-slate-900">
              Sample Creator (@shiva)
            </Link>
            <Link href="/about" className="block px-3 py-2 rounded-lg text-sm font-medium text-slate-300 hover:bg-slate-900">
              About
            </Link>
            {session ? (
              <>
                <Link href={`/${activeUsername}`} className="block px-3 py-2 rounded-lg text-sm font-medium text-amber-400 hover:bg-slate-900">
                  My Page (@{activeUsername})
                </Link>
                <Link href="/dashboard" className="block px-3 py-2 rounded-lg text-sm font-medium text-slate-300 hover:bg-slate-900">
                  Dashboard
                </Link>
                <button
                  onClick={() => signOut({ callbackUrl: "/" })}
                  className="w-full text-left px-3 py-2 rounded-lg text-sm font-medium text-rose-400 hover:bg-slate-900"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <Link href="/login" className="block w-full text-center px-4 py-2.5 rounded-xl bg-amber-500 text-black font-bold text-sm">
                Sign In / Get Started
              </Link>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;