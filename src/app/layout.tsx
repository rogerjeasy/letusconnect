import "./globals.css"; // Ensure global CSS is imported
import { Metadata } from "next";
import { ReactNode, Suspense } from "react";
import { ThemeProvider } from "next-themes";
import Providers from "@/components/Providers";
import TopNav from "@/components/navbar/TopNav";
import AuthWrapper from "@/components/AuthWrapper";
import Footer from "@/components/homepage/Footer";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { NotificationProvider } from "@/services/NotificationService";
import ErrorBoundary from "@/components/loadingfallback/ErrorBoundary";
import LoadingFallback from "@/components/loadingfallback/LoadingFallback";
import QueryClientWrapper from "@/components/QueryClientWrapper";
import React from "react";

// Lazy load the AI Assistant component
const AIAssistant = React.lazy(() => import("@/components/aiassistant/ChatGPT"));

export const metadata: Metadata = {
  title: "Let Us Connect",
  description: "Networking and Collaboration Platform",
  keywords: "networking, collaboration, platform, community",
  authors: [{ name: "Let Us Connect Team" }],
  icons: {
    icon: "/favicon.ico",
  },
};

interface RootLayoutProps {
  children: ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body className="min-h-screen bg-background text-foreground">
        <ErrorBoundary>
          <QueryClientWrapper>
            <ThemeProvider
              attribute="class"
              defaultTheme="system"
              enableSystem
              disableTransitionOnChange
            >
              <Providers>
                <NotificationProvider>
                  <AuthWrapper>
                    <div className="relative flex min-h-screen flex-col">
                      <TopNav />
                      <main className="flex-1 pt-16 md:pt-20 lg:pt-16">
                        <ErrorBoundary>
                          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                            {children}
                          </div>
                        </ErrorBoundary>
                      </main>
                      <Suspense fallback={<LoadingFallback />}>
                        <AIAssistant />
                      </Suspense>
                      <Footer />
                    </div>
                  </AuthWrapper>
                </NotificationProvider>
                <ToastContainer
                  position="top-center"
                  autoClose={10000}
                  hideProgressBar={false}
                  newestOnTop
                  closeOnClick
                  rtl={false}
                  pauseOnFocusLoss
                  draggable
                  pauseOnHover
                  theme="colored"
                  className="mt-16 md:mt-20 lg:mt-16"
                />
              </Providers>
            </ThemeProvider>
          </QueryClientWrapper>
        </ErrorBoundary>
      </body>
    </html>
  );
}
