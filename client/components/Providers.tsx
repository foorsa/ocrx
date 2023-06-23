"use client";

import React from "react";
import { ThemeProvider } from "next-themes";
import { usePathname, useRouter } from "next/navigation";
import Background from "../app/Components/A. Background";
import toast, { ToastBar, Toaster, resolveValue } from "react-hot-toast";
import { CloseSquare } from "iconsax-react";
import { AnimatePresence, motion } from "framer-motion";

export default function Providers({ children }: { children: React.ReactNode }) {
    const Pathname = usePathname();
    const Router = useRouter();
    const BackgroundVariant = Pathname === "/" ? "Home" : "App";

    return (
        <ThemeProvider attribute="class">
            <main className="relative flex min-h-screen flex-col items-center justify-between">
                <Background Variant={BackgroundVariant} />
                <Toaster
                    position="bottom-right"
                    toastOptions={{
                        className: "",
                        style: {
                            border: "none",
                            padding: 0,
                            color: "currentColor",
                            background: "none",
                            backgroundColor: "none",
                        },
                        // Default options for specific types
                        success: {
                            duration: 3000,
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
                            position="bottom-right" // Used to adapt the animation
                            toast={t}
                        >
                            {({ icon, message }) => (
                                <div
                                    id="toast-default"
                                    className="flex items-center space-x-2 justify-center max-w-sm p-3 bg-white border border-zinc-200 rounded-lg shadow-2xl dark:bg-zinc-800 dark:border-zinc-700"
                                    role="alert"
                                >
                                    <div className="inline-flex items-center justify-center flex-shrink-0 w-8 h-8 rounded-lg">
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
                                            className="ml-auto -mx-1.5 -my-1.5 bg-white text-zinc-400 hover:text-zinc-900 rounded-lg p-1.5 hover:bg-zinc-100 inline-flex h-8 w-8 dark:text-zinc-500 dark:hover:text-white dark:bg-zinc-800 dark:hover:bg-zinc-700"
                                            data-dismiss-target="#toast-default"
                                            aria-label="Close"
                                            onClick={() => toast.dismiss(t.id)}
                                        >
                                            <span className="sr-only">
                                                Close
                                            </span>
                                            <CloseSquare
                                                className="w-5 h-5 text-zinc-400 dark:text-zinc-300"
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
                {children}
            </main>
        </ThemeProvider>
    );
}
