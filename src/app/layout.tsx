import type { Metadata } from "next";
import "./globals.css";
import AIChatAssistant from "@/components/ai-chat-assistant";
import { ThemeProvider } from "@/components/theme-provider";

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
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&family=JetBrains+Mono:wght@400;500;600&display=swap"
          rel="stylesheet"
        />
        <script src="/mascots/exode-mascot.js" defer></script>
      </head>
      <body className="font-body antialiased selection:bg-accent selection:text-accent-foreground">
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
          {children}
          <AIChatAssistant />
        </ThemeProvider>
      </body>
    </html>
  );
}
