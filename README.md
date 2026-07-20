# alexrad.dev

My personal portfolio: a bilingual (Serbian and English) single-page site with a warm, CRT-inspired look, an interactive desktop-OS work section, and dedicated case-study pages. I'm a full-stack developer based in Leskovac, Serbia.

Live at [alexrad.dev](https://alexrad.dev).

## What's inside

- **Bilingual.** Serbian (the default) and English, routed and localized with next-intl.
- **An interactive "desktop OS" work section**, with draggable folders and windows that open into project details.
- **Case studies** for Optika Cajs and Skedio, each with its own route and metadata.
- **A WebGL boot sequence**, a CRT-style intro scene built with React Three Fiber.
- **A warm CRT theme**: one amber accent on warm near-black, Bodoni and JetBrains Mono, with film-grain and scan-sweep effects that ease off when you ask for reduced motion.
- **Tests** for the components and routing, running under Vitest.

## Tech stack

| Area | Choice |
| --- | --- |
| Framework | [Next.js 16](https://nextjs.org) (App Router) with React 19 |
| Language | TypeScript |
| Styling | Tailwind CSS v4 |
| i18n | next-intl (locales: `sr`, `en`; default `sr`) |
| Motion | Framer Motion with Lenis for smooth scroll |
| 3D / WebGL | three.js via React Three Fiber, drei, postprocessing |
| Testing | Vitest with Testing Library and jsdom |
| Hosting | Vercel |

## Getting started

Requires Node 20 or newer.

```bash
npm install
npm run dev      # start the dev server at http://localhost:3000
```

The default locale is Serbian, so the dev server opens on `/sr`. English lives at `/en`.

### Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the development server |
| `npm run build` | Production build |
| `npm run start` | Serve the production build |
| `npm run lint` | Run ESLint |
| `npm test` | Run the Vitest suite |

## Project structure

```
app/[locale]/           Localized routes (home + /work/<case-study> pages)
components/              UI, sections, work/desktop, webgl, layout, providers
content/                Structural facts as typed data (site, services, faq, work)
messages/{en,sr}.json   Human-readable copy, keyed to the content data
i18n/                   next-intl routing, request config, navigation helpers
lib/                    SEO/metadata helpers, utilities
proxy.ts                next-intl locale middleware
```

### Content and copy

Structure and copy are kept separate on purpose:

- **`content/*.ts`** holds the structural facts: ids, stats, tech stacks, URLs, ordering.
- **`messages/{en,sr}.json`** holds the human-readable copy (taglines, descriptions, feature and outcome text), keyed to the ids in `content`.

Keeping them apart lets the layout stay data-driven and keeps the two languages in step. The message files sit at exact key parity.

## Testing

```bash
npm test
```

The suite covers i18n routing, content invariants, and rendering of the case-study and desktop components. Playwright is included as a dev dependency for local visual and interaction checks.

## Deployment

Deployed on Vercel. Pushes to the production branch build and deploy automatically, and the locale middleware (`proxy.ts`) handles routing at the edge.

## License

[MIT](./LICENSE), copyright 2026 Aleksandar Radivojević.
