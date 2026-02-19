import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider, QueryProvider, AuthProvider } from "@/components/providers";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { isClerkConfigured } from "@/lib/auth-config";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://kuromanga.me"),
  title: {
    default: "KanaVerse - Baca Komik Manga, Manhwa, Manhua Sub Indo Gratis",
    template: "%s | KanaVerse",
  },
  description:
    "Baca komik manga, manhwa, manhua subtitle Indonesia secara gratis. Koleksi terlengkap dengan update terbaru setiap hari di kuromanga.me",
  applicationName: "KanaVerse",
  keywords: [
    "baca komik online",
    "baca manga online",
    "manhwa sub indo",
    "manhua sub indo",
    "komik gratis",
    "manga indonesia",
    "komik indonesia",
    "baca manga gratis",
    "manga online gratis",
    "nonton anime sub indo",
    "anime subtitle indonesia",
    "kuromanga",
    "KanaVerse",
  ],
  authors: [{ name: "KanaVerse", url: "https://kuromanga.me" }],
  creator: "KanaVerse",
  publisher: "KanaVerse",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "id_ID",
    url: "https://kuromanga.me",
    siteName: "KanaVerse",
    title: "KanaVerse - Baca Komik Manga, Manhwa, Manhua Sub Indo Gratis",
    description:
      "Baca komik manga, manhwa, manhua subtitle Indonesia secara gratis. Koleksi terlengkap dengan update terbaru setiap hari.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "KanaVerse - Baca Komik Online Gratis",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "KanaVerse - Baca Komik Manga, Manhwa, Manhua Sub Indo Gratis",
    description:
      "Baca komik manga, manhwa, manhua subtitle Indonesia secara gratis. Koleksi terlengkap dengan update terbaru setiap hari.",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
};

// Static structured data for SEO - safe to inline as it contains no user input
const structuredData = JSON.stringify({
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      "@id": "https://kuromanga.me/#website",
      url: "https://kuromanga.me",
      name: "KanaVerse",
      description: "Baca komik manga, manhwa, manhua subtitle Indonesia secara gratis",
      publisher: {
        "@id": "https://kuromanga.me/#organization",
      },
      potentialAction: {
        "@type": "SearchAction",
        target: {
          "@type": "EntryPoint",
          urlTemplate: "https://kuromanga.me/komik/search?query={search_term_string}",
        },
        "query-input": "required name=search_term_string",
      },
      inLanguage: "id-ID",
    },
    {
      "@type": "Organization",
      "@id": "https://kuromanga.me/#organization",
      name: "KanaVerse",
      url: "https://kuromanga.me",
      logo: {
        "@type": "ImageObject",
        url: "https://kuromanga.me/logo.svg",
      },
    },
  ],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const clerkEnabled = isClerkConfigured();

  return (
    <html lang="id" suppressHydrationWarning>
      <head>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: structuredData }} />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} flex min-h-screen flex-col antialiased`}
      >
        <AuthProvider clerkEnabled={clerkEnabled}>
          <ThemeProvider>
            <QueryProvider>
              <Navbar clerkEnabled={clerkEnabled} />
              <main className="flex-1">{children}</main>
              <Footer />
            </QueryProvider>
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
    }
        
