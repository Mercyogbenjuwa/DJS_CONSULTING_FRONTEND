

import type { Metadata } from "next";
import { Urbanist } from "next/font/google";
import "./globals.css";
import { toast, ToastContainer } from "react-toastify";
import MyApp from "./providers/reduxProvider";
import ReduxProvider from "./providers/reduxProvider";
import ToastProvider from "./providers/toastProvider";
import { useEffect } from "react";



const urbanist = Urbanist({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Digital Tech Blog",
  description: "digitaltech Blog",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <html lang="en">
      <body
        className={`${urbanist.className} ${
          process.env.NODE_ENV === "development" ? "debug-screens" : ""
        }`}
      >
        <ReduxProvider>
          <ToastProvider>
            {children}
            </ToastProvider>
        </ReduxProvider>
      </body>
    </html>
  );
}
