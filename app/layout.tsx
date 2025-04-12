import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "@rainbow-me/rainbowkit/styles.css";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ScaffoldEthAppWithProviders } from "@/providers/ScaffoldEthAppWithProviders";
const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Xeenux Investment Platform",
  description: "Decentralized Investment Platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // const headersObj = headers();
  // const cookies = headersObj.get("cookie");
  const cookies = null;
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="dark">
          <TooltipProvider>
            {/* <main className="min-h-screen p-2 overflow-x-hidden">
              <ContextProvider cookies={cookies}>{children}</ContextProvider>
            </main>
            <Footer />
            <Toaster /> */}
            <ScaffoldEthAppWithProviders>{children}</ScaffoldEthAppWithProviders>
          </TooltipProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
