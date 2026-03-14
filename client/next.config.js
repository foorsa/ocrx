/**
 * @type {import('next').NextConfig}
 */
module.exports = {
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
