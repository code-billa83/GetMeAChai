"use client";

import React, { useEffect, useState, useCallback } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { fetchuser, updateProfile } from "@/actions/useractions";
import { ToastContainer, toast, Bounce } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Dashboard = () => {
  const { data: session, status, update } = useSession();
  const router = useRouter();

  const [form, setForm] = useState({
    name: "",
    email: "",
    username: "",
    profilepic: "",
    coverpic: "",
    razorpayid: "",
    razorpaysecret: "",
  });

  const [isLoadingData, setIsLoadingData] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [showSecret, setShowSecret] = useState(false);

  const loadCreatorData = useCallback(async (currentUsername) => {
    setIsLoadingData(true);
    try {
      const u = await fetchuser(currentUsername);
      if (u) {
        setForm({
          name: u.name || "",
          email: u.email || session?.user?.email || "",
          username: u.username || currentUsername,
          profilepic: u.profilepic || "",
          coverpic: u.coverpic || "",
          razorpayid: u.razorpayid || "",
          razorpaysecret: u.razorpaysecret || "",
        });
      } else {
        setForm((prev) => ({
          ...prev,
          name: session?.user?.name || currentUsername,
          email: session?.user?.email || "",
          username: currentUsername,
        }));
      }
    } catch (err) {
      console.error("Error loading dashboard data:", err);
      toast.error("Failed to load user profile data.");
    } finally {
      setIsLoadingData(false);
    }
  }, [session]);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    } else if (status === "authenticated" && session?.user) {
      const initialUsername = session.user.name || session.user.email?.split("@")[0] || "shiva";
      loadCreatorData(initialUsername);
    }
  }, [status, session, router, loadCreatorData]);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      const currentActiveUsername = session?.user?.name || form.username;
      const res = await updateProfile(form, currentActiveUsername);

      if (res.success) {
        toast.success("Profile & Payment settings saved successfully! ☕🎉", {
          position: "top-right",
          autoClose: 4000,
          theme: "dark",
          transition: Bounce,
        });

        if (res.username && res.username !== currentActiveUsername) {
          await update({ name: res.username });
        }
      } else {
        toast.error(res.error || "Could not update profile.", { theme: "dark" });
      }
    } catch (err) {
      console.error("Profile save error:", err);
      toast.error(err.message || "An unexpected error occurred while saving.", { theme: "dark" });
    } finally {
      setIsSaving(false);
    }
  };

  const copyPageLink = () => {
    if (typeof window !== "undefined" && form.username) {
      const url = `${window.location.origin}/${form.username}`;
      navigator.clipboard.writeText(url);
      toast.info("Your creator link copied to clipboard! 📋", { autoClose: 2000, theme: "dark" });
    }
  };

  if (status === "loading" || (status === "authenticated" && isLoadingData)) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center text-center p-6">
        <div className="size-14 rounded-full border-4 border-amber-500 border-t-transparent animate-spin mb-4" />
        <p className="text-slate-400 font-medium">Loading your creator dashboard...</p>
      </div>
    );
  }

  return (
    <>
      <ToastContainer position="top-right" autoClose={4000} theme="dark" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
        {/* Header Ribbon */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 pb-6 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-2xl">⚡</span>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white">Creator Dashboard</h1>
            </div>
            <p className="text-slate-400 text-sm mt-1">
              Manage your public profile, customize your chai page, and configure Razorpay credentials.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={copyPageLink}
              className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl text-slate-200 text-sm font-semibold transition flex items-center gap-2"
            >
              <svg className="w-4 h-4 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
              </svg>
              Copy Page Link
            </button>
            <Link
              href={`/${form.username || "shiva"}`}
              target="_blank"
              className="px-4 py-2.5 bg-amber-500 hover:bg-amber-600 text-black font-bold rounded-xl text-sm transition flex items-center gap-1.5 shadow-lg shadow-amber-500/20"
            >
              <span>View Live Page</span>
              <span>↗</span>
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Main Form (8 Columns) */}
          <div className="lg:col-span-8 glass-panel rounded-2xl border border-slate-800/80 p-6 sm:p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Section 1: Basic Identity */}
              <div>
                <h2 className="text-base font-bold text-white uppercase tracking-wider text-amber-400 flex items-center gap-2 mb-4">
                  <span>1.</span> Profile Identity
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      Display Name <span className="text-amber-500">*</span>
                    </label>
                    <input
                      required
                      type="text"
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                      placeholder="e.g. Shiva Mishra"
                      className="w-full px-4 py-2.5 bg-slate-900 border border-slate-800 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 rounded-xl text-white text-sm outline-none transition"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      Username / Handle <span className="text-amber-500">*</span>
                    </label>
                    <div className="relative">
                      <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 text-xs">@</span>
                      <input
                        required
                        type="text"
                        name="username"
                        value={form.username}
                        onChange={handleChange}
                        placeholder="shiva"
                        className="w-full pl-8 pr-4 py-2.5 bg-slate-900 border border-slate-800 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 rounded-xl text-white text-sm outline-none transition"
                      />
                    </div>
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      Email Address
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={form.email}
                      onChange={handleChange}
                      placeholder="creator@example.com"
                      className="w-full px-4 py-2.5 bg-slate-900/60 border border-slate-800 text-slate-400 rounded-xl text-sm outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Section 2: Visual Assets */}
              <div className="border-t border-slate-800/80 pt-6">
                <h2 className="text-base font-bold text-white uppercase tracking-wider text-amber-400 flex items-center gap-2 mb-4">
                  <span>2.</span> Visual Branding
                </h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      Avatar Picture URL
                    </label>
                    <input
                      type="text"
                      name="profilepic"
                      value={form.profilepic}
                      onChange={handleChange}
                      placeholder="https://images.unsplash.com/... or /avatar.gif"
                      className="w-full px-4 py-2.5 bg-slate-900 border border-slate-800 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 rounded-xl text-white text-sm outline-none transition"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      Cover Banner URL
                    </label>
                    <input
                      type="text"
                      name="coverpic"
                      value={form.coverpic}
                      onChange={handleChange}
                      placeholder="https://images.unsplash.com/... (Recommended: 1200x400)"
                      className="w-full px-4 py-2.5 bg-slate-900 border border-slate-800 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 rounded-xl text-white text-sm outline-none transition"
                    />
                  </div>
                </div>
              </div>

              {/* Section 3: Razorpay Credentials */}
              <div className="border-t border-slate-800/80 pt-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-base font-bold text-white uppercase tracking-wider text-amber-400 flex items-center gap-2">
                    <span>3.</span> Razorpay Payment Gateway Keys
                  </h2>
                  <span className="text-[11px] bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 px-2.5 py-0.5 rounded-full font-semibold">
                    Test Mode Active
                  </span>
                </div>
                <p className="text-xs text-slate-400 mb-4">
                  Your payments will be routed directly to this Razorpay account. Leave blank to inherit the platform default test credentials.
                </p>

                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      Razorpay Key ID
                    </label>
                    <input
                      type="text"
                      name="razorpayid"
                      value={form.razorpayid}
                      onChange={handleChange}
                      placeholder="rzp_test_..."
                      className="w-full px-4 py-2.5 bg-slate-900 border border-slate-800 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 rounded-xl text-white text-sm outline-none transition font-mono"
                    />
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="block text-xs font-semibold text-slate-300">
                        Razorpay Key Secret
                      </label>
                      <button
                        type="button"
                        onClick={() => setShowSecret(!showSecret)}
                        className="text-xs text-amber-400 hover:text-amber-300"
                      >
                        {showSecret ? "Hide Secret" : "Show Secret"}
                      </button>
                    </div>
                    <input
                      type={showSecret ? "text" : "password"}
                      name="razorpaysecret"
                      value={form.razorpaysecret}
                      onChange={handleChange}
                      placeholder="••••••••••••••••••••••••"
                      className="w-full px-4 py-2.5 bg-slate-900 border border-slate-800 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 rounded-xl text-white text-sm outline-none transition font-mono"
                    />
                  </div>
                </div>
              </div>

              {/* Submit CTA */}
              <div className="border-t border-slate-800/80 pt-6">
                <button
                  type="submit"
                  disabled={isSaving}
                  className="w-full py-3.5 px-6 bg-gradient-to-r from-amber-500 via-orange-500 to-amber-500 hover:from-amber-600 hover:to-orange-600 text-black font-extrabold rounded-xl transition duration-300 shadow-xl shadow-amber-500/20 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {isSaving ? (
                    <>
                      <div className="size-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                      <span>Saving Changes...</span>
                    </>
                  ) : (
                    <span>Save Profile & Credentials</span>
                  )}
                </button>
              </div>
            </form>
          </div>

          {/* Live Preview Card (4 Columns) */}
          <div className="lg:col-span-4 sticky top-24 space-y-6">
            <div className="glass-panel rounded-2xl border border-slate-800/80 overflow-hidden shadow-2xl">
              <div className="p-4 border-b border-slate-800 flex items-center justify-between">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Live Page Preview</span>
                <span className="size-2 rounded-full bg-emerald-500 animate-pulse" />
              </div>

              <div className="relative h-28 bg-slate-800 overflow-hidden">
                <img
                  className="w-full h-full object-cover"
                  src={form.coverpic || "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=600&q=80"}
                  alt="Cover Preview"
                  onError={(e) => {
                    e.currentTarget.src = "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=600&q=80";
                  }}
                />
              </div>

              <div className="p-5 pt-0 relative">
                <div className="size-20 rounded-full border-4 border-slate-900 bg-slate-800 overflow-hidden shadow-lg -mt-10 mb-3 ring-2 ring-amber-500/30">
                  <img
                    className="w-full h-full object-cover"
                    src={form.profilepic || "/avatar.gif"}
                    alt="Avatar Preview"
                    onError={(e) => {
                      e.currentTarget.src = "/avatar.gif";
                    }}
                  />
                </div>

                <h3 className="font-bold text-white text-lg truncate">{form.name || "Your Name"}</h3>
                <p className="text-xs text-amber-400 font-semibold mb-2">@{form.username || "username"}</p>
                <p className="text-xs text-slate-400 line-clamp-2">
                  Creating open-source tools and tutorials. Buy me a chai to support my work!
                </p>

                <div className="mt-4 pt-4 border-t border-slate-800 flex justify-between text-xs text-slate-400">
                  <span>Chai Price</span>
                  <span className="text-amber-400 font-bold">₹10 / Chai</span>
                </div>
              </div>
            </div>

            {/* Quick Tips Box */}
            <div className="p-5 rounded-2xl bg-slate-900/40 border border-slate-800/60 text-xs text-slate-400 space-y-2">
              <p className="font-semibold text-slate-300">💡 Pro Tip:</p>
              <p>
                Share your personalized link <span className="text-amber-400 font-mono">/{form.username}</span> in your YouTube descriptions, GitHub README, and Twitter bio to receive chais from fans.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;