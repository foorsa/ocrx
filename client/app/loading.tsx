"use client";

import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import React, { useState, useEffect } from "react";
import Logo from "@/public/Logo/Black.svg";

export default function LoadingPage() {
    const [showLogo, setShowLogo] = useState(false);

    useEffect(() => {
        setShowLogo(true);
    }, []);

    const ContainerVariants: any = {
        visible: {
            width: "100%",
            height: "100%",
            "&::before": {
                transform: "translateX(100%)",
                "&::before": {
                    opacity: 1,
                },
            },
        },
        hidden: {
            width: "150vw",
            height: "150vh",
            "&::before": {
                opacity: 0,
            },
        },
    };

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5, delay: 0 }}
                className="w-full h-screen fixed top-0 left-0 min-h-screen min-w-full bg-zinc-50 dark:bg-black flex items-center justify-center select-none pointer-events-none"
            >
                {/* Bottom Center - Wide emerald Gradient */}
                {/* Division for Blurry Elements */}

                {showLogo && (
                    <motion.div className="relative w-auto h-16 p-4 flex flex-col items-center justify-center aspect-square">
                        <motion.div
                            variants={ContainerVariants}
                            initial="hidden"
                            animate="visible"
                            exit="hidden"
                            transition={{
                                duration: 0.5,
                                type: "tween",
                            }}
                            className="Container absolute w-full h-full top-0 left-0 animate-spin-bg z-10"
                        ></motion.div>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.5, delay: 1 }}
                            className="z-20"
                        >
                            <Image
                                src={Logo}
                                alt="Logo"
                                width={100}
                                height={100}
                                className="object-contain h-full w-full z-20"
                            />
                        </motion.div>
                    </motion.div>
                )}
            </motion.div>
        </AnimatePresence>
    );
}
