import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import { CaseSkedio } from '@/components/work/CaseSkedio';
import { buildMetadata, type Locale } from '@/lib/seo';

type CaseSkedioPageProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: CaseSkedioPageProps): Promise<Metadata> {
  const { locale } = await params;
  return buildMetadata(locale as Locale, '/work/skedio');
}

export default async function SkedioPage({ params }: CaseSkedioPageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <main>
      <CaseSkedio />
    </main>
  );
}
