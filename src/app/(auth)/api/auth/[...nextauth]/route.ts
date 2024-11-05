import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";

const authOptions = {
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID as string,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
            authorization: {
                params: {
                    prompt: 'consent',
                    //prompt: 'select_account',
                    hd: 'uef.edu.vn',
                    domain_hint: 'uef.edu.vn',
                    access_type: "offline",
                    response_type: "code"
                },
            },
        }),
    ],
    callbacks: {
        async signIn({ account, profile }: { account: any; profile?: any }) {
            if (account.provider === "google" && profile.email.endsWith("@uef.edu.vn")) {
                return true;
            } else {
                return false;
            }
        },
    },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
