"use client";

import { useTheme } from "next-themes";
import { useCallback } from "react";
import Particles from "react-particles";
import { loadFull } from "tsparticles";
import Colors from "tailwindcss/colors";

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
            className = "absolute top-0 left-0 h-full max-h-screen w-full overflow-hidden"
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
                            mode: "grab",
                        },
                        resize: true,
                    },
                    modes: {
                        grab: {
                            distance: 200,
                            line_linked: {
                                opacity: 0.5,
                                // colors
                                color: {
                                    value:
                                        theme !== "dark"
                                            ? Colors.blue[500]
                                            : Colors.blue[500],
                                },
                            },
                        },
                    },
                },
                particles: {
                    color: {
                        value:
                            theme !== "dark"
                                ? Colors.blue[500]
                                : Colors.blue[500],
                    },
                    // Shadows
                    shadow: {
                        blur: 100,
                        enable: true,
                        offset: {
                            x: 0,
                            y: 0,
                        },
                        color: {
                            value:
                                theme !== "dark"
                                    ? Colors.blue[50]
                                    : Colors.blue[500],
                        },
                    },
                    links: {
                        enable: false,
                    },
                    collisions: {
                        enable: true,
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
                        value: 20,
                    },
                    opacity: {
                        value: 1,
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
