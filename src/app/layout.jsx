import './globals.css';
import { CartProvider } from '@/context/CartContext';

export const metadata = {
  title: "Sakhi by Maya's | Premium Sarees & Kerala Ethnic Wear",
  description: "Discover handcrafted Kerala sarees, Kasavu silk sarees, and traditional ethnic wear celebrating grace, heritage, and timeless beauty. Worldwide shipping available.",
  keywords: [
    "Kerala Saree",
    "Silk Saree",
    "Kasavu Saree",
    "Bridal Saree",
    "Sakhi by Maya's",
    "Traditional Sarees",
    "Indian Ethnic Wear"
  ],
  authors: [{ name: "Sakhi by Maya's" }],
  metadataBase: new URL('https://sakhibymayas.com'),
  alternates: {
    canonical: 'https://sakhibymayas.com',
  },
  openGraph: {
    title: "Sakhi by Maya's | Premium Sarees",
    description: "Handpicked sarees that celebrate grace, heritage, and timeless beauty.",
    url: 'https://sakhibymayas.com',
    siteName: "Sakhi by Maya's",
    images: [
      {
        url: '/assets/desktop/herodesk.png',
        width: 1200,
        height: 630,
        alt: "Sakhi by Maya's Sarees",
      },
    ],
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: "Sakhi by Maya's | Premium Sarees",
    description: "Buy premium Kerala sarees with worldwide shipping.",
    images: ['/assets/desktop/herodesk.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({ children }) {
  // Organization JSON-LD Schema
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: "Sakhi by Maya's",
    url: 'https://sakhibymayas.com',
    logo: 'https://sakhibymayas.com/assets/desktop/herodesk.png',
    description: 'Premium Kerala Sarees and Ethnic Wear',
    sameAs: [],
  };

  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="antialiased bg-[#FFFFF0] text-[#2D2625] min-h-screen flex flex-col">
        <CartProvider>
          {children}
        </CartProvider>
      </body>
    </html>
  );
}
