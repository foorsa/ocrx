import Link from "next/link";
import React from "react";

export default function Header() {
    return (
        <nav className="relative w-full">
            <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
                <a href="https://flowbite.com/" className="flex items-center">
                    <img
                        src="/Logo/Lockup.png"
                        className="h-8 mr-3"
                        alt="Flowbite Logo"
                    />
                </a>
                <div className="flex md:order-2">
                    <button
                        type="button"
                        className="text-white bg-violet-700 hover:bg-violet-800 focus:ring-4 focus:outline-none focus:ring-violet-300 font-medium rounded-lg text-sm px-4 py-2 text-center mr-3 md:mr-0 dark:bg-violet-600 dark:hover:bg-violet-700 dark:focus:ring-violet-800"
                    >
                        Launch App
                    </button>
                </div>
            </div>
        </nav>
    );
}
