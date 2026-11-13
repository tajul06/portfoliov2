import type { Metadata } from "next";
import dynamic from "next/dynamic";
import Script from "next/script";
import { Plus_Jakarta_Sans, JetBrains_Mono } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import { SpeedInsights } from "@vercel/speed-insights/next";
import "./globals.css";

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-heading",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-mono",
  display: "swap",
});

// Lazy-load AI Chat Assistant and 3D Mascot off the critical path for instant initial page loads
const AIChatAssistant = dynamic(() => import("@/components/ai-chat-assistant"), {
  ssr: false,
});

export const metadata: Metadata = {
  title: "Md Tajul Islam | Portfolio",
  description: "Software developer specializing in ML/AI, web systems, Flask apps, and RAG systems",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${plusJakartaSans.variable} ${jetbrainsMono.variable}`}
    >
      <head>
        <Script src="/mascots/exode-mascot.js" strategy="lazyOnload" />
      </head>
      <body className="font-body antialiased selection:bg-accent selection:text-accent-foreground">
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
          {children}
          <AIChatAssistant />
        </ThemeProvider>
        <SpeedInsights />
      </body>
    </html>
  );
}
