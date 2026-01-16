import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Virtual Sampling & Tech Pack Services | Virtuality Fashion",
    template: "%s | Virtuality Fashion"
  },
  description: "Curated marketplace connecting fashion brands with vetted 3D designers and technical developers. Virtual sampling services, tech pack creation, CLO3D & Browzwear expertise. Reduce samples by 70%, cut development time in half, and lower costs without compromising quality.",
  keywords: [
    "virtual sampling services",
    "tech pack services",
    "CLO3D services",
    "Browzwear services",
    "3D fashion designers",
    "freelance technical designers",
    "digital fashion production",
    "virtual garment development",
    "reduce physical samples",
    "faster time to market",
    "lower development costs",
    "sustainable fashion development"
  ],
  authors: [{ name: "Virtuality Fashion" }],
  creator: "Virtuality Fashion",
  publisher: "Virtuality Fashion",
  metadataBase: new URL("https://virtuality.fashion"),
  alternates: {
    canonical: "https://virtuality.fashion"
  },
  icons: {
    icon: [
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-96x96.png", sizes: "96x96", type: "image/png" },
    ],
    apple: [
      { url: "/apple-icon-57x57.png", sizes: "57x57", type: "image/png" },
      { url: "/apple-icon-60x60.png", sizes: "60x60", type: "image/png" },
      { url: "/apple-icon-72x72.png", sizes: "72x72", type: "image/png" },
      { url: "/apple-icon-76x76.png", sizes: "76x76", type: "image/png" },
      { url: "/apple-icon-114x114.png", sizes: "114x114", type: "image/png" },
      { url: "/apple-icon-120x120.png", sizes: "120x120", type: "image/png" },
      { url: "/apple-icon-144x144.png", sizes: "144x144", type: "image/png" },
      { url: "/apple-icon-152x152.png", sizes: "152x152", type: "image/png" },
      { url: "/apple-icon-180x180.png", sizes: "180x180", type: "image/png" },
    ],
    other: [
      { rel: "apple-touch-icon-precomposed", url: "/apple-icon-precomposed.png" },
    ],
  },
  manifest: "/manifest.json",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://virtuality.fashion",
    siteName: "Virtuality Fashion",
    title: "Virtual Sampling & Tech Pack Services | Virtuality Fashion",
    description: "Curated marketplace connecting fashion brands with vetted 3D designers and technical developers. Reduce samples by 70%, cut development time in half.",
    images: [
      {
        url: "/images/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Virtuality Fashion - Fashion Development Marketplace"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "Virtual Sampling & Tech Pack Services | Virtuality Fashion",
    description: "Curated marketplace connecting fashion brands with vetted 3D designers and technical developers.",
    images: ["/images/og-image.jpg"]
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1
    }
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <meta name="msapplication-TileColor" content="#ffffff" />
        <meta name="msapplication-TileImage" content="/ms-icon-144x144.png" />
        <meta name="msapplication-config" content="/browserconfig.xml" />
        <meta name="theme-color" content="#000000" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
