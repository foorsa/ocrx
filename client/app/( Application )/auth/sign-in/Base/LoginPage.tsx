"use client";

import React, { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import Link from "next/link";
import { Eye, EyeSlash, LoginCurve } from "iconsax-react";
import { authErrorCodes } from "../../error/errors/authErrors";
import { SignInResponse } from "next-auth/react/types";
import { signIn } from "next-auth/react";

const OCRX_ICON = ({ isLoading }: { isLoading: boolean }) => {
	const Router = useRouter();

	return (
		<div
			className={`${
				isLoading && "animate-bounce"
			} relative flex justify-center items-center h-16 w-16 aspect-square mb-2 p-1 bg-white border border-zinc-200 rounded-xl shadow-2xl dark:bg-zinc-950 dark:border-zinc-700 select-none cursor-pointer`}
			onClick={() => Router.push("/")}
		>
			<img
				src="/Logo/Black.png"
				className="object-contain w-2/3 h-2/3"
				alt="Foorsa Logo"
			/>
		</div>
	);
};
export default function LoginPage() {
	const router = useRouter();

	// Refs
	const emailRef = useRef<HTMLInputElement>(null);
	const passwordRef = useRef<HTMLInputElement>(null);
	const rememberRef = useRef<HTMLInputElement>(null);

	// UI States
	const [isLoading, setLoading] = useState(false);

	// Show/hide password
	const [showPassword, setShowPassword] = useState(false);

	// Handle Login if Pressed Enter
	const handleKeyDown = (e: React.KeyboardEvent<HTMLFormElement>) => {
		if (e.key === "Enter") {
			handleLogin(e);
		}
	};

	// Handle login
	const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		// Disable button
		setLoading(true);

		const email = emailRef.current?.value;
		const password = passwordRef.current?.value;
		const remember = rememberRef.current?.checked;

		if (!email || !password) {
			setLoading(false);
			if (!email) {
				emailRef.current?.focus();
				toast.error("Please enter your email.", {
					icon: "📧",
					duration: 1000,
				});
			} else if (!password) {
				passwordRef.current?.focus();
				toast.error("Please enter your password.", {
					icon: "🔑",
					duration: 1000,
				});
			}
			return false;
		}

		// Sign in
		const result: SignInResponse = (await signIn("credentials", {
			redirect: false,
			email,
			password,
			callbackUrl: "/app",
		})) as SignInResponse;

		if (
			result.ok &&
			result.url &&
			typeof result.url === "string" &&
			result.url.length > 0 &&
			result.status === 200 &&
			!result.error
		) {
			// Redirect to dashboard
			router.push("/app");
		} else {
			setLoading(false);

			const errorMessage =
				result.error === "CredentialsSignin"
					? "Invalid email or password."
					: authErrorCodes[
							result.error as keyof typeof authErrorCodes
					  ] ?? "Something went wrong.";
			toast.error(result.error, {
				icon: "❌",
				duration: 1000,
			});
		}
	};

	return (
		<section className="z-10 flex flex-col items-center justify-center flex-1 w-full min-h-full">
			<div className="flex flex-col items-center justify-center h-auto gap-3 p-5 mx-auto lg:py-0">
				<OCRX_ICON isLoading={false} />
				<div className="flex flex-col items-center justify-center w-full max-w-lg gap-5">
					<h1 className="my-5 text-xl font-bold leading-tight tracking-tight text-center text-zinc-900 md:text-4xl dark:text-white">
						Sign in to your account
					</h1>

					<div className="inline-flex items-center justify-center w-full">
						<hr className="w-full h-px my-2 border-0 bg-zinc-300 dark:bg-zinc-600" />
						<span className="absolute px-3 font-medium transition-all duration-500 -translate-x-1/2 bg-white text-zinc-900 left-1/2 dark:text-white dark:bg-black">
							or
						</span>
					</div>
					<form
						className="flex flex-col items-center justify-center w-full gap-5 mb-5"
						action="#"
						autoComplete="on"
						onSubmit={handleLogin}
						onKeyDown={handleKeyDown}
					>
						<div className="w-full">
							<label
								htmlFor="email"
								className="block mb-2 text-sm font-medium text-zinc-900 dark:text-white"
							>
								Username/Email
							</label>
							<input
								type="email"
								name="email"
								id="email"
								ref={emailRef}
								className="bg-zinc-50 border border-zinc-300 text-zinc-900 text-sm rounded-3xl focus:ring-green-500 focus:border-green-500 block w-full py-2.5 px-3.5 dark:bg-zinc-950 dark:border-zinc-600 dark:placeholder-zinc-400 dark:text-white dark:focus:ring-green-500 dark:focus:border-green-500"
								placeholder="name@foorsa.ma"
								required={false}
								autoComplete={"email"}
							/>
						</div>
						<div className="w-full">
							<label
								htmlFor="password"
								className="block mb-2 text-sm font-medium text-zinc-900 dark:text-white"
							>
								Password
							</label>
							<div className="relative flex items-center justify-center w-full gap-3">
								<input
									type={showPassword ? "text" : "password"}
									name="password"
									id="password"
									ref={passwordRef}
									className="bg-zinc-50 border border-zinc-300 text-zinc-900 text-sm rounded-3xl focus:ring-green-500 focus:border-green-500 block w-full py-2.5 px-3.5 dark:bg-zinc-950 dark:border-zinc-600 dark:placeholder-zinc-400 dark:text-white dark:focus:ring-green-500 dark:focus:border-green-500"
									required={false}
									placeholder="••••••••"
									autoComplete={"current-password"}
								/>
								<button
									type="button"
									className="absolute top-0 right-0 h-full px-5 text-zinc-400 dark:text-zinc-600 focus:outline-none"
									aria-label="Toggle password visibility"
									onClick={() =>
										setShowPassword(!showPassword)
									}
									title={
										showPassword
											? "Hide password"
											: "Show password"
									}
								>
									{showPassword ? (
										<EyeSlash
											color="currentColor"
											variant="Bulk"
											className="w-6 h-6"
										/>
									) : (
										<Eye
											color="currentColor"
											variant="Bulk"
											className="w-6 h-6"
										/>
									)}
								</button>
							</div>
						</div>
						<div className="flex items-center justify-between w-full">
							<div className="flex items-start">
								<div className="flex items-center h-5">
									<input
										id="remember"
										aria-describedby="remember"
										type="checkbox"
										className="w-4 h-4 text-green-600 rounded bg-zinc-100 border-zinc-300 focus:ring-green-500 dark:focus:ring-green-600 dark:ring-offset-zinc-950 focus:ring-2 dark:bg-zinc-900 dark:border-zinc-950"
										required={false}
										ref={rememberRef}
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
						</div>
						{isLoading ? (
							<button
								type="button"
								className="inline-flex justify-center items-center gap-3 focus:outline-none w-full text-white bg-green-500 hover:bg-green-600 focus:ring-4 focus:ring-green-300 font-medium rounded-3xl text-sm px-5 py-2.5 mb-2 dark:bg-green-500 dark:hover:bg-green-600 dark:focus:ring-green-900"
								disabled={true}
							>
								<div role="status">
									<svg
										aria-hidden="true"
										className="w-6 h-6 mr-2 text-green-500 animate-spin fill-green-50"
										viewBox="0 0 100 101"
										fill="none"
										xmlns="http://www.w3.org/2000/svg"
									>
										<path
											d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
											fill="currentColor"
										/>
										<path
											d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
											fill="currentFill"
										/>
									</svg>
									<span className="sr-only">Loading...</span>
								</div>
							</button>
						) : (
							<button
								type="submit"
								className="inline-flex justify-center items-center gap-3  focus:outline-none w-full text-white bg-green-500 hover:bg-green-600 focus:ring-4 focus:ring-green-300 font-medium rounded-3xl text-sm px-5 py-2.5 mb-2 dark:bg-green-500 dark:hover:bg-green-600 dark:focus:ring-green-900"
							>
								Sign in
								<LoginCurve
									color="currentColor"
									variant="Bulk"
								/>
							</button>
						)}
						<p className="text-sm font-light text-center text-zinc-500 dark:text-zinc-400">
							Don’t have an account yet?{" "}
							<Link
								href={"/auth/sign-up"}
								className="font-medium text-green-600 hover:underline dark:text-green-500"
							>
								Sign up
							</Link>
						</p>
					</form>
				</div>
			</div>
		</section>
	);
}
