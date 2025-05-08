import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	/* config options here */
	typescript: {
		ignoreBuildErrors: true,
	},
	eslint: {
		ignoreDuringBuilds: true,
	},
	images: {
		deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
		imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
		remotePatterns: [
			{
				protocol: "https",
				hostname: "randomuser.me",
				port: "",
				pathname: "/**",
			},
			{
				protocol: "https",
				hostname: "ui-avatars.com",
				port: "",
				pathname: "/**",
			},
			// google images
			{
				protocol: "https",
				hostname: "lh3.googleusercontent.com",
				port: "",
				pathname: "/**",
      },
      {
				protocol: "https",
				hostname: "lh4.googleusercontent.com",
				port: "",
				pathname: "/**",
			},
		],
	},
};

export default nextConfig;
