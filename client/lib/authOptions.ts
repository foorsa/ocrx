import type { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions: NextAuthOptions = {
    secret: process.env.NEXTAUTH_SECRET,
    pages: {
        signIn: '/auth/sign-in',  // Displays signin buttons
        signOut: '/auth/sign-out', // Signs out user and displays message
        error: '/auth/error', // Error code passed in query string as ?error=
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
                email: { name: "email", label: "Email", type: "text", placeholder: "yassine@skymap.net" },
                password: { name: "password", label: "Password", type: "password" }
            },
            async authorize(credentials: any, req: any): Promise<any> {
                const { email, password } = credentials as {
                    email: string;
                    password: string;
                }

                // Here we will implement a real authentication system
                // We only need one user to authenticate - so we will hardcode the user.

                const validCredentials = email === "staff@foorsa.co" && password === "SR{y9,Wp)m#,m8o>";

                if (!validCredentials) {
                    throw new Error("Invalid credentials");
                }

                // I will use a single user for this example - and later will implement a real authentication
                const validUser = {
                    id: 1,
                    name: "Foorsa Staff.",
                    email: "staff@foorsa.co",
                }

                return validUser;
            }
        })
    ],
}