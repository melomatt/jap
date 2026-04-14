import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import ChatWidget from "@/components/ChatWidget";
import CookieConsent from "@/components/CookieConsent";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { LoadingProvider } from "@/components/providers/LoadingProvider";
import { getSiteContent } from "./admin/cms/actions";
import { headers } from "next/headers";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

export async function generateMetadata(): Promise<Metadata> {
  const { data } = await getSiteContent("settings");

  const title = data?.seoTitle || "Justice Advocates & Partners, Inc.";
  const description =
    data?.seoDescription ||
    "Expert legal consulting and advisory services. Justice Advocates & Partners, Inc. – Trusted advisors since 2020.";
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://jap-inc.com";

  return {
    title,
    description,
    metadataBase: new URL(siteUrl),
    openGraph: {
      title,
      description,
      url: siteUrl,
      siteName: "Justice Advocates & Partners, Inc.",
      images: [
        {
          url: "/jap_logo.png",
          width: 800,
          height: 600,
          alt: "JAP Inc. Logo",
        },
      ],
      type: "website",
    },
    twitter: {
      card: "summary",
      title,
      description,
      images: ["/jap_logo.png"],
    },
    icons: {
      icon: "/jap_logo.png",
      shortcut: "/jap_logo.png",
      apple: "/jap_logo.png",
    },
  };
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  // Note: userScalable intentionally not set — allowing zoom is an accessibility requirement
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const headersList = await headers();
  const pathname = headersList.get("x-pathname") || "";

  // Suppress public Navbar and ChatWidget on admin, login, register, and auth routes
  const isPublicShell = !pathname.startsWith("/admin") &&
    !pathname.startsWith("/login") &&
    !pathname.startsWith("/register") &&
    !pathname.startsWith("/auth") &&
    !pathname.startsWith("/pending") &&
    !pathname.startsWith("/diagnostics");

  const { data: navbarData } = isPublicShell
    ? await getSiteContent("navbar")
    : { data: null };

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased text-[15px] selection:bg-blue-500/30 selection:text-blue-900 dark:selection:text-blue-100`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <LoadingProvider>
            {isPublicShell && <Navbar cmsData={navbarData} />}
            <main>{children}</main>
            {isPublicShell && <ChatWidget />}
            <CookieConsent />
          </LoadingProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}