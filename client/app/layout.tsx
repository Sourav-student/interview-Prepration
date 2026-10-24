import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";
import { AuthProvider } from "@/AuthContext";
import Footer from "@/components/Footer";
import { Toaster } from "react-hot-toast";
import { MotionConfig } from "framer-motion";
import { ThemeProvider } from "@/components/ThemeProvider";

export const metadata: Metadata = {
    title: "SkillSpring | Learn, practice, and grow",
  description: "Build skills, find focused practice, and plan your next step with tools for learning and career growth.",
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased" data-scroll-behavior="smooth">
      {/* Browser extensions may add attributes to <body> before hydration. */}
      <body className="min-h-full flex flex-col" suppressHydrationWarning>
        <ThemeProvider>
          <AuthProvider>
            <MotionConfig reducedMotion="user">
              <Header />
              {children}
              <Footer />
              <Toaster position="top-right" toastOptions={{ duration: 4000 }} />
            </MotionConfig>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
