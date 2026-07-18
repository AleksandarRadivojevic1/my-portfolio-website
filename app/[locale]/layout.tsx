import type { Metadata } from "next";
import { display, mono, sans } from "@/lib/fonts";
import "../globals.css";

export const metadata: Metadata = {
  title: "alexrad.dev",
  description: "Portfolio of Alex Rad",
};

export default function LocaleLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${display.variable} ${mono.variable} ${sans.variable}`}>
      <body>{children}</body>
    </html>
  );
}
