import fs from 'fs';
import path from 'path';
import Link from 'next/link';

interface DocMeta {
  slug: string;
  title: string;
  summary: string;
}

function getDocsMeta(): DocMeta[] {
  const docsDir = process.cwd();
  return fs
    .readdirSync(docsDir)
    .filter((f) => f.endsWith('.md'))
    .sort()
    .map((f) => {
      const slug = f.replace(/\.md$/, '');
      const content = fs.readFileSync(path.join(docsDir, f), 'utf8');
      const title = content.match(/^#\s+(.+)/m)?.[1] ?? slug;
      const summary =
        content
          .split('\n')
          .find((line) => line.trim().length > 0 && !line.startsWith('#'))
          ?.trim() ?? '';
      return { slug, title, summary };
    });
}

export default function HomePage() {
  const docs = getDocsMeta();

  return (
    <div>
      <div className="home-header">
        <h1>Tale UI Documentation</h1>
        <p>Guides and references for the Tale UI design system and React component library.</p>
      </div>
      <ul className="doc-grid">
        {docs.map(({ slug, title, summary }) => (
          <li key={slug}>
            <Link href={`/${slug}`} className="doc-card">
              <p className="doc-card-title">{title}</p>
              {summary && <p className="doc-card-summary">{summary}</p>}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
