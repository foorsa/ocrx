"use client";

import { useTheme } from "next-themes";
import { useCallback, useEffect, useState } from "react";
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

	const [particleColor, setParticleColor] = useState<string>(
		theme !== "dark" ? Colors.zinc[200] : Colors.zinc[800]
	);

	useEffect(() => {
		setParticleColor(
			theme !== "dark" ? Colors.zinc[200] : Colors.zinc[800]
		);
	}, [theme]);

	return (
		<Particles
			id="tsparticles"
			className="absolute top-0 left-0 w-full h-full max-h-screen overflow-hidden"
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
									value: Colors.zinc[500],
								},
							},
						},
					},
				},
				particles: {
					color: {
						value: Colors.zinc[500],
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
							value: Colors.zinc[500],
						},
					},
					links: {
						enable: false,
					},
					collisions: {
						enable: true,
					},
					move: {
						direction: "inside",
						enable: true,
						outModes: {
							default: "destroy",
						},
						random: true,
						speed: 0.5,
						straight: true,
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
