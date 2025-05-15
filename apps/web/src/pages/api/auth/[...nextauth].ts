import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { strapiClient } from "@youarewe/api-client";

export default NextAuth({
  providers: [
    CredentialsProvider({
      name: "Strapi",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }
        
        try {
          const response = await strapiClient.post('/api/auth/local', {
            identifier: credentials.email,
            password: credentials.password,
          });
          
          if (response.jwt && response.user) {
            return {
              id: response.user.id,
              name: response.user.username,
              email: response.user.email,
              jwt: response.jwt,
            };
          }
          return null;
        } catch (error) {
          console.error("Auth error:", error);
          return null;
        }
      }
    })
  ],
  callbacks: {
    async session({ session, token }) {
      session.user.id = token.id;
      session.user.jwt = token.jwt;
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.jwt = user.jwt;
      }
      return token;
    }
  },
  pages: {
    signIn: '/login',
    signOut: '/',
    error: '/login',
  },
});