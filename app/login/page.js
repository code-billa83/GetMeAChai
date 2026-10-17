"use client";

import React, { useEffect, useState } from "react";
import { useSession, signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

const Login = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [demoUsername, setDemoUsername] = useState("shiva");
  const [isSigningIn, setIsSigningIn] = useState(false);

  useEffect(() => {
    document.title = "Sign In - Get Me A Chai";
    if (status === "authenticated") {
      router.push("/dashboard");
    }
  }, [status, router]);

  const handleDemoSignIn = async (userToLogin) => {
    setIsSigningIn(true);
    try {
      await signIn("credentials", {
        username: userToLogin || demoUsername,
        password: "demo",
        callbackUrl: "/dashboard",
      });
    } catch (e) {
      console.error(e);
      setIsSigningIn(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12 relative">
      {/* Background radial highlight */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="max-w-md w-full glass-panel border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl relative">
        <div className="text-center mb-8">
          <div className="size-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 p-0.5 shadow-lg shadow-amber-500/25">
            <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
              <img src="/tea.gif" alt="Chai" className="size-10 object-contain" />
            </div>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Welcome to Get Me A Chai
          </h1>
          <p className="text-slate-400 text-xs sm:text-sm mt-1.5">
            Sign in to manage your creator profile, claim your custom link, and receive chais.
          </p>
        </div>

        <div className="space-y-4">
          {/* GitHub OAuth Button */}
          <button
            type="button"
            disabled={isSigningIn}
            onClick={() => {
              setIsSigningIn(true);
              signIn("github", { callbackUrl: "/dashboard" });
            }}
            className="w-full flex items-center justify-center gap-3 px-5 py-3.5 bg-slate-900 hover:bg-slate-850 border border-slate-700 hover:border-slate-600 rounded-xl text-white text-sm font-semibold transition duration-200 shadow-md group cursor-pointer disabled:opacity-60"
          >
            <svg className="size-5 fill-current text-white group-hover:scale-110 transition" viewBox="0 0 24 24">
              <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
            </svg>
            <span>Continue with GitHub</span>
          </button>

          {/* Google OAuth Button */}
          <button
            type="button"
            disabled={isSigningIn}
            onClick={() => {
              setIsSigningIn(true);
              signIn("google", { callbackUrl: "/dashboard" });
            }}
            className="w-full flex items-center justify-center gap-3 px-5 py-3.5 bg-slate-900 hover:bg-slate-850 border border-slate-700 hover:border-slate-600 rounded-xl text-white text-sm font-semibold transition duration-200 shadow-md group cursor-pointer disabled:opacity-60"
          >
            <svg className="size-5 group-hover:scale-110 transition" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            <span>Continue with Google</span>
          </button>

          {/* Divider */}
          <div className="relative my-6 text-center">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-800" />
            </div>
            <span className="relative bg-slate-900 px-3 text-xs text-slate-400 font-semibold tracking-wider uppercase">
              Or 1-Click Evaluation / Demo Login
            </span>
          </div>

          {/* 1-Click Demo Sign In */}
          <div className="bg-slate-950/70 border border-slate-800/80 rounded-2xl p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-300">Test Creator Account:</span>
              <span className="text-[11px] bg-amber-500/10 text-amber-400 border border-amber-500/30 px-2 py-0.5 rounded-full font-semibold">
                Instant Access
              </span>
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                value={demoUsername}
                onChange={(e) => setDemoUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_-]/g, ""))}
                placeholder="Enter username"
                className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-white text-xs outline-none focus:border-amber-500"
              />
              <button
                type="button"
                disabled={isSigningIn || !demoUsername}
                onClick={() => handleDemoSignIn(demoUsername)}
                className="shrink-0 px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-black text-xs font-bold rounded-xl transition shadow-md shadow-amber-500/20 disabled:opacity-50"
              >
                Sign In ⚡
              </button>
            </div>

            <p className="text-[11px] text-slate-400">
              Tip: Click above to test the full creator experience immediately without external API keys setup!
            </p>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-slate-800/80 text-center text-xs text-slate-400">
          <p>
            By continuing, you agree to our{" "}
            <Link href="/about" className="text-amber-400 hover:underline">
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link href="/about" className="text-amber-400 hover:underline">
              Privacy Policy
            </Link>
            .
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
