import { useTranslations } from 'next-intl';
import { Tag } from '@/components/ui/Tag';
import { BracketButton } from '@/components/ui/BracketButton';
import { MonoLabel } from '@/components/ui/MonoLabel';
import { CAJS } from '@/content/work';

export function CaseHero() {
  const t = useTranslations('caseCajs.hero');

  return (
    <div className="flex flex-col gap-8">
      <MonoLabel>{t('kicker')}</MonoLabel>
      <h1 className="font-display text-4xl leading-[0.95] text-fg sm:text-6xl">{t('title')}</h1>
      <p className="max-w-2xl text-base text-muted sm:text-lg">{t('tagline')}</p>
      <div className="flex flex-wrap gap-2">
        {CAJS.stack.map((tech) => (
          <Tag key={tech}>{tech}</Tag>
        ))}
      </div>
      <div>
        <BracketButton href={CAJS.live} target="_blank" rel="noopener noreferrer">
          {t('liveLabel')}
        </BracketButton>
      </div>
    </div>
  );
}
