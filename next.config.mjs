/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      {
        source: "/",
        destination: "/home",
        permanent: true,
      },
    ];
  },
  images: {
    domains: ["res.cloudinary.com", "www.example.com", "example.com"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**.res.cloudinary.com",
      },
      {
        protocol: "https",
        hostname: "**.example.com",
      },
      {
        protocol: "http",
        hostname: "**.example.com",
      },
    ],
  },
};

export default nextConfig;
