import "./globals.css";
import { Prompt } from "next/font/google";
import Script from "next/script";
import NextTopLoader from "nextjs-toploader";
import Providers from "./providers";

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
    metadataBase: new URL("http://localhost:3000"),
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

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
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
                <NextTopLoader
                    color="#6d28d9"
                    initialPosition={0.08}
                    crawlSpeed={200}
                    height={5}
                    crawl={true}
                    showSpinner={false}
                    easing="ease"
                    speed={200}
                    shadow="0 0 10px #6d28d9,0 0 5px #6d28d9"
                />
                <Providers>{children}</Providers>
            </body>
        </html>
    );
}
