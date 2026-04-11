import type { NextConfig } from "next";

// Trusted remote origins used across the app
const SUPABASE_HOST = "sqjjnmmivrgloepbilog.supabase.co";

// Build the Content-Security-Policy string
const ContentSecurityPolicy = `
  default-src 'self';
  script-src 'self' 'unsafe-inline' 'unsafe-eval';
  style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
  font-src 'self' https://fonts.gstatic.com;
  img-src 'self' data: blob: https://${SUPABASE_HOST} https://images.pexels.com;
  connect-src 'self' https://${SUPABASE_HOST} wss://${SUPABASE_HOST} https://api.resend.com https://mail.google.com;
  media-src 'self';
  object-src 'none';
  frame-src 'self' https://www.google.com https://maps.google.com;
  frame-ancestors 'self';
  base-uri 'self';
  form-action 'self';
  upgrade-insecure-requests;
`.replace(/\s{2,}/g, " ").trim();

const securityHeaders = [
  // Prevent browsers from guessing MIME types (anti-sniffing)
  { key: "X-Content-Type-Options", value: "nosniff" },
  // Block clickjacking — page cannot be embedded in an iframe anywhere
  { key: "X-Frame-Options", value: "DENY" },
  // Stop browsers leaking the full URL in the Referer header to third parties
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  // Disable access to sensitive browser hardware APIs unless explicitly needed
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), payment=(), usb=()",
  },
  // Enable browser's built-in XSS reflection filter (legacy browsers)
  { key: "X-XSS-Protection", value: "1; mode=block" },
  // HTTP Strict Transport Security — enforce HTTPS for 1 year
  {
    key: "Strict-Transport-Security",
    value: "max-age=31536000; includeSubDomains; preload",
  },
  // The CSP itself
  { key: "Content-Security-Policy", value: ContentSecurityPolicy },
];

const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.pexels.com",
      },
      {
        protocol: "https",
        hostname: SUPABASE_HOST,
      },
    ],
  },
  experimental: {
    serverActions: {
      bodySizeLimit: '10mb',
    },
  },
  async headers() {
    return [
      {
        // Apply security headers to all routes
        source: "/(.*)",
        headers: securityHeaders,
      },
    ];
  },
} satisfies any; // Simplified type to ensure Turbopack/Next.js picks up all properties

export default nextConfig;

