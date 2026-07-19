'use client';

import { useActionState } from 'react';
import { useTranslations } from 'next-intl';
import { submitContact, type ContactActionState } from '@/app/actions/contact';
import { SITE } from '@/content/site';

const INITIAL_STATE: ContactActionState = { ok: false, error: '' };

const FIELD_CLASS =
  'border border-line bg-transparent px-4 py-3 text-fg placeholder:text-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg';

const LABEL_CLASS = 'font-mono text-xs uppercase tracking-[0.2em] text-muted';

export function ContactForm() {
  const t = useTranslations('contact');
  const [state, formAction, pending] = useActionState(submitContact, INITIAL_STATE);
  const fieldErrors = state.ok === false ? state.fieldErrors : undefined;

  return (
    <form action={formAction} noValidate className="flex flex-col gap-6">
      <p className="font-mono text-xs uppercase tracking-[0.2em] text-accent">{t('consult')}</p>

      {/* Honeypot: a decoy field real visitors never see or reach. Hidden
          visually (sr-only), removed from the accessibility tree
          (aria-hidden) and the tab order (tabIndex=-1), and excluded from
          autofill — bots that blindly fill every input trip it instead. */}
      <div className="sr-only" aria-hidden="true">
        <label htmlFor="company">{t('form.honeypotLabel')}</label>
        <input id="company" name="company" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="name" className={LABEL_CLASS}>
          {t('form.name')}
        </label>
        <input
          id="name"
          name="name"
          type="text"
          required
          minLength={2}
          autoComplete="name"
          aria-invalid={fieldErrors?.name ? true : undefined}
          className={FIELD_CLASS}
        />
        {fieldErrors?.name && <p className="text-xs text-accent">{t('form.fieldErrors.name')}</p>}
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="email" className={LABEL_CLASS}>
          {t('form.email')}
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          autoComplete="email"
          aria-invalid={fieldErrors?.email ? true : undefined}
          className={FIELD_CLASS}
        />
        {fieldErrors?.email && (
          <p className="text-xs text-accent">{t('form.fieldErrors.email')}</p>
        )}
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="message" className={LABEL_CLASS}>
          {t('form.message')}
        </label>
        <textarea
          id="message"
          name="message"
          required
          minLength={10}
          rows={5}
          placeholder={t('form.messagePlaceholder')}
          aria-invalid={fieldErrors?.message ? true : undefined}
          className={FIELD_CLASS}
        />
        {fieldErrors?.message && (
          <p className="text-xs text-accent">{t('form.fieldErrors.message')}</p>
        )}
      </div>

      <button
        type="submit"
        disabled={pending}
        className="inline-flex w-fit items-center gap-1 border border-line px-6 py-3 font-mono text-sm text-fg transition-colors hover:border-accent hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg disabled:cursor-not-allowed disabled:opacity-50"
      >
        {pending ? t('form.sending') : t('form.submit')}
      </button>

      <div aria-live="polite" className="min-h-[1.5em]">
        {state.ok && <p className="text-sm text-accent">{t('form.success')}</p>}
        {state.ok === false && state.error && (
          <p className="text-sm text-accent">{t(`form.errors.${state.error}`)}</p>
        )}
      </div>

      <div className="flex flex-wrap gap-x-6 gap-y-2 border-t border-line pt-6 font-mono text-sm text-muted">
        <a href={`mailto:${SITE.email}`} className="transition-colors hover:text-accent">
          {t('emailLabel')}: {SITE.email}
        </a>
        <a
          href={`tel:${SITE.phone.replace(/\s+/g, '')}`}
          className="transition-colors hover:text-accent"
        >
          {t('phoneLabel')}: {SITE.phone}
        </a>
      </div>
    </form>
  );
}
