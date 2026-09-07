import type { Metadata } from 'next';
import Script from 'next/script';
import { Instrument_Serif, Poppins } from 'next/font/google';
import { Providers } from './providers';
import './globals.css';

const instrumentSerif = Instrument_Serif({
  subsets: ['latin'],
  weight: ['400'],
  style: ['normal', 'italic'],
  variable: '--font-serif',
  display: 'swap',
});

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800', '900'],
  variable: '--font-sans',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Veyro — High-Converting Ad Creatives in Seconds',
  description:
    'Paste your offer in plain words. Veyro generates 10 proven high-converting direct-response ad layouts instantly, ready for download at 1080×1080 resolution.',
  openGraph: {
    title: 'Veyro — High-Converting Ad Creatives in Seconds',
    description:
      'High-converting ads engineered for ROI. Ten proven ad layouts per generation, downloadable instantly as crisp creatives.',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${poppins.variable} ${instrumentSerif.variable}`}>
      <body className="bg-background text-foreground antialiased min-h-screen">
        <Providers>{children}</Providers>
        <Script
          src="https://checkout.razorpay.com/v1/checkout.js"
          strategy="lazyOnload"
        />
      </body>
    </html>
  );
}
