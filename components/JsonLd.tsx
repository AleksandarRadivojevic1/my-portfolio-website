// Renders first-party, statically-computed JSON-LD as a <script> tag.
// JSON.stringify + dangerouslySetInnerHTML is the documented Next.js pattern
// for this (see node_modules/next/dist/docs/01-app/02-guides/json-ld.md).
// `<` is escaped to its unicode equivalent to prevent the payload from being
// interpreted as HTML/script content.
export function JsonLd({ data }: { data: object }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, '\\u003c') }}
    />
  );
}
