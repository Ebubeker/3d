import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { siteGraph, OG_IMAGES } from "@/lib/seo/schema";

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
    default: "Virtual Sampling & Tech Pack Services | virtuality.fashion",
    template: "%s | virtuality.fashion"
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
  authors: [{ name: "virtuality.fashion" }],
  creator: "virtuality.fashion",
  publisher: "virtuality.fashion",
  metadataBase: new URL("https://virtuality.fashion"),
  alternates: {
    canonical: "https://virtuality.fashion",
    types: {
      "application/rss+xml": "https://virtuality.fashion/blog/rss.xml"
    }
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
    siteName: "virtuality.fashion",
    title: "Virtual Sampling & Tech Pack Services | virtuality.fashion",
    description: "Curated marketplace connecting fashion brands with vetted 3D designers and technical developers. Reduce samples by 70%, cut development time in half.",
    images: OG_IMAGES
  },
  twitter: {
    card: "summary_large_image",
    title: "Virtual Sampling & Tech Pack Services | virtuality.fashion",
    description: "Curated marketplace connecting fashion brands with vetted 3D designers and technical developers.",
    images: [OG_IMAGES[0].url]
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
        {/* Google Tag Manager */}
        <script dangerouslySetInnerHTML={{
          __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-TJP2J4L');`
        }} />
        {/* End Google Tag Manager */}

        <meta name="facebook-domain-verification" content="cqcuq60pb501lhb6mcd4ewzpctugen" />
        <meta name="msapplication-TileColor" content="#ffffff" />
        <meta name="msapplication-TileImage" content="/ms-icon-144x144.png" />
        <meta name="msapplication-config" content="/browserconfig.xml" />
        <meta name="theme-color" content="#000000" />

        {/* Site-wide JSON-LD: Organization + WebSite. Page-specific schema
            (Service on /solutions, BlogPosting on individual posts) is added
            in the relevant layouts and references this Organization by @id. */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(siteGraph()) }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {/* Google Tag Manager (noscript) */}
        <noscript><iframe src="https://www.googletagmanager.com/ns.html?id=GTM-TJP2J4L"
        height="0" width="0" style={{display:'none',visibility:'hidden'}}></iframe></noscript>
        {/* End Google Tag Manager (noscript) */}

        {children}
      </body>
    </html>
  );
}
