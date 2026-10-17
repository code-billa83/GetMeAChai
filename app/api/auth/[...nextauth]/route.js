import sanitize from "mongo-sanitize";
import NextAuth from "next-auth";
import GitHubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import connectDb, { isDbConnected } from "@/db/connectDb";
import User from "@/models/User";

export const authOptions = {
  providers: [
    GitHubProvider({
      clientId: process.env.GITHUB_ID || "",
      clientSecret: process.env.GITHUB_SECRET || "",
    }),
    GoogleProvider({
      clientId: process.env.AUTH_GOOGLE_ID || "",
      clientSecret: process.env.AUTH_GOOGLE_SECRET || "",
    }),
    CredentialsProvider({
      id: "credentials",
      name: "Demo / Test Creator Login",
      credentials: {
        username: { label: "Username", type: "text", placeholder: "shiva" },
        password: { label: "Password", type: "password", placeholder: "demo" },
      },
      async authorize(credentials) {
        // 🔒 Input data ko clean aur sanitize kiya tak NoSQL injection queries block ho sakein
        const cleanCredentialsUsername = sanitize(credentials?.username || "shiva");
        const rawUsername = cleanCredentialsUsername.toLowerCase().trim().replace(/[^a-z0-9_-]/g, "") || "shiva";
        
        await connectDb();

        if (isDbConnected()) {
          try {
            let dbUser = await User.findOne({ username: rawUsername });
            if (!dbUser) {
              dbUser = await User.create({
                email: `${rawUsername}@chai.com`,
                username: rawUsername,
                name: rawUsername.charAt(0).toUpperCase() + rawUsername.slice(1),
                profilepic: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80",
                coverpic: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=1200&q=80",
                razorpayid: process.env.RAZORPAY_KEY_ID,
                razorpaysecret: process.env.RAZORPAY_KEY_SECRET,
              });
            }
          } catch (err) {
            console.warn("[Credentials authorize DB]:", err.message);
          }
        }

        return {
          id: rawUsername,
          name: rawUsername,
          email: `${rawUsername}@chai.com`,
          image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80",
        };
      },
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET || "ShivaEcomSecretKey601244##",
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
  },
  // 🔒 Production-ready cookies level authentication taaki data intercept na ho sake
  cookies: {
    sessionToken: {
      name: process.env.NODE_ENV === "production" 
        ? `__Secure-next-auth.session-token` 
        : `next-auth.session-token`, 
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: process.env.NODE_ENV === "production" 
      }
    }
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.username = user.name || user.email?.split("@")[0] || "shiva";
      }
      return token;
    },
    async session({ session, token }) {
      if (token?.username) {
        session.user.name = token.username;
      }
      if (isDbConnected() && session.user?.email) {
        try {
          await connectDb();
          // 🔒 Session level checks ko sanitize kiya
          const cleanEmail = sanitize(session.user.email);
          const dbUser = await User.findOne({ email: cleanEmail });
          if (dbUser?.username) {
            session.user.name = dbUser.username;
          }
        } catch (e) {
          // quiet fallback
        }
      }
      return session;
    },
    async signIn({ user, account }) {
      if (account?.provider === "github" || account?.provider === "google") {
        await connectDb();
        if (isDbConnected()) {
          try {
            // 🔒 OAuth response vectors ko strictly sanitize kiya
            const userEmail = sanitize(user.email);
            const currentUser = await User.findOne({ email: userEmail });
            if (!currentUser) {
              const cleanUser = sanitize((user.name || userEmail.split("@")[0]).toLowerCase().replace(/[^a-z0-9_-]/g, ""));
              await User.create({
                email: userEmail,
                username: cleanUser,
                name: sanitize(user.name) || cleanUser,
                profilepic: user.image,
                razorpayid: process.env.RAZORPAY_KEY_ID,
                razorpaysecret: process.env.RAZORPAY_KEY_SECRET,
              });
            }
          } catch (err) {
            console.warn(`[${account.provider} signIn callback error]:`, err.message);
          }
        }
      }
      return true;
    },
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
