import type { Metadata } from "next";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import Script from "next/script";
import { display, mono, sans } from "@/lib/fonts";
import { routing } from "@/i18n/routing";
import { SmoothScroll } from "@/components/providers/SmoothScroll";
import { Nav } from "@/components/layout/Nav";
import { TelemetryBar } from "@/components/layout/TelemetryBar";
import { Footer } from "@/components/layout/Footer";
import "../globals.css";

export const metadata: Metadata = {
  title: "alexrad.dev",
  description: "Portfolio of Alex Rad",
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  setRequestLocale(locale);

  return (
    <html lang={locale} className={`${display.variable} ${mono.variable} ${sans.variable}`}>
      <body>
        <Script id="js-class" strategy="beforeInteractive">
          {`document.documentElement.classList.add('js')`}
        </Script>
        <NextIntlClientProvider>
          <SmoothScroll>
            <Nav locale={locale} />
            {children}
            <TelemetryBar locale={locale} />
            <Footer />
          </SmoothScroll>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
