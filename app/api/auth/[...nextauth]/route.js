import connectDB from "@/lib/mongodb";
import { User } from "@/models/user";
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {},

      async authorize(credentials) {
        const { email, password } = credentials;

        try {
          await connectDB();
          const user = await User.findOne({ email });

          if (!user) {
            return null;
          }

          const passwordMatched = await bcrypt.compare(password, user.password);

          if (!passwordMatched) {
            return null;
          }

          return {
            id: user._id.toString(),
            name: user.name,
            email: user.email,
            role: user.role,
          };
        } catch (error) {
          console.log("Error: ", error);
        }
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: "/",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id || user._id?.toString();
        token.role = user.role;
        if (!user.image) {
          const name = encodeURIComponent(user.name || "User");
          token.avatar = `https://ui-avatars.com/api/?name=${name}&background=0c0eff&color=fff&size=64&rounded=true`;
        } else {
          token.avatar = user.image;
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id;
        session.user.role = token.role;
        session.user.image =
          token.avatar ||
          `https://ui-avatars.com/api/?name=${encodeURIComponent(
            session.user.name || "User"
          )}&background=0c0eff&color=fff&size=64&rounded=true`;
      }
      return session;
    },
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };