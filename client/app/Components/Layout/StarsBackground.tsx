"use client";

import { useTheme } from "next-themes";
import { useCallback } from "react";
import Particles from "react-particles";
import { loadFull } from "tsparticles";

const StarsBackground = () => {
    const particlesInit = useCallback(async (engine: any) => {
        console.log(engine);
        await loadFull(engine);
    }, []);

    const particlesLoaded = useCallback(async (container: any) => {
        await console.log(container);
    }, []);

    const { theme } = useTheme();

    return (
        <Particles
            id="tsparticles"
            init={particlesInit}
            loaded={particlesLoaded}
            options={{
                background: {
                    color: {
                        value: "transparent",
                    },
                },
                fpsLimit: 120,
                interactivity: {
                    events: {
                        onHover: {
                            enable: true,
                            mode: "repulse",
                        },
                        onDiv: {
                            mode: "grab",
                            enable: true,
                            elementId: "Background",
                        },
                        resize: true,
                    },
                    modes: {
                        repulse: {
                            distance: 10,
                            duration: 1,
                        },
                    },
                },
                particles: {
                    color: {
                        value: theme === "dark" ? "#ffffff" : "#000000",
                    },
                    links: {
                        enable: false,
                    },
                    collisions: {
                        enable: false,
                    },
                    move: {
                        direction: "outside",
                        enable: true,
                        outModes: {
                            default: "bounce",
                        },
                        random: true,
                        speed: 0.25,
                        straight: false,
                    },
                    number: {
                        density: {
                            enable: true,
                            area: 1000,
                        },
                        value: 40,
                    },
                    opacity: {
                        value: 0.25,
                    },
                    shape: {
                        type: "circle",
                    },
                    size: {
                        value: { min: 0.5, max: 3 },
                    },
                },
                detectRetina: true,
            }}
        />
    );
};

export default StarsBackground;
