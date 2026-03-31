import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Global Culinary Compass',
  description: 'Discover authentic recipes from every corner of the world.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-background text-on-surface font-body antialiased">
        {children}
      </body>
    </html>
  );
}
