"use client";

/**
 * ============================================================================
 * 🚀 REFACTORED & FIXED BY: Rudra (Senior Full-Stack Developer)
 * ----------------------------------------------------------------------------
 * CRITICAL RAZORPAY BUGS FIXED:
 * 1. FIXED SCRIPT URL: Changed from invalid "https://razorpay.com" (HTML page)
 *    to official Checkout SDK "https://checkout.razorpay.com/v1/checkout.js".
 * 2. PREVENTED 405 METHOD NOT ALLOWED: Integrated direct client `handler`
 *    verification + status 303 HTTP redirect.
 * 3. ADDED MODERN UX: Preset Chai Chips (₹10, ₹20, ₹50, ₹100, ₹500),
 *    Quick message suggestions, Celebration modal on payment success,
 *    and real-time Supporter Leaderboard with zero page reload.
 * ============================================================================
 */
import { fetchuser, fetchpayments, initiate } from "@/actions/useractions";
import { useSearchParams } from "next/navigation";
import { ToastContainer, toast, Bounce } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
// import { useState } from 'react';
import { useState, useCallback, useEffect } from 'react';

const PRESET_AMOUNTS = [
  { chais: 1, amount: 10, label: "1 Chai" },
  { chais: 2, amount: 20, label: "2 Chais" },
  { chais: 5, amount: 50, label: "5 Chais", popular: true },
  { chais: 10, amount: 100, label: "10 Chais" },
  { chais: 50, amount: 500, label: "Super Chai" },
];

const QUICK_MESSAGES = [
  "Keep brewing awesome work! ☕",
  "Huge fan of your content! ❤️",
  "Tea is on me today! 🚀",
  "Thanks for the inspiration! 💡",
];

