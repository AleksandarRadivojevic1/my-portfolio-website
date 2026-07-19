'use server';

import { Resend } from 'resend';
import { SITE } from '@/content/site';
import { validateContact, type ContactErrors, type ContactInput } from '@/lib/validation';

export type ContactErrorCode = 'validation' | 'unavailable' | 'failed';

export type ContactActionState =
  | { ok: true }
  | { ok: false; error: ContactErrorCode | ''; fieldErrors?: ContactErrors };

// Sandbox sender that works without a verified domain on Resend. Swap for a
// verified `@alexrad.dev` address once the domain is added in the Resend
// dashboard (see task-11-report.md "concerns").
const FROM_ADDRESS = 'Alexrad.dev Contact <onboarding@resend.dev>';

function readContactInput(formData: FormData): ContactInput {
  return {
    name: String(formData.get('name') ?? ''),
    email: String(formData.get('email') ?? ''),
    message: String(formData.get('message') ?? ''),
  };
}

export async function submitContact(
  _prevState: ContactActionState,
  formData: FormData,
): Promise<ContactActionState> {
  // Honeypot: a decoy field real visitors never see or fill (hidden in
  // ContactForm via sr-only + aria-hidden + tabIndex=-1). Bots that
  // autofill every input in the DOM trip this. Report success without
  // sending, so the bot gets no signal to retry with different input.
  const honeypot = String(formData.get('company') ?? '').trim();
  if (honeypot.length > 0) {
    return { ok: true };
  }

  const result = validateContact(readContactInput(formData));
  if (!result.ok) {
    return { ok: false, error: 'validation', fieldErrors: result.errors };
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    // No key configured (local dev, or not yet provisioned in this
    // deployment). Fail gracefully instead of throwing — the build and the
    // rest of the app must not depend on this env var being present.
    return { ok: false, error: 'unavailable' };
  }

  const to = process.env.CONTACT_TO || SITE.email;

  try {
    const resend = new Resend(apiKey);
    const { error } = await resend.emails.send({
      from: FROM_ADDRESS,
      to,
      replyTo: result.data.email,
      subject: `New message from ${result.data.name} via alexrad.dev`,
      text: `Name: ${result.data.name}\nEmail: ${result.data.email}\n\n${result.data.message}`,
    });

    if (error) {
      return { ok: false, error: 'failed' };
    }

    return { ok: true };
  } catch {
    return { ok: false, error: 'failed' };
  }
}
