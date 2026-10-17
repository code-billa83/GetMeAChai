import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SessionWrapper from "@/components/SessionWrapper";
import Script from "next/script";

const inter = Inter({ subsets: ["latin"], display: "swap" });

export const metadata = {
  title: "Get Me A Chai - Support Creators with Chai",
  description: "A modern creator crowdfunding platform where fans support their favorite artists, developers, and creators one chai at a time.",
  keywords: ["crowdfunding", "creators", "razorpay", "chai", "patreon clone", "support"],
  authors: [{ name: "Get Me A Chai Team" }],
  openGraph: {
    title: "Get Me A Chai - Fund your projects with chai",
    description: "Empower creators with direct fan support and seamless UPI/Card payments.",
    type: "website",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="icon" href="/tea.gif" />
      </head>
      <body
        className={`${inter.className} min-h-screen bg-slate-950 text-slate-100 selection:bg-amber-500 selection:text-black antialiased relative overflow-x-hidden`}
      >
        {/* Subtle radial ambient background glow */}
        <div className="fixed inset-0 pointer-events-none -z-10 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.18),rgba(255,255,255,0))]" />
        <div className="fixed inset-0 pointer-events-none -z-10 bg-[linear-gradient(to_right,#1f29370a_1px,transparent_1px),linear-gradient(to_bottom,#1f29370a_1px,transparent_1px)] bg-[size:24px_24px]" />

        <SessionWrapper>
          <div className="flex flex-col min-h-screen">
            <Navbar />
            <main className="flex-1 w-full">{children}</main>
            <Footer />
          </div>
        </SessionWrapper>

        {/* Official Razorpay Checkout SDK Script */}
        <Script
          id="razorpay-checkout-sdk"
          src="https://checkout.razorpay.com/v1/checkout.js"
          strategy="afterInteractive"
        />
      </body>
    </html>
  );
}
