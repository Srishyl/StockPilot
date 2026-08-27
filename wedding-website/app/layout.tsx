import type { Metadata, Viewport } from "next";
import { Cinzel, Cormorant_Garamond, Italiana, Playfair_Display, Montserrat } from "next/font/google";
import "./globals.css";

const cinzel = Cinzel({
  subsets: ["latin"],
  variable: "--font-cinzel",
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  variable: "--font-cormorant",
  weight: ["300", "400", "500", "600", "700"],
  style: ["normal", "italic"],
  display: "swap",
});

const italiana = Italiana({
  subsets: ["latin"],
  variable: "--font-italiana",
  weight: ["400"],
  display: "swap",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
  display: "swap",
});

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
  weight: ["300", "400", "500", "600"],
  display: "swap",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#F4E3DD",
};

export const metadata: Metadata = {
  title: "Rohan & Ananya | Wedding Invitation",
  description: "Join us in celebrating the wedding of Rohan and Ananya. An intimate royal Indian celebration.",
  keywords: ["Wedding Invitation", "Rohan and Ananya", "Indian Wedding", "Luxury Wedding Invitation"],
  openGraph: {
    title: "Rohan & Ananya | Wedding Invitation",
    description: "Together with our families, we invite you to celebrate our union.",
    images: [{ url: "/images/couple.jpg", width: 1200, height: 800, alt: "Rohan & Ananya" }],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${cinzel.variable} ${cormorant.variable} ${italiana.variable} ${playfair.variable} ${montserrat.variable} h-full scroll-smooth`}
    >
      <body className="min-h-full bg-[#F4E3DD] text-[#1a0f0a] font-serif antialiased selection:bg-[#9a7b3a]/20 selection:text-[#8F3914]">
        {children}
      </body>
    </html>
  );
}
