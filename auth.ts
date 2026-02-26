import NextAuth from "next-auth";
import Google from "next-auth/providers/google";

const ALLOWED_DOMAINS = [
  "joinklover.com",
  "attaindata.io",
  "attainoutcomes.com",
];

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [Google],
  pages: {
    signIn: "/login",
  },
  callbacks: {
    signIn({ user }) {
      const domain = user.email?.split("@")[1];
      return ALLOWED_DOMAINS.includes(domain ?? "");
    },
  },
});
