import { NextAuthOptions, Profile } from "next-auth";
import GoogleProvider from "next-auth/providers/google";

interface GoogleProfile extends Profile {
    hd?: string;  // `hd` không bắt buộc (optional)
}

export const authOptions: NextAuthOptions = {
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID as string,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
            authorization: {
                params: {
                    // prompt: 'consent',
                    prompt: 'select_account',
                    hd: 'uef.edu.vn',
                    domain_hint: 'uef.edu.vn',
                },
            },
        }),
    ],
    callbacks: {
        async signIn({ account, profile }) {
            const googleProfile = profile as GoogleProfile;
            if (googleProfile?.hd === "uef.edu.vn") {
                return true;
            } else {
                return false;
            }
        },
    },
    secret: process.env.NEXTAUTH_SECRET,
    pages: {
        signIn: "/login",
        error: "/login",
    },
};