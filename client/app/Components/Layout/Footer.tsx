import React from "react";

export default function Footer() {
    return (
        <footer className="relative bottom-0 left-0 w-screen p-4 border-gray-200 bg-gray-50 dark:bg-gray-700 dark:border-gray-500 md:flex md:items-center md:justify-center md:p-6">
            <span className="text-sm sm:text-center text-gray-500 dark:text-gray-400">
                © 2023{" "}
                <a href="https://flowbite.com/" className="hover:underline">
                    Foorsa Consulting™
                </a>{" "}
                All Rights Reserved.
            </span>
        </footer>
    );
}
