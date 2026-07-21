/**
 * Film-grain tile, as an inline SVG turbulence filter.
 *
 * Shared by the sitewide <Atmosphere /> layer and the boot overlay. The boot
 * used to get its grain from a `<Noise />` postprocessing pass — a full-screen
 * GPU pass per frame, on top of four others. As a DOM layer it costs a single
 * composited element instead, and the two surfaces now use literally the same
 * texture rather than two different grains that happened to look similar.
 */
export const GRAIN_URL =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")";
