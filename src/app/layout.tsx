import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { QueryProvider } from "@/providers/query-provider";
import { AuthProvider } from "@/providers/auth-provider";

const inter = Inter({ subsets: ["latin"] });

// layout.tsx (Next.js App Router)
import "./globals.css";
import ReactQueryProvider from "../providers/ReactQueryProvider";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="galaxy-background">
        <ReactQueryProvider>{children}</ReactQueryProvider>
      </body>
    </html>
  );
}
