"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import Link from "next/link";
import { Login, LoginCurve } from "iconsax-react";

const OCRX_ICON = ({ isLoading }: { isLoading: boolean }) => {
    const Router = useRouter();

    return (
        <div
            className={`${
                isLoading && "animate-bounce"
            } relative flex justify-center items-center h-16 w-16 aspect-square mb-2 p-1 bg-white border border-zinc-200 rounded-lg shadow-2xl dark:bg-zinc-950 dark:border-zinc-700 select-none cursor-pointer`}
            onClick={() => Router.push("/")}
        >
            <img
                src="/Logo/Black.png"
                className="h-2/3 w-2/3 object-contain"
                alt="Foorsa Logo"
            />
        </div>
    );
};
export default function LoginPage() {
    return (
        <section className="w-full h-auto">
            <div className="flex flex-col items-center justify-center p-5 mx-auto md:h-screen lg:py-0">
                <OCRX_ICON isLoading={false} />
                <div className="p-5 flex flex-col justify-center items-center w-full max-w-lg overflow-hidden">
                    <div className="p-6 space-y-4 md:space-y-6 sm:p-8 w-full">
                        <h1 className="text-2xl text-center font-bold leading-tight tracking-tight text-zinc-900 md:text-2xl dark:text-white">
                            Sign in to your account
                        </h1>
                        <form
                            className="space-y-4 md:space-y-6"
                            action="#"
                            autoComplete="off"
                            onSubmit={(e) => {
                                e.preventDefault();
                                console.log(e.target);
                                toast.success(
                                    "Hang tight ! You can still use the alpha for now.",
                                    {
                                        icon: "👋",
                                        duration: 5000,
                                    }
                                );
                            }}
                        >
                            <div>
                                <label
                                    htmlFor="email"
                                    className="block mb-2 text-sm font-medium text-zinc-900 dark:text-white"
                                >
                                    Your email
                                </label>
                                <input
                                    type="email"
                                    name="email"
                                    id="email"
                                    className="bg-zinc-50 border border-zinc-300 text-zinc-900 text-sm rounded-lg focus:ring-purple-500 focus:border-purple-500 block w-full p-2.5 dark:bg-zinc-950 dark:border-zinc-600 dark:placeholder-zinc-400 dark:text-white dark:focus:ring-purple-500 dark:focus:border-purple-500"
                                    placeholder="name@foorsa.ma"
                                    required={false}
                                    autoComplete={"off"}
                                />
                            </div>
                            <div>
                                <label
                                    htmlFor="password"
                                    className="block mb-2 text-sm font-medium text-zinc-900 dark:text-white"
                                >
                                    Password
                                </label>
                                <input
                                    type="password"
                                    name="password"
                                    id="password"
                                    placeholder="••••••••"
                                    className="bg-zinc-50 border border-zinc-300 text-zinc-900 text-sm rounded-lg focus:ring-purple-500 focus:border-purple-500 block w-full p-2.5 dark:bg-zinc-950 dark:border-zinc-600 dark:placeholder-zinc-400 dark:text-white dark:focus:ring-purple-500 dark:focus:border-purple-500"
                                    required={false}
                                    autoComplete={"off"}
                                />
                            </div>
                            <div className="flex items-center justify-between">
                                <div className="flex items-start">
                                    <div className="flex items-center h-5">
                                        <input
                                            id="remember"
                                            aria-describedby="remember"
                                            type="checkbox"
                                            className="w-4 h-4 text-purple-600 bg-gray-100 border-gray-300 rounded focus:ring-purple-500 dark:focus:ring-purple-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                                            required={false}
                                        />
                                    </div>

                                    <div className="ml-3 text-sm">
                                        <label
                                            htmlFor="remember"
                                            className="text-zinc-500 dark:text-zinc-300"
                                        >
                                            Remember me
                                        </label>
                                    </div>
                                </div>
                                <a className="text-sm font-medium text-zinc-500 hover:underline dark:text-zinc-300 cursor-pointer">
                                    Forgot password?
                                </a>
                            </div>
                            <button
                                type="submit"
                                className="inline-flex justify-center items-center gap-2  focus:outline-none w-full text-white bg-purple-700 hover:bg-purple-800 focus:ring-4 focus:ring-purple-300 font-medium rounded-lg text-sm px-5 py-2.5 mb-2 dark:bg-purple-600 dark:hover:bg-purple-700 dark:focus:ring-purple-900"
                            >
                                Sign in
                                <LoginCurve
                                    color="currentColor"
                                    variant="Bulk"
                                />
                            </button>
                            <p className="text-sm font-light text-zinc-500 dark:text-zinc-400">
                                Don’t have an account yet?{" "}
                                <Link
                                    href={"/auth/sign-up"}
                                    className="font-medium text-purple-600 hover:underline dark:text-purple-500"
                                >
                                    Sign up
                                </Link>
                            </p>
                        </form>
                    </div>
                </div>
            </div>
        </section>
    );
}
