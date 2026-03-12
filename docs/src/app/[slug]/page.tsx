import fs from 'fs';
import path from 'path';
import { notFound } from 'next/navigation';
import { marked } from 'marked';
import type { Metadata } from 'next';

const DOCS_DIR = process.cwd();
const SLUG_RE = /^[a-z0-9-]+$/;

function getMdPath(slug: string): string {
  return path.join(DOCS_DIR, `${slug}.md`);
}

export function generateStaticParams(): { slug: string }[] {
  return fs
    .readdirSync(DOCS_DIR)
    .filter((f) => f.endsWith('.md'))
    .map((f) => ({ slug: f.replace(/\.md$/, '') }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  if (!SLUG_RE.test(slug)) return {};
  try {
    const content = fs.readFileSync(getMdPath(slug), 'utf8');
    const title = content.match(/^#\s+(.+)/m)?.[1] ?? slug;
    return { title: `${title} — Tale UI Docs` };
  } catch {
    return {};
  }
}

export default async function DocPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  // Guard against path traversal
  if (!SLUG_RE.test(slug)) {
    notFound();
  }

  let content: string;
  try {
    content = fs.readFileSync(getMdPath(slug), 'utf8');
  } catch {
    notFound();
  }

  const html = await marked.parse(content);

  return <article dangerouslySetInnerHTML={{ __html: html }} />;
}
