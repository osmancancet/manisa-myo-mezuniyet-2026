/** @type {import('next').NextConfig} */
const nextConfig = {
  // Statik dışa aktarım: "npm run build" -> out/ klasörü (her yere yüklenebilir)
  output: "export",
  images: { unoptimized: true },
  trailingSlash: true,
};

export default nextConfig;
