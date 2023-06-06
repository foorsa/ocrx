import "./globals.css";
import { Prompt } from "next/font/google";

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
        <html lang="en" className="dark">
            <body className={prombt.className}>{children}</body>
        </html>
    );
}
