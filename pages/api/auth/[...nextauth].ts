// /pages/api/auth/[...nextauth].js
import NextAuth from "next-auth"
import CognitoProvider from "next-auth/providers/cognito";

import {
  getServerSession,
  type NextAuthOptions,
  type DefaultSession,
} from "next-auth";
import { JWT } from "next-auth/jwt"


declare module "next-auth" {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session extends DefaultSession {
    accessToken: string
  }
}

declare module "next-auth/jwt" {
  /** Returned by the `jwt` callback and `getToken`, when using JWT sessions */
  interface JWT {
    /** OpenID ID Token */
    id: string
    idToken?: string
    accessToken: string
  }
}

// https://next-auth.js.org/configuration/callbacks
export const authOptions: NextAuthOptions = {
  providers: [
    CognitoProvider({
      clientId: process.env.COGNITO_CLIENT_ID!,
      clientSecret: process.env.COGNITO_CLIENT_SECRET!,
      issuer: process.env.COGNITO_ISSUER,
    }),
  ],
  session: {
    strategy: 'jwt',
  },
  callbacks: {
    jwt({ token, user, account, profile, isNewUser }) {
      // Persist the OAuth access_token and or the user id to the token right after signin
      if (account && token) {
        token.accessToken = account?.access_token ?? ""
      }
      return token;
    },
    session({ session, token }) {
      session.accessToken = token.accessToken;
      return session;
    },
  }
}

export default NextAuth(authOptions)
