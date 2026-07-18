import { setRequestLocale } from "next-intl/server";
import { Hero } from "@/components/sections/Hero";

type HomeProps = {
  params: Promise<{ locale: string }>;
};

export default async function Home({ params }: HomeProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <main>
      <Hero />
      {/* Tasks 8–11 append About / Services / Work / Contact sections here. */}
    </main>
  );
}
