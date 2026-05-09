import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import { TooltipProvider } from "@/components/ui/tooltip";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "CapExray | Ex-ray your AI spend",
  description:
    "Stop the bleeding. Our clinical-grade diagnostic engine identifies inefficiencies in your AI stack with surgical precision.",
  openGraph: {
    title: "CapExray | Ex-ray your AI spend",
    description:
      "Free AI spend diagnostic. Find the leaks in your GPU clusters and API calls.",
    type: "website",
    url: "https://capexray.app",
    siteName: "CapExray",
  },
  twitter: {
    card: "summary_large_image",
    title: "CapExray | Ex-ray your AI spend",
    description:
      "Free AI spend diagnostic. Find the leaks in your GPU clusters and API calls.",
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
      className={`${inter.variable} ${jetbrainsMono.variable} dark h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <TooltipProvider>{children}</TooltipProvider>
      </body>
    </html>
  );
}
