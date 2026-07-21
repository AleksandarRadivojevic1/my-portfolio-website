import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import { CaseSkedio } from '@/components/work/CaseSkedio';
import { JsonLd } from '@/components/JsonLd';
import { buildMetadata, breadcrumbJsonLd, caseStudyJsonLd, type Locale } from '@/lib/seo';

const PATH = '/work/skedio';

type CaseSkedioPageProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: CaseSkedioPageProps): Promise<Metadata> {
  const { locale } = await params;
  return buildMetadata(locale as Locale, PATH);
}

export default async function SkedioPage({ params }: CaseSkedioPageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  const project = caseStudyJsonLd(locale as Locale, PATH);

  return (
    <main>
      <JsonLd data={breadcrumbJsonLd(locale as Locale, PATH)} />
      {project && <JsonLd data={project} />}
      <CaseSkedio />
    </main>
  );
}
