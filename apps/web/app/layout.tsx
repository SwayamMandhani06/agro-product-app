import type { Metadata } from 'next';
import { Plus_Jakarta_Sans } from 'next/font/google';
import './globals.css';

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800'],
});

export const metadata: Metadata = {
  title: {
    default: 'AgriTrade — India\'s Farmer-First Agri Marketplace',
    template: '%s | AgriTrade',
  },
  description:
    'Buy premium seeds, fertilizers, farm tools, and agri-inputs at the best prices. AgriTrade connects Indian farmers directly with verified agri suppliers.',
  keywords: ['agritrade', 'agri marketplace', 'seeds', 'fertilizers', 'farm tools', 'India'],
  authors: [{ name: 'AgriTrade' }],
  openGraph: {
    title: 'AgriTrade — India\'s Farmer-First Agri Marketplace',
    description: 'Premium agri-inputs delivered to your farm.',
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
      <body className={plusJakartaSans.className}>{children}</body>
    </html>
  );
}

