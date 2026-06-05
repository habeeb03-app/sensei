import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import bcrypt from "bcryptjs";
import { connectDB } from "./mongodb";
import User from "@/models/User";

function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    console.error(`[auth] MISSING REQUIRED ENV VAR: ${name}`);
    console.error(
      `[auth] Add ${name} to your Vercel environment variables and .env.local`
    );
    return "";
  }
  return value;
}

const GOOGLE_CLIENT_ID = requireEnv("GOOGLE_CLIENT_ID");
const GOOGLE_CLIENT_SECRET = requireEnv("GOOGLE_CLIENT_SECRET");
const NEXTAUTH_SECRET = requireEnv("NEXTAUTH_SECRET");
const NEXTAUTH_URL = process.env.NEXTAUTH_URL || "";

console.log("[auth] Initializing authOptions...");
console.log(`[auth] NEXTAUTH_URL: ${NEXTAUTH_URL || "(not set — NextAuth will auto-detect)"}`);
console.log(`[auth] GOOGLE_CLIENT_ID: ${GOOGLE_CLIENT_ID ? `${GOOGLE_CLIENT_ID.substring(0, 10)}...` : "MISSING"}`);
console.log(`[auth] GOOGLE_CLIENT_SECRET: ${GOOGLE_CLIENT_SECRET ? "set (hidden)" : "MISSING"}`);
console.log(`[auth] NEXTAUTH_SECRET: ${NEXTAUTH_SECRET ? "set (hidden)" : "MISSING"}`);

if (!GOOGLE_CLIENT_ID || !GOOGLE_CLIENT_SECRET) {
  console.warn("[auth] Google OAuth will NOT work — missing credentials");
} else {
  const callbackUrl = `${NEXTAUTH_URL || "https://englishsensei.vercel.app"}/api/auth/callback/google`;
  console.log(`[auth] Google OAuth callback URL: ${callbackUrl}`);
  console.log(`[auth] Ensure this exact URL is registered in Google Cloud Console`);
  console.log(`[auth] Also add "${NEXTAUTH_URL || "https://englishsensei.vercel.app"}" to Authorized JavaScript origins`);
}

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: GOOGLE_CLIENT_ID,
      clientSecret: GOOGLE_CLIENT_SECRET,
    }),
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        console.log("=== Login attempt ===");
        console.log("Email:", credentials?.email);
        console.log("Password provided:", !!credentials?.password);

        if (!credentials?.email || !credentials?.password) {
          console.log("Missing credentials");
          throw new Error("Email and password required");
        }

        await connectDB();
        const user = await User.findOne({ email: credentials.email });
        console.log("User found:", !!user);

        if (!user) {
          console.log("No user found for email:", credentials.email);
          throw new Error("Account does not exist");
        }

        if (!user.passwordHash) {
          console.log("User registered via Google, no password set");
          throw new Error("This account uses Google sign-in. Please sign in with Google.");
        }

        console.log("passwordHash exists:", !!user.passwordHash);

        const isValid = await bcrypt.compare(credentials.password, user.passwordHash);
        console.log("Password match:", isValid);

        if (!isValid) throw new Error("Invalid email or password");

        return {
          id: user._id.toString(),
          email: user.email,
          name: user.name,
        };
      },
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60,
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        if (user.email) {
          await connectDB();
          const dbUser = await User.findOne({ email: user.email });
          if (dbUser) {
            token.id = dbUser._id.toString();
          } else {
            token.id = user.id;
          }
        } else {
          token.id = user.id;
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as { id: string }).id = token.id as string;
      }
      return session;
    },
    async signIn({ account, profile }) {
      console.log(`[auth] signIn callback triggered — provider: ${account?.provider}`);
      if (account?.provider === "google") {
        console.log(`[auth] Google signIn — profile email: ${profile?.email}`);
        if (!profile?.email) {
          console.error("[auth] Google signIn failed — no email in profile");
          return false;
        }

        await connectDB();
        const existingUser = await User.findOne({ email: profile.email });
        console.log(`[auth] Google user "${profile.email}" exists: ${!!existingUser}`);

        if (!existingUser) {
          await User.create({
            name: profile.name || profile.email.split("@")[0],
            email: profile.email,
          });
          console.log(`[auth] Created new user for: ${profile.email}`);
        }

        return true;
      }
      return true;
    },
  },
  pages: {
    signIn: "/login",
  },
  secret: NEXTAUTH_SECRET,
};
