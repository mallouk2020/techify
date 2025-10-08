// types/next-auth.d.ts
import "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: string;
      email?: string | null;
    };
  }

  interface User {
    id: string;
    role: string;
    email?: string | null;
  }

  interface Account {
    provider?: string;
    type?: string;
  }
}
