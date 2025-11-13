import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Product Information',
  description: 'View detailed product information including GTIN, specifications, and company details',
  robots: {
    index: true,
    follow: true,
  },
};

export default function ProductLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}