import { setRequestLocale } from "next-intl/server";
import { Hero } from "@/components/sections/Hero";
import { About } from "@/components/sections/About";

type HomeProps = {
  params: Promise<{ locale: string }>;
};

export default async function Home({ params }: HomeProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <main>
      <Hero />
      <About />
      {/* Tasks 9–11 append Services / Work / Contact sections here. */}
    </main>
  );
}
