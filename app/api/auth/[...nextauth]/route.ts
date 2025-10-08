// app/api/auth/[...nextauth]/route.ts
import { authOptions } from "@/lib/auth-options";
import NextAuth from "next-auth/next";

// Force dynamic rendering to prevent build-time execution
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };