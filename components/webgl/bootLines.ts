/**
 * Boot sequence data, deliberately kept in its own module with no three.js
 * imports.
 *
 * These used to live in BootScene.tsx, which meant BootPreloader3D's
 * `import { BOOT_LINES } from './BootScene'` dragged three.js
 * (~364 KB compressed / 1.16 MB parsed) into the initial bundle graph and
 * defeated the `dynamic(..., { ssr: false })` right below it — the chunk
 * shipped to every visitor, including phones and reduced-motion users who
 * never render the scene. Importing from here costs nothing.
 */

export type BootState = {
  phase: 'boot' | 'power' | 'log' | 'enter' | 'exit';
  count: number;
  visibleLines: number;
};

export const BOOT_LINES: string[] = [
  'AR/OS 1.0',
  '> cpu ......... ok',
  '> mem ......... ok',
  '> disk ........ ok',
  '> net ......... ok',
  'USER  A. RADIVOJEVIC',
  'READY',
];
