import "./globals.css";
import { Prompt } from "next/font/google";
import Script from "next/script";
import NextTopLoader from "nextjs-toploader";
import Providers from "@/components/Providers";
import { Providers as ReduxProvider } from "@/redux/provider";
import Colors from "tailwindcss/colors";
import { Analytics } from "@vercel/analytics/react";
import SearchModal from "./Components/Modals/Search.modal";
import { Documents } from "@/redux/data/Documents";
import SessionProvider from "@/app/sessionProvider";
import { getServerSession } from "next-auth";
import { authOptions } from "../lib/authOptions";

const prombt: any = Prompt({
	subsets: ["latin"],
	style: ["normal", "italic"],
	display: "swap",
	weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

export const metadata = {
	title: "OCRX - Foorsa Translations",
	description:
		"Foorsa Consulting's OCRX Translations: Effortlessly translate documents for our clients with precision and speed. Our private web app, powered by OCR technologies and OpenAI GPT-3 API, ensures accurate translations, breaking language barriers with ease.",
	metadataBase: new URL("https://ocrx.foorsa.co/"),
	alternates: {
		canonical: "/",
		languages: {
			"en-US": "/",
		},
	},
	openGraph: {
		images: "/og-image.png",
	},
};

export default async function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	const session = await getServerSession(authOptions);

	return (
		<html lang="en">
			<head>
				<Script id="avoic-FOUC" strategy="beforeInteractive">
					{`
                        // On page load or when changing themes, best to add inline in head to avoid FOUC
                        if (localStorage.getItem('color-theme') === 'dark' || (!('color-theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                            document.documentElement.classList.add('dark');
                        } else {
                            document.documentElement.classList.remove('dark')
                        }
                    `}
				</Script>
			</head>
			<body className={prombt.className}>
				<ReduxProvider>
					<NextTopLoader
						color={Colors.sky[500]}
						initialPosition={0.08}
						crawlSpeed={200}
						height={5}
						crawl={true}
						showSpinner={false}
						easing="ease"
						speed={200}
						shadow={`0 0 10px ${Colors.sky["500"]},0 0 5px ${Colors.green["500"]}`}
					/>
					<Providers>
						{/* Page content */}
						<SearchModal />
						<SessionProvider session={session} basePath="/api/auth">
							{children}
						</SessionProvider>
					</Providers>
				</ReduxProvider>

				<Analytics />
			</body>
		</html>
	);
}
