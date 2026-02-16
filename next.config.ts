import type {NextConfig} from "next";

const nextConfig: NextConfig = {
    async redirects() {
        return [
            {
                source: '/coast-fire',
                destination: '/',
                permanent: true,
            },
        ];
    },
};

export default nextConfig;
