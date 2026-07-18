import type { Metadata } from "next";
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
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
