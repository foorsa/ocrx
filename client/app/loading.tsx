"use client";

import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import React from "react";
import Logo from "@/public/Logo/Black.png";

export default function LoadingPage() {
	return (
		<AnimatePresence mode="wait">
			<motion.div
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				exit={{ opacity: 0 }}
				transition={{ duration: 0.5, delay: 0 }}
				className="fixed top-0 left-0 flex items-center justify-center w-full h-screen min-w-full min-h-screen pointer-events-none select-none bg-zinc-50 dark:bg-black"
			>
				<motion.div className="relative flex flex-col items-center justify-center w-auto h-16 p-4 aspect-square">
					<div className="absolute top-0 left-0 z-10 w-full h-full Container animate-spin-bg"></div>
					<div className="z-20">
						<Image
							src={Logo}
							alt="Logo"
							width={100}
							height={100}
							className="z-20 object-contain w-full h-full"
							priority={true}
							placeholder="blur"
							quality={100}
						/>
					</div>
				</motion.div>
			</motion.div>
		</AnimatePresence>
	);
}
