import { AuthOptions } from "next-auth";
import { Session } from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import GoogleProvider from "next-auth/providers/google";
import { prisma } from "./prisma";

if(!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
    console.error("[ERROR] Google Client ID or Google Client Secret isn't set.");
    process.exit();
}

const authConfig: AuthOptions = {
    secret: process.env.NEXTAUTH_SECRET,
    session: {
        strategy: "jwt",
    },
    adapter: PrismaAdapter(prisma),
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET
        })
    ],
    pages: {
        signIn: "/signin",
        newUser: "/register"
    },
    callbacks: {
        async session({ session, token: { sub } }): Promise<Session> {
            if (session.user && sub) session.user.id = sub;
            return session;
        },
    },
    debug: process.env.NODE_ENV === "development"
};

export default authConfig;
