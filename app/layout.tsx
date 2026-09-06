import type { Metadata } from 'next';
import Script from 'next/script';
import { Providers } from './providers';
import './globals.css';

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
    <html lang="en">
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
