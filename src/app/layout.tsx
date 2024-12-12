// src/app/layout.tsx
import type { Metadata } from "next";
import "./globals.css";
import Providers from "@/components/Providers";
import TopNav from "@/components/navbar/TopNav";
import AuthWrapper from "@/components/AuthWrapper";

export const metadata: Metadata = {
  title: "Let Us Connect",
  description: "Networking and Collaboration Platform",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body className="bg-gray-100">
        <Providers>
          <AuthWrapper>
            <TopNav />
            <main className="pt-16">{children}</main>
          </AuthWrapper>
        </Providers>
      </body>
    </html>
  );
}
