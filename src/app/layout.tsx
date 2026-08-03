import type { Metadata, Viewport } from "next";
import { Space_Grotesk, Public_Sans, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "@/providers/providers";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  display: "swap",
});

const publicSans = Public_Sans({
  subsets: ["latin"],
  variable: "--font-public-sans",
  display: "swap",
});

const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-plex-mono",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  ),
  title: {
    default: "FixItNow — Your Trusted Home Service Platform",
    template: "%s | FixItNow",
  },
  description:
    "Book verified electricians, plumbers, and home service technicians near you. Transparent pricing, real reviews, and secure payments with FixItNow.",
  keywords: [
    "home services",
    "electrician booking",
    "plumber booking",
    "technician marketplace",
    "FixItNow",
  ],
  openGraph: {
    type: "website",
    title: "FixItNow — Your Trusted Home Service Platform",
    description:
      "Book verified electricians, plumbers, and home service technicians near you.",
    siteName: "FixItNow",
  },
  twitter: {
    card: "summary_large_image",
    title: "FixItNow — Your Trusted Home Service Platform",
    description:
      "Book verified electricians, plumbers, and home service technicians near you.",
  },
  icons: {
    icon: "/favicon.ico",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#F5F6F8" },
    { media: "(prefers-color-scheme: dark)", color: "#14181F" },
  ],
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${spaceGrotesk.variable} ${publicSans.variable} ${plexMono.variable} font-sans antialiased`}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
