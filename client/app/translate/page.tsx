"use client";

import React from "react";
import Image from "next/image";
import Background from "@/app/Components/A. Background";
import Link from "next/link";
import AppHeader from "./Layout/A. App Header";
import { LinkSquare } from "iconsax-react";

export default function Home() {
    // Dropdown Menu Logic
    const [dropdownOpen, setDropdownOpen] = React.useState(false);
    const toggle = () => setDropdownOpen(!dropdownOpen);

    return (
        <>
            <AppHeader />
            <div className="relative flex-1 h-full w-full min-w-full flex text-center flex-col justify-center items-center p-5">
                <div className="relative flex justify-center items-center h-16 w-16 aspect-square mb-10 p-1 bg-white border border-gray-200 rounded-lg shadow-2xl dark:bg-gray-800 dark:border-gray-700 select-none  animate-bounce">
                    <img
                        src="/Logo/Gradient.png"
                        className="h-2/3 w-2/3 object-fill"
                        alt="Foorsa Logo"
                    />
                </div>
            </div>
        </>
    );
}
