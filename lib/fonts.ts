import { Bodoni_Moda, JetBrains_Mono, Inter } from 'next/font/google';

// NOTE: variable names are deliberately NOT --font-display/mono/sans, to avoid
// colliding with the Tailwind @theme token names of the same purpose.
export const display = Bodoni_Moda({ subsets: ['latin','latin-ext'], weight: ['400','500','700','900'], style: ['normal','italic'], variable: '--font-bodoni', display: 'swap' });
export const mono = JetBrains_Mono({ subsets: ['latin','latin-ext'], weight: ['400','500','700'], variable: '--font-jetbrains', display: 'swap' });
export const sans = Inter({ subsets: ['latin','latin-ext'], variable: '--font-inter', display: 'swap' });
