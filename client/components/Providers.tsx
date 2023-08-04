"use client";

import React, { useEffect } from "react";
import { ThemeProvider, useTheme } from "next-themes";
import { usePathname, useRouter } from "next/navigation";
import Background from "../app/Components/A. Background";
import toast, { ToastBar, Toaster, resolveValue } from "react-hot-toast";
import { CloseSquare } from "iconsax-react";
import { AnimatePresence, motion } from "framer-motion";
import AnimatedCursor from "react-animated-cursor";
import colors from "tailwindcss/colors";
import { hexToRgb } from "@/lib/Color.utilities";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { setModal } from "@/redux/slices/searchSlice";

export function Analytics() {
    const token = process.env.NEXT_PUBLIC_BEAM_TOKEN;
    if (!token) {
        console.warn("No Beam token provided, analytics will not be loaded.");
        return null;
    }
    return (
        <script
            src="https://beamanalytics.b-cdn.net/beam.min.js"
            data-token={token}
            async
        />
    );
}

export default function Providers({ children }: { children: React.ReactNode }) {
    const Pathname = usePathname();
    const Router = useRouter();
    const BackgroundVariant = Pathname === "/" ? "Home" : "App";
    const { theme } = useTheme();
    const Dispatch = useAppDispatch();
    const isOpen = useAppSelector((state) => state.search.modal.isOpen);

    const keyDownHandler = (event: KeyboardEvent) => {
        if (event.ctrlKey && event.code === "KeyK") {
            event.preventDefault();
            Dispatch(
                setModal({
                    isOpen: true,
                    Document: null,
                })
            );
        }
    };

    useEffect(() => {
        window.addEventListener("keydown", keyDownHandler);
        return () => {
            window.removeEventListener("keydown", keyDownHandler);
        };
    }, []);

    return (
        <ThemeProvider attribute="class">
            <main className="relative flex min-h-screen flex-col items-center justify-between">
                <Background Variant={BackgroundVariant} />
                <Analytics />
                <Toaster
                    position="top-center"
                    toastOptions={{
                        className: "cursor-default",
                        style: {
                            border: "none",
                            padding: 0,
                            color: "currentColor",
                            background: "none",
                            backgroundColor: "none",
                            cursor: "default",
                            zIndex: 50,
                            boxShadow: "none",
                            pointerEvents: "all",
                        },
                        // Default options for specific types
                        success: {
                            duration: 1000,
                            iconTheme: {
                                primary: "#10b981",
                                secondary: "#064e3b",
                            },
                        } as any,
                        error: {
                            duration: 3000,
                            iconTheme: {
                                primary: "#ef4444",
                                secondary: "#7f1d1d",
                            },
                        } as any,
                    }}
                >
                    {(t) => (
                        <ToastBar
                            position="top-center" // Used to adapt the animation
                            toast={t}
                            key={t.id}
                        >
                            {({ icon, message }) => (
                                <div
                                    id="toast-default"
                                    className="flex max-w-sm shadow-2xl filter-none items-center justify-center space-x-2 rounded-lg border border-zinc-200 bg-white p-3 dark:border-zinc-800 dark:bg-zinc-950"
                                    role="alert"
                                >
                                    <div className="inline-flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg">
                                        {icon}
                                        <span className="sr-only">
                                            Toast Icon
                                        </span>
                                    </div>
                                    <div className="ml-3 text-sm font-normal text-zinc-500 dark:text-zinc-400">
                                        {message}
                                    </div>
                                    {t.type !== "loading" && (
                                        <button
                                            type="button"
                                            className="-mx-1.5 -my-1.5 ml-auto inline-flex h-8 w-8 rounded-lg bg-white p-1.5 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-900 dark:bg-zinc-950 dark:text-zinc-500 dark:hover:bg-zinc-900 dark:hover:text-white"
                                            data-dismiss-target="#toast-default"
                                            aria-label="Close"
                                            onClick={() => toast.dismiss(t.id)}
                                        >
                                            <span className="sr-only">
                                                Close
                                            </span>
                                            <CloseSquare
                                                className="h-5 w-5 text-zinc-400 dark:text-zinc-300"
                                                color="currentColor"
                                                variant="Bulk"
                                                aria-hidden="true"
                                            />
                                        </button>
                                    )}
                                </div>
                            )}
                        </ToastBar>
                    )}
                </Toaster>
                {/* <AnimatedCursor
                    // Cursor Configuration
                    innerSize={8}
                    outerSize={8}
                    color={hexToRgb(colors.lime[500])}
                    outerAlpha={0.2}
                    innerScale={0.7}
                    outerScale={5}
                    clickables={[
                        "a",
                        'input[type="text"]',
                        'input[type="email"]',
                        'input[type="number"]',
                        'input[type="submit"]',
                        'input[type="image"]',
                        "label[for]",
                        "select",
                        "textarea",
                        "button",
                        ".link",
                    ]}
                /> */}
                {children}
            </main>
        </ThemeProvider>
    );
}
