// Services FAQ. Structural ids only — question/answer copy lives in
// messages/*.json, keyed by these ids (e.g. "faq.social.question").

export interface FaqEntry {
  id: 'social' | 'outdated' | 'duration';
}

export const FAQ: FaqEntry[] = [{ id: 'social' }, { id: 'outdated' }, { id: 'duration' }];
