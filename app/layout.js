import { Geist, Geist_Mono } from "next/font/google";

import "./globals.css";
import {
  ClerkProvider,
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
} from "@clerk/nextjs";
import Provider from "./provider";
import Head from "next/head";
import { Toaster } from "sonner";
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Edison",
  description: "Your AI Course Generator",
};

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
      <html lang="en">
        <head>
          <link
            rel="stylesheet"
            href="https://cdn.jsdelivr.net/npm/katex@0.13.11/dist/katex.min.css"
            integrity="sha384-Um5gpz1odJg5Z4HAmzPtgZKdTBHZx16G4ngNlYJzS0HbcG_QeB3hI7M9PiL5k/pW"
            crossOrigin="anonymous"
          />
          <script
            defer
            src="https://cdn.jsdelivr.net/npm/katex@0.13.11/dist/katex.min.js"
            integrity="sha384-SYeS9ww9+zjd6Hj/2hG/gE+Fdo4pA1lGDAI2i+Y1Ld/5hT9f0D78/aCgNtry5ZMs"
            crossOrigin="anonymous"
          ></script>
        </head>
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >
          <Provider>{children}</Provider>
          <Toaster />
        </body>
      </html>
    </ClerkProvider>
  );
}
