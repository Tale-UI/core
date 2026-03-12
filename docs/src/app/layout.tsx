import fs from 'fs';
import path from 'path';
import Link from 'next/link';
import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Tale UI Docs',
  description: 'Headless React component library documentation',
};

function getNavItems(): { slug: string; title: string }[] {
  const docsDir = process.cwd();
  return fs
    .readdirSync(docsDir)
    .filter((f) => f.endsWith('.md'))
    .sort()
    .map((f) => {
      const slug = f.replace(/\.md$/, '');
      const content = fs.readFileSync(path.join(docsDir, f), 'utf8');
      const title = content.match(/^#\s+(.+)/m)?.[1] ?? slug;
      return { slug, title };
    });
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const navItems = getNavItems();

  return (
    <html lang="en">
      <body>
        <div className="layout">
          <nav className="sidebar">
            <Link href="/" className="sidebar-logo">
              Tale UI
            </Link>
            <p className="nav-label">Documentation</p>
            <ul className="nav-list">
              {navItems.map(({ slug, title }) => (
                <li key={slug}>
                  <Link href={`/${slug}`}>{title}</Link>
                </li>
              ))}
            </ul>
          </nav>
          <main className="content">{children}</main>
        </div>
      </body>
    </html>
  );
}
