import { Geist, Geist_Mono } from "next/font/google";
import { cn } from "@/hooks/lib/utils";
import "./globals.css";
import { nastaliq } from "./fonts";
import RootLayoutContent from "../components/RootLayoutContent";
import { UserProvider } from '@/contexts/UserContext';
import { Toaster } from 'react-hot-toast';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "LARGIFY SOLUTIONS",
  description: "Make your life easy in the field of Education",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined"
          rel="stylesheet"
        />
      </head>
      <body
        className={cn(
          geistSans.variable,
          geistMono.variable,
          nastaliq.variable,
          "antialiased bg-gray-50"
        )}
        suppressHydrationWarning
      >
        <UserProvider>
          <RootLayoutContent>{children}</RootLayoutContent>
          <Toaster />
        </UserProvider>
      </body>
    </html>
  );
}
