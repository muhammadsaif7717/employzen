 
 
 
 
import type { Metadata } from "next";
import { Geist, Geist_Mono, Inter, Plus_Jakarta_Sans } from "next/font/google";
import "../styles/globals.css";
import Navbar from "@/components/shared/Navbar";
import { cn } from "@/lib/utils";
import ThemeProvider from "@/contexts/ThemeProvider";
import { AuthProvider } from "@/contexts/AuthContext";
import Footer from "@/components/shared/Footer";

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' });

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-heading",
  weight: ["400", "500", "600", "700", "800"],
});

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Employzen | Discover, Apply, Get Hired",
  description:
    "Employzen is a smart job portal platform where candidates can find jobs, employers can hire talent, and admins manage the system efficiently. Build your career, connect with opportunities, and get hired بسهولة.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      data-scroll-behavior="smooth"
      className={cn("h-full", "antialiased", geistSans.variable, geistMono.variable, "font-sans", inter.variable, plusJakartaSans.variable)}
    >
      <body className="min-h-full flex flex-col">
        <ThemeProvider>
          <AuthProvider>
            <Navbar />
            {children}
            <Footer/>
          </AuthProvider>
        </ThemeProvider>
      </body>

    </html>
  );
}

