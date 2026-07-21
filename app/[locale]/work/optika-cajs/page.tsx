import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import { CaseCajs } from '@/components/work/CaseCajs';
import { JsonLd } from '@/components/JsonLd';
import { buildMetadata, breadcrumbJsonLd, caseStudyJsonLd, type Locale } from '@/lib/seo';

type CaseCajsPageProps = {
  params: Promise<{ locale: string }>;
};

const PATH = '/work/optika-cajs';

// No dynamic segment below [locale] here — "work" and "optika-cajs" are
// static path parts. Static generation for both locales is inherited from
// app/[locale]/layout.tsx's generateStaticParams, mirroring how
// app/[locale]/page.tsx (the home page) relies on the same inherited param
// set instead of redeclaring generateStaticParams itself.
export async function generateMetadata({ params }: CaseCajsPageProps): Promise<Metadata> {
  const { locale } = await params;
  return buildMetadata(locale as Locale, PATH);
}

export default async function OptikaCajsPage({ params }: CaseCajsPageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  const project = caseStudyJsonLd(locale as Locale, PATH);

  return (
    <main>
      <JsonLd data={breadcrumbJsonLd(locale as Locale, PATH)} />
      {project && <JsonLd data={project} />}
      <CaseCajs />
    </main>
  );
}
