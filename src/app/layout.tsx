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
  title: "Alfonsus Ardani",
  description: "Frontend developer building tools and helping community to empower developers.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <script id="umami-script" defer src="https://analytics.arinji.com/script.js" data-website-id="d22e04da-dabc-40da-9ced-ddc457aa3ab9"></script>
      </head>
      <body
        className={`${ geistSans.variable } ${ geistMono.variable } antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