const PaymentPage = ({ username, initialUser }) => {
  const [currentUser, setCurrentUser] = useState(initialUser || null);
  const [payments, setPayments] = useState([]);
  const [activeTab, setActiveTab] = useState("recent"); // "recent" | "top"
  const [isProcessing, setIsProcessing] = useState(false);
  const [sdkReady, setSdkReady] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [lastPayment, setLastPayment] = useState(null);

  const [paymentform, setPaymentform] = useState({
    name: "",
    message: "",
    amount: "50",
  });

  const searchParams = useSearchParams();

  // 1. Production-grade Razorpay Checkout SDK loader
  const loadRazorpay = useCallback(() => {
    return new Promise((resolve) => {
      if (typeof window !== "undefined" && window.Razorpay) {
        setSdkReady(true);
        return resolve(true);
      }
      const existing = document.getElementById("razorpay-sdk-script");
      if (existing) {
        existing.addEventListener("load", () => {
          setSdkReady(true);
          resolve(true);
        });
        existing.addEventListener("error", () => resolve(false));
        return;
      }
      const script = document.createElement("script");
      script.id = "razorpay-sdk-script";
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.async = true;
      script.onload = () => {
        setSdkReady(true);
        resolve(true);
      };
      script.onerror = () => {
        console.error("Failed to load Razorpay Checkout SDK.");
        resolve(false);
      };
      document.body.appendChild(script);
    });
  }, []);

  useEffect(() => {
    loadRazorpay();
  }, [loadRazorpay]);

  // 2. Fetch Creator and Payments Data
  useEffect(() => {
    let isMounted = true;
    const loadData = async () => {
      try {
        if (!initialUser) {
          const u = await fetchuser(username);
          if (isMounted && u) setCurrentUser(u);
        }
        const dbPayments = await fetchpayments(username);
        if (isMounted && dbPayments) {
          setPayments(dbPayments);
        }
      } catch (err) {
        console.error("Error loading creator data:", err);
      }
    };
    loadData();
    return () => {
      isMounted = false;
    };
  }, [username, initialUser]);

  // 3. Handle query param for redirect completion (?paymentdone=true)
  useEffect(() => {
    if (searchParams?.get("paymentdone") === "true") {
      setShowSuccessModal(true);
      toast.success("Thank you for your generous chai donation! ☕🎉", {
        position: "top-right",
        autoClose: 5000,
        theme: "dark",
        transition: Bounce,
      });

      if (typeof window !== "undefined") {
        const cleanUrl = window.location.pathname;
        window.history.replaceState({ ...window.history.state }, "", cleanUrl);
      }
    }
  }, [searchParams]);

  const handleChange = (e) => {
    setPaymentform((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSelectAmount = (amt) => {
    setPaymentform((prev) => ({ ...prev, amount: amt.toString() }));
  };

  const handleSelectMessage = (msg) => {
    setPaymentform((prev) => ({ ...prev, message: msg }));
  };

  const copyProfileLink = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      toast.info("Profile link copied to clipboard! 📋", { autoClose: 2000, theme: "dark" });
    }
  };

  // 4. Main Payment Trigger
  const pay = async (amountInRupees) => {
    const numericAmount = Number(amountInRupees || paymentform.amount);

    if (isNaN(numericAmount) || numericAmount < 1) {
      toast.warning("Please enter a valid amount (minimum ₹1)");
      return;
    }

    setIsProcessing(true);

    try {
      // Ensure SDK is fully ready
      const ready = await loadRazorpay();
      if (!ready || typeof window === "undefined" || !window.Razorpay) {
        toast.error("Razorpay SDK is initializing. Please retry in 2 seconds.");
        setIsProcessing(false);
        return;
      }

      // 1. Create Order via Server Action
      const amountInPaise = Math.round(numericAmount * 100);
      const order = await initiate(amountInPaise, username, paymentform);

      if (!order || !order.id) {
        throw new Error("Could not initialize Razorpay order.");
      }

      const activeKey = order.key || process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;

      // 2. Configure Razorpay Options
      const options = {
        key: activeKey,
        amount: order.amount,
        currency: "INR",
        name: "Get Me A Chai",
        description: `Support @${username} with Chai`,
        image: "/tea.gif",
        order_id: order.id,
        // Absolute callback url as fallback for standard redirect
        callback_url: `${window.location.origin}/api/razorpay`,
        prefill: {
          name: paymentform.name || "Generous Supporter",
          email: "",
          contact: "",
        },
        notes: {
          recipient: username,
          donor_name: paymentform.name || "Anonymous",
          message: paymentform.message || "Enjoy your chai!",
        },
        theme: {
          color: "#f59e0b", // Warm Chai Amber
        },
        modal: {
          ondismiss: () => {
            setIsProcessing(false);
            toast.info("Payment cancelled.");
          },
        },
        // Seamless in-page verification handler
        handler: async function (response) {
          try {
            setIsProcessing(true);
            const verifyRes = await fetch("/api/razorpay", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              }),
            });

            const result = await verifyRes.json();

            if (result.success) {
              const completedPayment = {
                _id: response.razorpay_payment_id,
                name: paymentform.name || "Generous Supporter",
                amount: numericAmount,
                message: paymentform.message || "Here's a warm chai for you! ☕",
                createdAt: new Date(),
              };

              setLastPayment(completedPayment);
              setPayments((prev) => [completedPayment, ...prev]);
              setShowSuccessModal(true);
              setPaymentform({ name: "", message: "", amount: "50" });
              toast.success("Payment verified! Thank you for the chai! ☕🎉", { theme: "dark" });
            } else {
              toast.error(result.message || "Verification failed.", { theme: "dark" });
            }
          } catch (verErr) {
            console.error("Verification error:", verErr);
            toast.error("Network error during payment verification.", { theme: "dark" });
          } finally {
            setIsProcessing(false);
          }
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.on("payment.failed", function (failResponse) {
        console.error("Payment failed:", failResponse.error);
        toast.error(`Payment failed: ${failResponse.error.description}`);
        setIsProcessing(false);
      });

      rzp.open();
    } catch (error) {
      console.error("Payment initiation error:", error);
      toast.error(error.message || "Failed to initiate payment. Please try again.", { theme: "dark" });
      setIsProcessing(false);
    }
  };

  // Stats calculation
  const totalRaised = payments.reduce((acc, p) => acc + (Number(p.amount) || 0), 0);
  const totalSupporters = payments.length;
  const totalChais = Math.round(totalRaised / 10);

  // Sorting
  const displayedPayments = [...payments].sort((a, b) => {
    if (activeTab === "top") {
      return (Number(b.amount) || 0) - (Number(a.amount) || 0);
    }
    return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
  });

  const selectedAmountNum = Number(paymentform.amount) || 0;
  const chaisCount = Math.max(1, Math.floor(selectedAmountNum / 10));

  return (
    <>
      <ToastContainer position="top-right" autoClose={4000} theme="dark" />

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-slate-900 border border-amber-500/40 rounded-2xl p-6 sm:p-8 max-w-md w-full shadow-2xl text-center relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-400 via-orange-500 to-amber-400" />
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-3xl">
              ☕
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">Chai Received!</h3>
            <p className="text-slate-300 text-sm mb-6">
              Thank you for supporting <span className="font-semibold text-amber-400">@{username}</span>. Your contribution keeps independent creativity alive!
            </p>
            {lastPayment && (
              <div className="bg-slate-800/80 rounded-xl p-4 mb-6 border border-slate-700/60 text-left">
                <div className="flex justify-between items-center text-sm mb-1">
                  <span className="text-slate-400">Amount</span>
                  <span className="text-amber-400 font-bold text-base">₹{lastPayment.amount}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-400">From</span>
                  <span className="text-white font-medium">{lastPayment.name}</span>
                </div>
                {lastPayment.message && (
                  <p className="text-xs text-slate-300 italic mt-2 border-t border-slate-700/60 pt-2">
                    &quot;{lastPayment.message}&quot;
                  </p>
                )}
              </div>
            )}
            <button
              onClick={() => setShowSuccessModal(false)}
              className="w-full py-3 px-4 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-black font-bold rounded-xl transition duration-200 shadow-lg shadow-amber-500/25"
            >
              Awesome, Close!
            </button>
          </div>
        </div>
      )}

      {/* Cover Banner */}
      <div className="w-full relative bg-slate-900">
        <div className="w-full h-52 sm:h-72 md:h-80 overflow-hidden relative">
          <img
            className="w-full h-full object-cover brightness-75"
            src={currentUser?.coverpic || "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=1600&q=80"}
            alt="Cover"
            onError={(e) => {
              e.currentTarget.src = "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=1600&q=80";
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
        </div>

        {/* Avatar & Creator Info Header */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 relative -mt-20 sm:-mt-24 pb-8 flex flex-col md:flex-row items-center md:items-end justify-between gap-6">
          <div className="flex flex-col md:flex-row items-center md:items-end gap-5 text-center md:text-left">
            <div className="relative group">
              <div className="size-32 sm:size-36 rounded-full border-4 border-slate-950 overflow-hidden bg-slate-800 shadow-2xl ring-2 ring-amber-500/40">
                <img
                  className="w-full h-full object-cover"
                  src={currentUser?.profilepic || "/avatar.gif"}
                  alt={currentUser?.name || username}
                  onError={(e) => {
                    e.currentTarget.src = "/avatar.gif";
                  }}
                />
              </div>
              <span className="absolute bottom-2 right-2 size-4 bg-emerald-500 border-2 border-slate-950 rounded-full" title="Active Creator" />
            </div>

            <div className="space-y-1">
              <div className="flex items-center justify-center md:justify-start gap-2">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
                  {currentUser?.name || username}
                </h1>
                <span className="text-amber-400 bg-amber-500/10 border border-amber-500/30 text-xs px-2 py-0.5 rounded-full font-semibold flex items-center gap-1">
                  ✓ Verified Creator
                </span>
              </div>
              <p className="text-slate-400 text-sm">@{username}</p>
              <p className="text-slate-300 text-sm max-w-md pt-1">
                Creating open-source tools, code tutorials, and digital projects. Buy me a chai to support my journey!
              </p>
            </div>
          </div>

          {/* Quick Actions & Link Copy */}
          <div className="flex items-center gap-3">
            <button
              onClick={copyProfileLink}
              className="flex items-center gap-2 px-4 py-2 bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 rounded-xl text-slate-200 text-sm font-medium transition duration-200"
            >
              <svg className="w-4 h-4 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
              </svg>
              Share Page
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 pb-20">
        {/* Creator Stats Cards */}
        <div className="grid grid-cols-3 gap-3 sm:gap-6 mb-8">
          <div className="glass-panel rounded-2xl p-4 sm:p-5 text-center border border-slate-800">
            <p className="text-xs sm:text-sm text-slate-400 font-medium">Total Raised</p>
            <p className="text-xl sm:text-3xl font-extrabold text-amber-400 mt-1">₹{totalRaised.toLocaleString("en-IN")}</p>
          </div>
          <div className="glass-panel rounded-2xl p-4 sm:p-5 text-center border border-slate-800">
            <p className="text-xs sm:text-sm text-slate-400 font-medium">Supporters</p>
            <p className="text-xl sm:text-3xl font-extrabold text-white mt-1">{totalSupporters}</p>
          </div>
          <div className="glass-panel rounded-2xl p-4 sm:p-5 text-center border border-slate-800">
            <p className="text-xs sm:text-sm text-slate-400 font-medium">Chais Received</p>
            <p className="text-xl sm:text-3xl font-extrabold text-orange-400 mt-1">☕ {totalChais}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Supporter Feed & Leaderboard */}
          <div className="lg:col-span-7 glass-panel rounded-2xl border border-slate-800/80 p-5 sm:p-7">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-6">
              <div className="flex items-center gap-2">
                <span className="text-xl">🏆</span>
                <h2 className="text-lg sm:text-xl font-bold text-white">Supporters Wall</h2>
              </div>
              <div className="flex items-center bg-slate-900/90 border border-slate-800 p-1 rounded-xl text-xs font-semibold">
                <button
                  onClick={() => setActiveTab("recent")}
                  className={`px-3 py-1.5 rounded-lg transition ${
                    activeTab === "recent"
                      ? "bg-amber-500 text-black shadow-sm"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  Recent
                </button>
                <button
                  onClick={() => setActiveTab("top")}
                  className={`px-3 py-1.5 rounded-lg transition ${
                    activeTab === "top"
                      ? "bg-amber-500 text-black shadow-sm"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  Top Leaders
                </button>
              </div>
            </div>

            {displayedPayments.length === 0 ? (
              <div className="text-center py-12 px-4">
                <div className="size-16 rounded-full bg-slate-800/80 border border-slate-700 mx-auto flex items-center justify-center text-3xl mb-4">
                  ☕
                </div>
                <h3 className="text-lg font-semibold text-white mb-1">No chais yet</h3>
                <p className="text-slate-400 text-sm max-w-sm mx-auto mb-5">
                  Be the very first supporter to buy @{username} a warm cup of chai and leave an encouraging message!
                </p>
                <button
                  onClick={() => handleSelectAmount(50)}
                  className="px-4 py-2 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 rounded-xl text-xs font-semibold transition"
                >
                  Buy First Chai (₹50)
                </button>
              </div>
            ) : (
              <ul className="space-y-4 max-h-[560px] overflow-y-auto pr-1">
                {displayedPayments.map((p, index) => {
                  const donorChais = Math.max(1, Math.floor((p.amount || 10) / 10));
                  return (
                    <li
                      key={p._id || index}
                      className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/80 hover:border-slate-700/80 transition duration-200 flex gap-3.5 items-start"
                    >
                      <div className="size-10 rounded-full bg-amber-500/10 border border-amber-500/30 flex items-center justify-center font-bold text-amber-400 shrink-0 text-sm">
                        {p.name ? p.name.charAt(0).toUpperCase() : "☕"}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between flex-wrap gap-1">
                          <span className="font-semibold text-white text-sm truncate">{p.name || "Generous Supporter"}</span>
                          <span className="text-xs font-bold text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded-full">
                            ₹{p.amount} • {donorChais} {donorChais > 1 ? "Chais" : "Chai"} ☕
                          </span>
                        </div>
                        {p.message && (
                          <p className="text-slate-300 text-xs sm:text-sm mt-1.5 break-words bg-slate-950/40 p-2.5 rounded-lg border border-slate-800/50">
                            &quot;{p.message}&quot;
                          </p>
                        )}
                        <p className="text-[11px] text-slate-500 mt-2">
                          {p.createdAt
                            ? new Date(p.createdAt).toLocaleDateString("en-IN", {
                                month: "short",
                                day: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                              })
                            : "Recently"}
                        </p>
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>

          {/* Right Column: Make a Payment Box */}
          <div className="lg:col-span-5 glass-panel rounded-2xl border border-slate-800/80 p-5 sm:p-7 sticky top-24">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <span>Buy</span>
                <span className="text-amber-400 font-extrabold">{currentUser?.name || username}</span>
                <span>a Chai</span>
              </h2>
              <span className="text-2xl animate-bounce">☕</span>
            </div>

            {/* Chai Preset Selector Chips */}
            <div className="mb-5">
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2.5">
                Select Chai Cups
              </label>
              <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                {PRESET_AMOUNTS.map((item) => {
                  const isSelected = paymentform.amount === item.amount.toString();
                  return (
                    <button
                      key={item.amount}
                      type="button"
                      onClick={() => handleSelectAmount(item.amount)}
                      className={`relative py-2.5 px-2 rounded-xl text-xs font-bold border transition duration-200 flex flex-col items-center justify-center gap-1 ${
                        isSelected
                          ? "bg-amber-500 text-black border-amber-400 shadow-lg shadow-amber-500/25"
                          : "bg-slate-900/80 hover:bg-slate-800 text-slate-300 border-slate-800"
                      }`}
                    >
                      {item.popular && (
                        <span className="absolute -top-2 bg-gradient-to-r from-orange-500 to-pink-500 text-white text-[9px] px-1.5 py-0.2 rounded-full font-extrabold">
                          HOT
                        </span>
                      )}
                      <span>☕ x{item.chais}</span>
                      <span className={isSelected ? "text-slate-950 font-extrabold" : "text-amber-400"}>
                        ₹{item.amount}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Custom Amount & Form Details */}
            <div className="space-y-3.5 mb-6">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Custom Amount (₹)
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-bold">₹</span>
                  <input
                    type="number"
                    min="1"
                    name="amount"
                    value={paymentform.amount}
                    onChange={handleChange}
                    placeholder="Enter amount"
                    className="w-full pl-8 pr-4 py-2.5 bg-slate-900 border border-slate-800 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 rounded-xl text-white text-sm outline-none transition"
                  />
                  <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs text-slate-400">
                    ≈ {chaisCount} {chaisCount > 1 ? "chais" : "chai"}
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Your Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={paymentform.name}
                  onChange={handleChange}
                  placeholder="e.g. Rahul Sharma (or leave blank for Anonymous)"
                  className="w-full px-4 py-2.5 bg-slate-900 border border-slate-800 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 rounded-xl text-white text-sm outline-none transition"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Encouraging Message
                </label>
                <textarea
                  rows="2"
                  name="message"
                  value={paymentform.message}
                  onChange={handleChange}
                  placeholder="Say something nice to inspire the creator..."
                  className="w-full px-4 py-2.5 bg-slate-900 border border-slate-800 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 rounded-xl text-white text-sm outline-none transition resize-none"
                />
              </div>

              {/* Quick Message Chips */}
              <div>
                <p className="text-[11px] text-slate-400 mb-1.5">Quick message ideas:</p>
                <div className="flex flex-wrap gap-1.5">
                  {QUICK_MESSAGES.map((msg, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => handleSelectMessage(msg)}
                      className="text-[11px] bg-slate-900/90 hover:bg-slate-800 text-slate-300 border border-slate-800 hover:border-slate-700 px-2.5 py-1 rounded-lg transition"
                    >
                      {msg}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Big Action Pay Button */}
            <button
              type="button"
              disabled={isProcessing || !paymentform.amount || Number(paymentform.amount) < 1}
              onClick={() => pay(paymentform.amount)}
              className="w-full py-3.5 px-6 bg-gradient-to-r from-amber-500 via-orange-500 to-amber-500 hover:from-amber-600 hover:to-orange-600 disabled:from-slate-700 disabled:to-slate-800 disabled:text-slate-500 text-black font-extrabold rounded-xl transition duration-300 shadow-xl shadow-amber-500/20 flex items-center justify-center gap-2 text-base cursor-pointer disabled:cursor-not-allowed"
            >
              {isProcessing ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-black" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                  </svg>
                  <span>Connecting to Razorpay...</span>
                </>
              ) : (
                <>
                  <span>Support with ₹{selectedAmountNum || 50}</span>
                  <span>•</span>
                  <span>{chaisCount} {chaisCount > 1 ? "Chais" : "Chai"} ☕</span>
                </>
              )}
            </button>

            {/* Trust and Payment Methods Badge */}
            <div className="mt-4 pt-4 border-t border-slate-800/80 text-center">
              <div className="flex items-center justify-center gap-2 text-xs text-slate-400">
                <svg className="w-3.5 h-3.5 text-emerald-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>Secured by Razorpay • UPI (GPay, PhonePe, Paytm), Cards, NetBanking</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PaymentPage;
