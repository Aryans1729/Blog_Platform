 /** @type {import('next').NextConfig} */

// Next.js configuration file
// This file controls how Next.js builds and serves your application
// It's like the "settings panel" for your frontend framework

const nextConfig = {
    // Enable experimental features for Next.js 14
    experimental: {
      // Server actions allow you to run server-side code directly from components
      // This is cutting-edge React technology that simplifies form handling
      serverActions: true,
    },
  
    // Environment variables that should be exposed to the browser
    // These will be available in your React components via process.env
    env: {
      NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api',
    },
  
    // Configure how images are optimized
    // Next.js automatically optimizes images for better performance
    images: {
      // Define external domains that are allowed to serve images
      // This is a security feature to prevent unauthorized image loading
      domains: [
        'localhost',
        'example.com', // Add your production domain here
      ],
      
      // Configure image formats and quality
      formats: ['image/webp', 'image/avif'],
      deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
      imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    },
  
    // Webpack configuration customization
    // This allows you to modify how Next.js bundles your JavaScript
    webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
      // Add custom webpack rules or plugins here if needed
      
      // Example: Add support for importing SVG files as React components
      config.module.rules.push({
        test: /\.svg$/,
        use: ['@svgr/webpack']
      });
  
      return config;
    },
  
    // Configure redirects for better SEO and user experience
    // These run before rendering and can redirect users to different URLs
    async redirects() {
      return [
        // Example: Redirect old blog URLs to new format
        {
          source: '/blog/:slug',
          destination: '/posts/:slug',
          permanent: true, // This is a 301 redirect for SEO
        },
      ];
    },
  
    // Configure URL rewrites for cleaner URLs
    // These don't change the URL but change what content is served
    async rewrites() {
      return [
        // Example: Make API calls appear to come from the same domain
        // This can help avoid CORS issues in some configurations
        {
          source: '/api/:path*',
          destination: `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/:path*`,
        },
      ];
    },
  
    // Configure headers for security and performance
    async headers() {
      return [
        {
          // Apply security headers to all routes
          source: '/(.*)',
          headers: [
            {
              key: 'X-Frame-Options',
              value: 'DENY', // Prevent embedding in iframes
            },
            {
              key: 'X-Content-Type-Options',
              value: 'nosniff', // Prevent MIME type sniffing
            },
            {
              key: 'Referrer-Policy',
              value: 'origin-when-cross-origin', // Control referrer information
            },
          ],
        },
      ];
    },
  
    // Configure which files should be treated as pages
    // This affects how Next.js discovers and builds your routes
    pageExtensions: ['ts', 'tsx', 'js', 'jsx'],
  
    // Output configuration for different deployment targets
    output: 'standalone', // Optimizes for serverless deployment
  
    // Configure build optimizations
    swcMinify: true, // Use SWC for faster minification (Rust-based)
    
    // Enable React strict mode for better development experience
    // This helps catch common React mistakes early
    reactStrictMode: true,
  
    // Configure how static files are served
    // This affects performance and caching behavior
    poweredByHeader: false, // Remove "X-Powered-By: Next.js" header for security
  
    // TypeScript configuration
    typescript: {
      // Whether to run type checking during build
      // Set to false to skip type checking during build (faster but less safe)
      ignoreBuildErrors: false,
    },
  
    // ESLint configuration
    eslint: {
      // Directories to lint during build
      dirs: ['src', 'pages', 'components', 'lib', 'utils'],
    },
  };
  
  module.exports = nextConfig;