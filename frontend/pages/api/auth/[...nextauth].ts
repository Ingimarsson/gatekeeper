import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import api from "../../../api";

export default NextAuth({
  pages: {
    signIn: "/",
  },
  // Configure one or more authentication providers
  providers: [
    CredentialsProvider({
      // The name to display on the sign in form (e.g. "Sign in with...")
      name: "Credentials",
      // The credentials is used to generate a suitable form on the sign in page.
      // You can specify whatever fields you are expecting to be submitted.
      // e.g. domain, username, password, 2FA token, etc.
      // You can pass any HTML attribute to the <input> tag through the object.
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, req) {
        // Add logic here to look up the user from the credentials supplied
        const res = await api().post("/auth/login", {
          email: credentials?.email,
          password: credentials?.password,
        });
        if (res.status == 200) {
          return res.data;
        }
        return null;
      },
    }),
  ],
  callbacks: {
    jwt: async ({ token, user }) => {
      user && (token.user = user);
      return token;
    },
    session: async ({ session, token }: { session: any; token: any }) => {
      session.token = token.user.token;
      return session;
    },
  },
});
