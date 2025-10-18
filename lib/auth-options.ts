// lib/auth-options.ts
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import type { JWT } from "next-auth/jwt";
import type { Session, User } from "next-auth";

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        // Import prisma only when needed (at runtime, not build time)
        const prisma = (await import("@/utils/db")).default;
        
        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });

        if (!user || !user.password) return null;

        const isCorrect = await bcrypt.compare(credentials.password, user.password);
        return isCorrect ? { 
          id: user.id, 
          email: user.email, 
          role: user.role,
          name: user.name,
          phone: user.phone,
          address: user.address,
        } : null;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, trigger, session }: any) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.name = user.name;
        token.phone = user.phone;
        token.address = user.address;
        token.iat = Math.floor(Date.now() / 1000);
        token.exp = Math.floor(Date.now() / 1000) + (365 * 24 * 60 * 60);
      }

      if (trigger === "update" && session) {
        if (session.name !== undefined) token.name = session.name;
        if (session.phone !== undefined) token.phone = session.phone;
        if (session.address !== undefined) token.address = session.address;
      }

      token.exp = Math.floor(Date.now() / 1000) + (365 * 24 * 60 * 60);

      return token;
    },
    async session({ session, token }: any) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
        session.user.name = token.name as string;
        session.user.phone = token.phone as string;
        session.user.address = token.address as string;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt" as const,
    maxAge: 365 * 24 * 60 * 60, // سنة واحدة بدلاً من 30 يوم
    updateAge: 24 * 60 * 60, // تحديث الجلسة كل 24 ساعة
  },
  secret: process.env.NEXTAUTH_SECRET,
};

export default authOptions;