"use client";

import React from "react";
import StarsBackground from "./Layout/StarsBackground";

import Colors from "tailwindcss/colors";
import Particles from "./Layout/Particles";

interface Props {
	Variant?: "Home" | "App";
}

export default function Background({ Variant }: Props) {
	return (
		<div
			className="absolute top-0 bottom-0 left-0 right-0 w-screen h-full min-h-screen bg-white bg-opacity-0 dark:bg-black dark:bg-opacity-60 -z-50"
			id="Background"
		>
			{Variant == "Home" ? (
				<>
					{/* <StarsBackground /> */}
					{/* <Particles /> */}
					{/* Bottom Center - Wide sky Gradient */}
					{/* Division for Blurry Elements */}
					<div className="absolute top-0 bottom-0 left-0 right-0 w-full h-full max-h-screen min-h-screen overflow-hidden -z-50 opacity-60 dark:opacity-60">
						<div className="absolute bottom-0 w-3/5 -translate-x-1/2 rounded-full h-3/5 left-1/2 blur-3xl bg-gradient-to-b from-transparent via-sky-800 to-sky-400 -z-40 dark:from-transparent dark:via-sky-800 dark:to-sky-400"></div>

						{/* Bottom Center - Light sky */}
						<div className="absolute bottom-0 w-1/5 -translate-x-1/2 rounded-full h-2/5 left-1/2 blur-3xl bg-gradient-to-b from-transparent via-sky-500 to-sky-50 -z-50 dark:from-transparent dark:via-sky-500 dark:to-sky-50"></div>

						{/* Bottom Center - Middle White */}
						<div className="absolute w-1/5 -translate-x-1/2 -translate-y-full rounded-full h-2/5 -bottom-1/2 left-1/2 blur-3xl bg-gradient-to-b from-transparent via-zinc-200 to-zinc-50 -z-40 dark:from-transparent dark:via-zinc-200 dark:to-zinc-50"></div>

						{/* Top Middle Left */}
						<div className="absolute w-1/2 rotate-45 -translate-x-1/2 bg-green-500 h-1/5 top-1/4 left-2/4 blur-3xl bg-opacity-60 -z-50 dark:bg-opacity-80 dark:bg-green-500"></div>

						{/* Bottom Right */}
						<div className="absolute right-0 w-1/2 h-1/5 -bottom-0 blur-3xl bg-sky-500 bg-opacity-60 -z-0 dark:bg-opacity-80 dark:bg-sky-500"></div>
					</div>
				</>
			) : (
				<>
					<div className="absolute top-0 bottom-0 left-0 right-0 w-full h-full max-h-screen min-h-screen -z-50 opacity-60 dark:opacity-100">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width="1440"
							height="450"
							className="absolute right-0 -top-1/4 -left-1/5 -z-50 dark:opacity-100 blur-2xl"
						>
							<defs>
								<linearGradient
									id="a"
									x1="19.609%"
									x2="50%"
									y1="14.544%"
									y2="100%"
								>
									<stop
										offset="0%"
										stop-color={Colors.green[500]}
									/>
									<stop
										offset="100%"
										stop-color={Colors.green[500]}
										stop-opacity="0"
									/>
								</linearGradient>
								<linearGradient
									id="b"
									x1="50%"
									x2="19.609%"
									y1="100%"
									y2="14.544%"
								>
									<stop
										offset="0%"
										stop-color={Colors.sky[500]}
									/>
									<stop
										offset="100%"
										stop-color={Colors.green[500]}
										stop-opacity="0"
									/>
								</linearGradient>
							</defs>
							<g fill="none" fill-rule="evenodd">
								<path
									fill="url(#a)"
									d="m473 23 461 369-284 58z"
								/>
								<path
									fill="url(#b)"
									d="m259 0 461 369-284 58z"
								/>
							</g>
						</svg>
					</div>
				</>
			)}
		</div>
	);
}
