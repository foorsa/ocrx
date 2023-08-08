"use client";

import { useAppSelector } from "@/redux/hooks";
import { useRouter } from "next/navigation";
import React from "react";

const OCRX_ICON = ({ isLoading }: { isLoading: boolean }) => {
    const Router = useRouter();

    return (
        <div
            className={`${
                isLoading && "animate-bounce"
            } relative flex justify-center items-center h-16 w-16 aspect-square mb-10 p-1 bg-white border border-zinc-200 rounded-lg shadow-2xl dark:bg-zinc-950 dark:border-zinc-700 select-none`}
        >
            <img
                src="/Logo/Black.png"
                className="h-2/3 w-2/3 object-contain"
                alt="Foorsa Logo"
                onClick={() => Router.push("/")}
            />
        </div>
    );
};

export default function Layout({ children }: { children: React.ReactNode }) {
    const Session = useAppSelector((state) => state.session);

    return (
        <div className="relative flex-1 h-full w-full min-h-screen min-w-full flex text-center flex-col justify-start items-center p-5">
            <OCRX_ICON isLoading={Session.isLoading} />
            {children}
        </div>
    );
}
