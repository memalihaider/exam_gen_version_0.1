import { Noto_Nastaliq_Urdu } from 'next/font/google';

export const nastaliq = Noto_Nastaliq_Urdu({
  weight: ['400', '700'],
  subsets: ['arabic'],
  variable: '--font-nastaliq',
  display: 'swap',
});