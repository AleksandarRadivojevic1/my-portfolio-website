import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { Hero } from "@/components/sections/Hero";
import { About } from "@/components/sections/About";
import { Services } from "@/components/sections/Services";
import { Work } from "@/components/sections/Work";
import { Contact } from "@/components/sections/Contact";
import { buildMetadata, type Locale } from "@/lib/seo";

type HomeProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: HomeProps): Promise<Metadata> {
  const { locale } = await params;
  return buildMetadata(locale as Locale, "/");
}

export default async function Home({ params }: HomeProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <main>
      <Hero />
      <About />
      <Services />
      <Work />
      <Contact />
    </main>
  );
}
