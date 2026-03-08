import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
	//ignore linting on build
	typescript: {
		ignoreBuildErrors: true,
	},
};

export default nextConfig;
