"use client";

import React from "react";
import { ThemeProvider } from "next-themes";
import { usePathname } from "next/navigation";
import Background from "./Components/A. Background";

export default function Providers({ children }: { children: React.ReactNode }) {
    const Pathname = usePathname();
    const BackgroundVariant = Pathname === "/" ? "Home" : "App";

    return (
        <ThemeProvider attribute="class">
            <main className="relative flex min-h-screen flex-col items-center justify-between">
                <Background Variant={BackgroundVariant} />
                {children}
            </main>
        </ThemeProvider>
    );
}
