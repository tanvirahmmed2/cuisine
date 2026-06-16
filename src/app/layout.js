import { Inter, Plus_Jakarta_Sans } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const jakarta = Plus_Jakarta_Sans({ subsets: ['latin'], variable: '--font-jakarta', weight: ['400','500','600','700','800'] });

export const metadata = {
  title: { default: 'Cuisine — Restaurant Management SaaS', template: '%s | Cuisine' },
  description: 'The all-in-one platform for modern restaurants. Manage reservations, staff, payments, and analytics from one powerful dashboard.',
  keywords: ['restaurant management', 'reservation software', 'restaurant', 'SaaS'],
  openGraph: {
    title: 'Cuisine — Restaurant Management SaaS',
    description: 'Manage your entire restaurant business from one dashboard.',
    type: 'website',
  },
};

import { Toaster } from 'react-hot-toast';

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="scroll-smooth" data-scroll-behavior="smooth">
      <body className={`${inter.variable} ${jakarta.variable} font-sans antialiased bg-bg text-text selection:bg-primary selection:text-white`}>
        <Toaster position="top-right" />
        {children}
      </body>
    </html>
  );
}
