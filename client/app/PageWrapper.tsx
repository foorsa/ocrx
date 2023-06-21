"use client";

import { AnimatePresence, motion } from "framer-motion";
import React from "react";

export default function PageWrapper({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <AnimatePresence mode="wait">
            <motion.div
                initial="initial"
                animate="animate"
                exit="exit"
                variants={{
                    initial: {
                        opacity: 0,
                        y: 15,
                    },
                    animate: {
                        opacity: 1,
                        y: 0,
                    },
                    exit: {
                        opacity: 0,
                        y: 15,
                    },
                }}
                transition={{
                    type: "spring",
                    stiffness: 260,
                    damping: 20,
                }}
                className="min-h-screen h-auto min-w-full w-full flex flex-col justify-between items-center"
            >
                {children}
            </motion.div>
        </AnimatePresence>
    );
}
