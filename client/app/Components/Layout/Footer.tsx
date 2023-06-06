import React from "react";

export default function Footer() {
    return (
        <footer className="relative bottom-0 left-0 w-screen p-4 bg-white md:flex md:items-center md:justify-center md:p-6 dark:bg-[#161e2d] text-[#161e2d] dark:text-violet-100">
            <span className="text-sm sm:text-center">
                © 2023{" "}
                <a href="https://flowbite.com/" className="hover:underline">
                    Foorsa Consulting™
                </a>{" "}
                All Rights Reserved.
            </span>
        </footer>
    );
}
