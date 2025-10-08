import { getServerSession } from "next-auth/next";
// import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { authOptions } from "@/lib/auth-options";
import { redirect } from "next/navigation";

export async function requireAdmin() {
  const session = await getServerSession(authOptions as any);
  
  if (!session) {
    redirect("/login");
  }
  
  if ((session as any)?.user?.role !== "admin") {
    redirect("/");
  }
  
  return session;
}

export async function isAdmin(): Promise<boolean> {
  const session = await getServerSession(authOptions as any);
  return (session as any)?.user?.role === "admin";
}

