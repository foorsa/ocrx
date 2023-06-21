import React from "react";

export default function Footer() {
    return (
        <footer className="relative bottom-0 left-0 w-screen p-4 md:flex md:items-center md:justify-center md:p-6 border-t border-zinc-200 bg-zinc-50 dark:bg-black dark:border-zinc-700">
            <span className="text-sm sm:text-center text-zinc-500 dark:text-zinc-600">
                © 2023{" "}
                <a href="https://foorsa.ma/new/" className="hover:underline">
                    Foorsa Consulting™
                </a>{" "}
                All Rights Reserved.
            </span>
        </footer>
    );
}
