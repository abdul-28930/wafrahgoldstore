import type { Metadata } from 'next';
import { Poppins } from 'next/font/google';
import './globals.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';


const poppins = Poppins({
  weight: ['300', '400', '500', '600', '700'],
  subsets: ['latin'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'RICH CHIDAMBARAM GOLD COVERING - Exquisite Gold Jewelry Collection',
  description:
    'RICH CHIDAMBARAM GOLD COVERING is a premium gold jewelry store located in Thirumullaivoyal, Avadi, Chennai. Explore handcrafted necklaces, rings, earrings, and bangles blending tradition with elegance.',
  icons: {
    icon: '/Logo-3.png', // Make sure this file is inside the public folder
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
<head>
        <link rel="icon" href="/Logo-3.png" type="image/png" />
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        {/* You can add more meta tags if needed */}
      </head>
      <body className={`${poppins.className} min-h-screen flex flex-col`}>
        <Header />
        <div className="flex-grow">
          {children}
        </div>
        <Footer />
      </body>
    </html>
  );
}