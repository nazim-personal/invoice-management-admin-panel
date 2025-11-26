import type { Metadata } from "next";
import { Inter, PT_Sans } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from "@/context/AuthContext";

const fontInter = Inter({
  subsets: ["latin"],
  variable: "--font-headline",
});

const fontPTSans = PT_Sans({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-body",
});

export const metadata: Metadata = {
  title: "Invoice Pilot",
  description: "Your modern business management solution.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(
          "min-h-screen bg-background font-body antialiased",
          fontInter.variable,
          fontPTSans.variable
        )}
      >
        <AuthProvider>
          {children}
          <Toaster />
        </AuthProvider>
      </body>
    </html>
  );
}
