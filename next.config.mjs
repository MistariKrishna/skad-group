/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,

  async redirects() {
    return [
      // Old WordPress jewellery pages → Brands
      { source: "/product-category/:path*", destination: "/brands", permanent: true },
      { source: "/product/:path*", destination: "/brands", permanent: true },
      { source: "/shop", destination: "/brands", permanent: true },

      // Old FMCG education article → Insights
      { source: "/fmcg-education", destination: "/insights", permanent: true },

      // Old Career page → Careers
      { source: "/2936-2", destination: "/careers", permanent: true },
      { source: "/career", destination: "/careers", permanent: true },
    ];
  },
};

export default nextConfig;