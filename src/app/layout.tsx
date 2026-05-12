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
  metadataBase: new URL("https://cap-exray.vercel.app"),
  title: "CapExray | Audit your AI tool spend",
  description:
    "Free audit for Cursor, ChatGPT, Claude, GitHub Copilot & more. Find out if you're overpaying for AI subscriptions. No signup required.",
  openGraph: {
    title: "CapExray | Free AI Spend Audit",
    description:
      "Find instant savings on your AI tool stack. Built for startup founders and engineering managers.",
    type: "website",
    url: "https://cap-exray.vercel.app",
    siteName: "CapExray",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "CapExray AI Spend Audit",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "CapExray | Free AI Spend Audit",
    description:
      "Find instant savings on your AI tool stack. Built for startup founders and engineering managers.",
    images: ["/og-image.png"],
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
      data-scroll-behavior="smooth"
      className={`${inter.variable} ${jetbrainsMono.variable} dark h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <TooltipProvider>{children}</TooltipProvider>
      </body>
    </html>
  );
}
