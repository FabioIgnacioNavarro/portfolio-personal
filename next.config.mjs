/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Oculta el indicador flotante en bottom-left para que no tape el botón "Inicio" de la barra en pnpm dev
  devIndicators: false,
  images: {
    formats: ['image/avif', 'image/webp'],
  },
};

export default nextConfig;
