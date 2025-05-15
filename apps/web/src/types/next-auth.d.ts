import NextAuth from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      jwt: string;
    };
  }

  interface User {
    id: string;
    name?: string | null;
    email?: string | null;
    jwt: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    jwt: string;
  }
}