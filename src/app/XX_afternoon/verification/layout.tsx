import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'GTIN Bulk Verification',
  description: 'Verify multiple GTIN numbers to check if they are registered and valid in our database',
  keywords: ['GTIN', 'verification', 'bulk', 'barcode', 'product', 'validation'],
  robots: {
    index: true,
    follow: true,
  },
};

export default function VerificationLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}