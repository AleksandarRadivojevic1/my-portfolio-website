// Contact-form validation. Pure, framework-free — reused by the server
// action (app/actions/contact.ts) and covered directly by lib/validation.test.ts.

export interface ContactInput {
  name: string;
  email: string;
  message: string;
}

export type ContactErrors = Partial<Record<keyof ContactInput, string>>;

export type ValidateContactResult =
  | { ok: true; data: ContactInput }
  | { ok: false; errors: ContactErrors };

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateContact(input: ContactInput): ValidateContactResult {
  const errors: ContactErrors = {};

  const name = input.name.trim();
  const email = input.email.trim();
  const message = input.message.trim();

  if (name.length < 2) {
    errors.name = 'name_too_short';
  }
  if (!EMAIL_RE.test(email)) {
    errors.email = 'email_invalid';
  }
  if (message.length < 10) {
    errors.message = 'message_too_short';
  }

  if (Object.keys(errors).length > 0) {
    return { ok: false, errors };
  }

  return { ok: true, data: { name, email, message } };
}
