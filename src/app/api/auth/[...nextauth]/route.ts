import NextAuth, { type AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

import { SignIn } from "@/src/services/auth.service";

export const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",

      credentials: {
        email: {
          label: "Email",
          type: "email",
        },
        password: {
          label: "Password",
          type: "password",
        },
      },

      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Email and password are required.");
        }

        try {
          const res = await SignIn({
            email: credentials.email,
            password: credentials.password,
          });

          const data = res?.items;

          if (!data?.accessToken || !data?.user) {
            throw new Error("Login failed.");
          }

          return {
            id: data.user.id,
            email: data.user.email,
            name: data.user.userName,
            role: data.user.role,
            accessToken: data.accessToken,
            notifications: data.notifications ?? [],
          };
        } catch (error) {
          console.error("Authorize Error:", error);

          if (error instanceof Error) {
            throw new Error(error.message);
          }

          throw new Error("Login failed.");
        }
      },
    }),
  ],

  pages: {
    signIn: "/login",
  },

  session: {
    strategy: "jwt",
  },

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.accessToken = user.accessToken;
        token.notifications = user.notifications ?? [];
      }

      return token;
    },

    async session({ session, token }) {
      session.user.id = token.id;
      session.user.role = token.role;
      session.accessToken = token.accessToken;
      session.notifications = token.notifications ?? [];

      return session;
    },
  },

  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
