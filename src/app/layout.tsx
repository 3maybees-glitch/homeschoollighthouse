import type { Metadata, Viewport } from "next";
import { Analytics } from "@vercel/analytics/react";
import { Geist_Mono, Plus_Jakarta_Sans, Source_Serif_4 } from "next/font/google";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { PwaInstallPrompt } from "@/components/pwa/install-prompt";
import "./globals.css";

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const sourceSerif = Source_Serif_4({
  variable: "--font-source-serif",
  subsets: ["latin"],
  weight: ["400", "600", "700"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Homeschool Lighthouse",
    template: "%s | Homeschool Lighthouse",
  },
  description:
    "Follow the light to your family's perfect homeschool path. Search 16,000+ curricula, classes, co-ops, and trusted resources.",
  metadataBase: new URL("https://homeschoollighthouse.com"),
  applicationName: "Homeschool Lighthouse",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Lighthouse",
  },
  formatDetection: {
    telephone: false,
  },
  icons: {
    icon: [
      { url: "/favicon.png", sizes: "192x192", type: "image/png" },
      { url: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icons/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [{ url: "/icons/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
  },
  other: {
    "mobile-web-app-capable": "yes",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#001f3f" },
    { media: "(prefers-color-scheme: dark)", color: "#001f3f" },
  ],
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body
        className={`${jakarta.variable} ${sourceSerif.variable} ${geistMono.variable} min-h-screen overflow-x-clip antialiased`}
      >
        <div className="flex min-h-screen min-w-0 flex-col">
          <SiteHeader />
          <main className="min-w-0 flex-1">{children}</main>
          <SiteFooter />
        </div>
        <PwaInstallPrompt />
        <Analytics />
      </body>
    </html>
  );
}
