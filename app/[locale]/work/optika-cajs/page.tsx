import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { CaseCajs } from '@/components/work/CaseCajs';

type CaseCajsPageProps = {
  params: Promise<{ locale: string }>;
};

// No dynamic segment below [locale] here — "work" and "optika-cajs" are
// static path parts. Static generation for both locales is inherited from
// app/[locale]/layout.tsx's generateStaticParams, mirroring how
// app/[locale]/page.tsx (the home page) relies on the same inherited param
// set instead of redeclaring generateStaticParams itself.
export async function generateMetadata({ params }: CaseCajsPageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'caseCajs.meta' });

  return {
    title: t('title'),
    description: t('description'),
  };
}

export default async function OptikaCajsPage({ params }: CaseCajsPageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <main>
      <CaseCajs />
    </main>
  );
}
