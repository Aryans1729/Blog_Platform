import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { AuthProvider } from './lib/auth';
import Header from './components/Header';
import { Toaster } from 'react-hot-toast';

// Font optimization using Next.js built-in font loading
// This ensures our font loads efficiently and prevents layout shift
// Inter is a modern, highly readable font designed specifically for interfaces
const inter = Inter({ 
  subsets: ['latin'],
  display: 'swap', 
  variable: '--font-inter' // CSS variable for the font
});

// Metadata configuration for SEO and social sharing
// This information appears in search results and when sharing links
export const metadata: Metadata = {
  title: {
    // Template allows pages to extend the title: "Page Title | Personal Blog Platform"
    template: '%s | Personal Blog Platform',
    // Default title when no page-specific title is provided
    default: 'Personal Blog Platform'
  },
  description: 'A modern, secure blog platform built with Next.js and TypeScript. Share your thoughts, discover new perspectives, and engage with a community of writers.',
  
  // Keywords help search engines understand our content
  keywords: ['blog', 'writing', 'community', 'articles', 'personal blog', 'Next.js'],
  
  // Author information
  authors: [{ name: 'Personal Blog Platform' }],
  
  // Open Graph metadata for social media sharing (Facebook, LinkedIn, etc.)
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://yourblogplatform.com', // Replace with your actual domain
    title: 'Personal Blog Platform',
    description: 'A modern, secure blog platform for sharing your thoughts and stories.',
    siteName: 'Personal Blog Platform',
    // You would add an image here for social media previews
    // images: [{ url: '/og-image.jpg', width: 1200, height: 630 }],
  },
  
  // Twitter Card metadata for Twitter sharing
  twitter: {
    card: 'summary_large_image',
    title: 'Personal Blog Platform',
    description: 'A modern, secure blog platform for sharing your thoughts and stories.',
    // creator: '@yourtwitterhandle', // Add your Twitter handle
    // images: ['/og-image.jpg'],
  },
  
  // Robots metadata for search engine crawling
  robots: {
    index: true, // Allow search engines to index our site
    follow: true, // Allow search engines to follow our links
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  
  // Verification for search engines (you would add these when deploying)
  // verification: {
  //   google: 'your-google-verification-code',
  //   yandex: 'your-yandex-verification-code',
  // },
  
  // Canonical URL to prevent duplicate content issues
  alternates: {
    canonical: 'https://yourblogplatform.com', // Replace with your actual domain
  },
  
  // Favicon and app icons
  icons: {
    icon: '/logo.jpeg',
    shortcut: '/logo.jpeg',
    apple: '/logo.jpeg',
  },
  
  // Manifest for PWA capabilities (Progressive Web App)
  manifest: '/site.webmanifest',
};

