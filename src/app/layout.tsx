import type { Metadata } from "next";
import "./globals.css";
import Providers from "@/components/Providers";
import TopNav from "@/components/navbar/TopNav";
import AuthWrapper from "@/components/AuthWrapper";
import Footer from "@/components/homepage/Footer";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { NotificationProvider } from "@/services/NotificationService";
import AIAssistant from "@/components/aiassistant/ChatGPT";

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
          <NotificationProvider>
            <AuthWrapper>
              <TopNav />
              <main className="pt-16">{children}</main>
              <AIAssistant />
              <Footer />
            </AuthWrapper>
          </NotificationProvider>
          <ToastContainer position="top-center" autoClose={10000} />
        </Providers>
      </body>
    </html>
  );
}
