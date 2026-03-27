import type { Metadata } from 'next';
import '../styles/globals.css';

export const metadata: Metadata = {
  title: 'The Krkhouse',
  description: 'A personal archive of curated taste. Sound, food, and art — filtered from the noise of Lagos.',
  openGraph: {
    title: 'The Krkhouse',
    description: 'A personal archive of curated taste.',
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body>{children}</body>
    </html>
  );
}
