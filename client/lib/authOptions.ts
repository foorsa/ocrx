import type { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions: NextAuthOptions = {
    secret: process.env.NEXTAUTH_SECRET,
    pages: {
        signIn: '/auth/sign-in',  // Displays signin buttons
        signOut: '/auth/sign-out', // Signs out user and displays message
        error: '/auth/error', // Error code passed in query string as ?error=
        newUser: "/app",
    },
    theme: {
        colorScheme: 'light',
    },
    session: {
        strategy: "jwt",
        maxAge: 30 * 24 * 60 * 60,
    },
    providers: [
        CredentialsProvider({
            name: 'Credentials',
            type: "credentials",
            credentials: {
                email: { name: "email", label: "Email", type: "text", placeholder: "yassine@foorsa.co" },
                password: { name: "password", label: "Password", type: "password" }
            },
            async authorize(credentials: any, req: any): Promise<any> {
                const { email, password } = credentials as {
                    email: string;
                    password: string;
                }

                // Here we will implement a real authentication system

                // Staff credentials come from the environment (never commit them).
                const staffEmail = process.env.STAFF_EMAIL;
                const staffPassword = process.env.STAFF_PASSWORD;
                if (!staffEmail || !staffPassword) {
                    console.error("[auth] STAFF_EMAIL / STAFF_PASSWORD are not configured.");
                    return null;
                }

                const validCredentials = email === staffEmail && password === staffPassword;

                if (validCredentials) {
                    // I will use a single user for this example - and later will implement a real authentication
                    const validUser = {
                        id: 1,
                        name: "Foorsa Staff.",
                        email: staffEmail,
                    }

                    return validUser;
                }

                return null;
            }
        })
    ],
}