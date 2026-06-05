import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import bcrypt from "bcryptjs";
import { connectDB } from "./mongodb";
import User from "@/models/User";

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
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
        token.id = user.id;
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
      if (account?.provider === "google") {
        if (!profile?.email) return false;

        await connectDB();
        const existingUser = await User.findOne({ email: profile.email });

        if (!existingUser) {
          await User.create({
            name: profile.name || profile.email.split("@")[0],
            email: profile.email,
          });
        }

        return true;
      }
      return true;
    },
  },
  pages: {
    signIn: "/login",
  },
  secret: process.env.NEXTAUTH_SECRET,
};
