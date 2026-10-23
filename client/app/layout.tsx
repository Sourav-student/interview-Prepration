import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";
import { AuthProvider } from "@/AuthContext";
import Footer from "@/components/Footer";
import { Toaster } from "react-hot-toast";

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
    <html lang="en" className="h-full antialiased">
      {/* Browser extensions may add attributes to <body> before hydration. */}
      <body className="min-h-full flex flex-col" suppressHydrationWarning>
        <AuthProvider>
          <Header />
          {children}
          <Footer />
          <Toaster/>
        </AuthProvider>
      </body>
    </html>
  );
}
