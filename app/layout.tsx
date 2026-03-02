import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AppSidebar } from "@/components/layout/AppSidebar";
import { TooltipProvider } from "@/components/ui/tooltip";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "RBQM Agent · Veridian Therapeutics",
  description: "Agentic Risk-Based Quality Monitoring powered by Cloudera Data Platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        <TooltipProvider>
          <AppSidebar />
          <div className="pl-64 min-h-screen">
            <main className="p-6 max-w-[1400px]">
              {children}
            </main>
          </div>
        </TooltipProvider>
      </body>
    </html>
  );
}
