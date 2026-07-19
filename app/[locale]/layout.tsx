import type { Metadata } from "next";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import Script from "next/script";
import { display, mono, sans } from "@/lib/fonts";
import { routing } from "@/i18n/routing";
import { buildMetadata, personJsonLd, localBusinessJsonLd, type Locale } from "@/lib/seo";
import { JsonLd } from "@/components/JsonLd";
import { SmoothScroll } from "@/components/providers/SmoothScroll";
import { Nav } from "@/components/layout/Nav";
import { TelemetryBar } from "@/components/layout/TelemetryBar";
import { Footer } from "@/components/layout/Footer";
import "../globals.css";

type LocaleLayoutProps = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: LocaleLayoutProps): Promise<Metadata> {
  const { locale } = await params;
  return buildMetadata(locale as Locale, "/");
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({ children, params }: Readonly<LocaleLayoutProps>) {
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
        <JsonLd data={personJsonLd()} />
        <JsonLd data={localBusinessJsonLd()} />
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
