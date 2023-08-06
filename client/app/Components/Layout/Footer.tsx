import React from "react";

export default function Footer() {
    return (
        <footer className="relative bottom-0 left-0 w-screen p-4 md:flex md:items-center md:justify-center md:p-6 border-t border-zinc-300 bg-zinc-50/75 text-zinc-900 focus:border-blue-500 focus:ring-blue-500 dark:border-zinc-600 dark:bg-zinc-950/75 dark:text-white">
            <span className="text-sm sm:text-center">
                © 2023{" "}
                <a
                    href="https://foorsa.ma/new/"
                    className="hover:underline"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    Foorsa Consulting™
                </a>{" "}
                All Rights Reserved.
            </span>
        </footer>
    );
}
