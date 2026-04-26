import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Mibin Thomas | E-commerce & Marketing Executive",
  description: "Portfolio of Mibin Thomas, a result-oriented professional with a strong background in e-commerce, digital marketing, and AI data annotation.",
  keywords: ["Mibin Thomas", "E-commerce", "Digital Marketing", "AI Data Associate", "Lidar Annotation", "Portfolio"],
};

import WaterEffect from "@/components/WaterEffect";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${outfit.variable}`}>
        <WaterEffect />
        {children}
      </body>
    </html>
  );
}
