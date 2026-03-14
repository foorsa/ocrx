/**
 * @type {import('next').NextConfig}
 */
module.exports = {
	webpack: (config) => {
		config.resolve.alias.canvas = false;
		return config;
	},
	images: {
		domains: [
			"images.unsplash.com",
			"maps.googleapis.com",
			"openweathermap.org",
		],
		remotePatterns: [
			{
				protocol: "https",
				hostname: "**",
			},
		],
	},
};
