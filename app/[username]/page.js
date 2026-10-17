import React from "react";
import PaymentPage from "@/components/PaymentPage";
import { notFound } from "next/navigation";
import { fetchuser } from "@/actions/useractions";

const RESERVED_ROUTES = new Set(["api", "dashboard", "login", "about", "favicon.ico", "robots.txt"]);

const Username = async ({ params }) => {
  const resolvedParams = await params;
  const username = resolvedParams?.username?.toLowerCase();

  if (!username || RESERVED_ROUTES.has(username)) {
    return notFound();
  }

  // Fetch creator profile safely through Server Action with dual-store resolution
  const user = await fetchuser(username);

  if (!user) {
    return notFound();
  }

  return <PaymentPage username={username} initialUser={user} />;
};

export default Username;

export async function generateMetadata({ params }) {
  const resolvedParams = await params;
  const username = resolvedParams?.username || "Creator";
  const capitalized = username.charAt(0).toUpperCase() + username.slice(1);

  return {
    title: `Support @${username} - Get Me A Chai`,
    description: `Buy a chai for ${capitalized} and help support their creative work and open source projects.`,
  };
}
