import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import FacebookProvider from "next-auth/providers/facebook";
import GitHubProvider from "next-auth/providers/github";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions = {
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID || "",
            clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
        }),
        FacebookProvider({
            clientId: process.env.FACEBOOK_CLIENT_ID || "",
            clientSecret: process.env.FACEBOOK_CLIENT_SECRET || "",
        }),
        GitHubProvider({
            clientId: process.env.GITHUB_CLIENT_ID || "",
            clientSecret: process.env.GITHUB_CLIENT_SECRET || "",
            allowDangerousEmailAccountLinking: true,
            httpOptions: {
                timeout: 10000,
            },
        }),
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                // TODO: Replace with actual API call
                // For now, mock authentication
                if (credentials?.email && credentials?.password) {
                    // Admin check
                    if (
                        credentials.email === "admin@volunteer.org" &&
                        credentials.password === "admin123"
                    ) {
                        return {
                            id: "admin-id",
                            name: "Admin",
                            email: credentials.email,
                            role: "admin",
                            image: "/images/profile.png",
                        };
                    }

                    // Regular user
                    return {
                        id: "mock-user-id",
                        name: "ស្ម័គ្រចិត្ត",
                        email: credentials.email,
                        role: "user",
                        image: "/images/profile.png",
                    };
                }
                return null;
            },
        }),
    ],
    callbacks: {
        async jwt({ token, user, account }) {
            if (user) {
                token.id = user.id;
                token.role = user.role || "user";
            }
            if (account) {
                token.provider = account.provider;
                token.accessToken = account.access_token;
            }
            return token;
        },
        async session({ session, token }) {
            if (session?.user) {
                session.user.id = token.id;
                session.user.role = token.role;
                session.user.provider = token.provider;
                session.user.accessToken = token.accessToken;
            }
            return session;
        },
        async signIn({ user, account, profile }) {
            // Allow all sign-ins for now
            // TODO: Add custom logic for organizer verification
            return true;
        },
    },
    pages: {
        signIn: "/auth/login",
        error: "/auth/login",
    },
    session: {
        strategy: "jwt",
    },
    debug: process.env.NODE_ENV === "development",
    secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