// Root Layout Component
// This component wraps every page in our application
// It's like the "frame" that surrounds all our content
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable}>
      <head>
        {/* Additional meta tags for enhanced functionality */}
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#3b82f6" />
        
        {/* Preload critical resources for better performance */}
        <link rel="preload" href="/fonts/inter-var.woff2" as="font" type="font/woff2" crossOrigin="" />
        
        {/* DNS prefetch for external resources we might use */}
        <link rel="dns-prefetch" href="//fonts.googleapis.com" />
        
        {/* Structured data for search engines (JSON-LD) */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'WebSite',
              name: 'Personal Blog Platform',
              description: 'A modern, secure blog platform for sharing thoughts and stories.',
              url: 'https://yourblogplatform.com', // Replace with your actual domain
              potentialAction: {
                '@type': 'SearchAction',
                target: 'https://yourblogplatform.com/search?q={search_term_string}',
                'query-input': 'required name=search_term_string',
              },
            }),
          }}
        />
      </head>
      
      <body className={`${inter.className} min-h-screen bg-gray-50`}>
        {/* Skip link for accessibility - allows keyboard users to skip navigation */}
        <a 
          href="#main-content" 
          className="skip-link sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 z-50 bg-blue-600 text-white px-4 py-2 rounded-md"
        >
          Skip to main content
        </a>
        
        {/* Authentication Provider wraps our entire application */}
        {/* This makes authentication state available to all components */}
        <AuthProvider>
          {/* Page structure with semantic HTML for accessibility */}
          <div className="flex flex-col min-h-screen">
            {/* Header navigation - consistent across all pages */}
            <Header />
            
            {/* Main content area where individual pages will render */}
            <main 
              id="main-content" 
              className="flex-grow"
              role="main"
              aria-label="Main content"
            >
              {/* This is where our page components will be rendered */}
              {/* The 'children' prop contains the content of each specific page */}
              <div className="fade-in">
                {children}
              </div>
            </main>
            
            {/* Footer - consistent across all pages */}
            <footer 
              className="bg-white border-t border-gray-200 mt-auto"
              role="contentinfo"
              aria-label="Site footer"
            >
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {/* Company/Platform Information */}
                  <div>
                    <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider">
                      Platform
                    </h3>
                    <p className="mt-4 text-sm text-gray-600">
                      A modern blog platform for sharing your thoughts and connecting with readers worldwide.
                    </p>
                  </div>
                  
                  {/* Quick Links */}
                  <div>
                    <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider">
                      Quick Links
                    </h3>
                    <ul className="mt-4 space-y-2">
                      <li>
                        <a href="/" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
                          Home
                        </a>
                      </li>
                      <li>
                        <a href="/about" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
                          About
                        </a>
                      </li>
                      <li>
                        <a href="/privacy" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
                          Privacy Policy
                        </a>
                      </li>
                      <li>
                        <a href="/terms" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
                          Terms of Service
                        </a>
                      </li>
                    </ul>
                  </div>
                  
                  {/* Contact Information */}
                  <div>
                    <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider">
                      Connect
                    </h3>
                    <ul className="mt-4 space-y-2">
                      <li>
                        <a href="mailto:support@yourblogplatform.com" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
                          Support
                        </a>
                      </li>
                      <li>
                        <a href="/contact" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
                          Contact Us
                        </a>
                      </li>
                      {/* Social media links would go here */}
                    </ul>
                  </div>
                </div>
                
                {/* Copyright and legal information */}
                <div className="mt-8 pt-8 border-t border-gray-200">
                  <div className="flex flex-col md:flex-row justify-between items-center">
                    <p className="text-sm text-gray-600">
                      &copy; {new Date().getFullYear()} Personal Blog Platform. All rights reserved.
                    </p>
                    <p className="text-sm text-gray-600 mt-2 md:mt-0">
                      Built with Next.js, TypeScript, and ❤️
                    </p>
                  </div>
                </div>
              </div>
            </footer>
          </div>
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#363636',
                color: '#fff',
                borderRadius: '10px',
                padding: '16px',
                fontSize: '14px',
                fontWeight: '500',
                boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
              },
              success: {
                style: {
                  background: '#10b981',
                },
                iconTheme: {
                  primary: '#ffffff',
                  secondary: '#10b981',
                },
              },
              error: {
                style: {
                  background: '#ef4444',
                },
                iconTheme: {
                  primary: '#ffffff',
                  secondary: '#ef4444',
                },
              },
              loading: {
                style: {
                  background: '#3b82f6',
                },
              },
            }}
          />
        </AuthProvider>
        
        {/* Analytics and tracking scripts would go here in production */}
        {/* For example, Google Analytics, Hotjar, etc. */}
        {process.env.NODE_ENV === 'production' && (
          <>
            {/* Example: Google Analytics (replace with your tracking ID) */}
            {/* <Script
              src="https://www.googletagmanager.com/gtag/js?id=GA_TRACKING_ID"
              strategy="afterInteractive"
            />
            <Script id="google-analytics" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', 'GA_TRACKING_ID');
              `}
            </Script> */}
          </>
        )}
      </body>
    </html>
  );
}