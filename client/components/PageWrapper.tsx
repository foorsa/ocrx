"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useRouter, usePathname } from "next/navigation";
import { PropsWithChildren, useRef, useContext } from "react";
import { LayoutRouterContext } from "next/dist/shared/lib/app-router-context";

export default function Page({ children }: { children: React.ReactNode }) {
    const Pathname = usePathname();

    return (
        <AnimatePresence mode="sync">
            <motion.div
                initial="initial"
                animate="animate"
                exit="exit"
                key={Pathname}
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
                className="h-full min-w-full w-full flex flex-col justify-between items-center min-h-screen"
            >
                <FrozenRouter>{children}</FrozenRouter>
            </motion.div>
        </AnimatePresence>
    );
}

/// layout.tsx
function FrozenRouter(props: PropsWithChildren<{}>) {
    const context = useContext(LayoutRouterContext);
    const frozen = useRef(context).current;

    return (
        <LayoutRouterContext.Provider value={frozen}>
            {props.children}
        </LayoutRouterContext.Provider>
    );
}
