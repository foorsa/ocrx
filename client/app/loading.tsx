"use client";

import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import React, { useState, useEffect } from "react";
import Logo from "@/public/Logo/Black.png";

export default function LoadingPage() {
	return (
		<AnimatePresence mode="wait">
			<motion.div
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				exit={{ opacity: 0 }}
				transition={{ duration: 0.5, delay: 0 }}
				className="w-full h-screen fixed top-0 left-0 min-h-screen min-w-full bg-zinc-50 dark:bg-black flex items-center justify-center select-none pointer-events-none"
			>
				{/* Bottom Center - Wide sky Gradient */}
				{/* Division for Blurry Elements */}

				<motion.div className="relative w-auto h-16 p-4 flex flex-col items-center justify-center aspect-square">
					<div className="Container absolute w-full h-full top-0 left-0 animate-spin-bg z-10"></div>
					<div className="z-20">
						<Image
							src={Logo}
							alt="Logo"
							width={100}
							height={100}
							className="object-contain h-full w-full z-20"
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
