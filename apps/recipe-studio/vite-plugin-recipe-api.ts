import type { Plugin, ViteDevServer } from 'vite';
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const currentDir = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(currentDir, '..', '..');
const RECIPES_DIR = join(ROOT, 'docs', 'recipes');
const SLUG_RE = /^[a-z0-9-]+$/;

type NodeRequest = any;
type NodeResponse = any;

function json(res: NodeResponse, status: number, data: unknown) {
  const body = JSON.stringify(data);
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json');
  res.end(body);
}

function recipeCategory(slug: string) {
  if (slug.startsWith('dropdown-')) {
    return 'Dropdowns';
  }
  if (slug.startsWith('sidebar-') || slug.includes('navigation') || slug.includes('header')) {
    return 'Navigation';
  }
  if (slug.includes('form') || slug.includes('validation')) {
    return 'Forms';
  }
  if (slug.startsWith('use-')) {
    return 'Hooks';
  }
  return 'Application Patterns';
}

function sectionContent(content: string, heading: string) {
  const lines = content.split('\n');
  const start = lines.findIndex((line) => line.trim() === `## ${heading}`);
  if (start === -1) {
    return '';
  }

  const end = lines.findIndex((line, index) => index > start && line.startsWith('## '));
  return lines.slice(start + 1, end === -1 ? undefined : end).join('\n');
}

function parseComponents(content: string) {
  return sectionContent(content, 'Components Used')
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line.startsWith('- '))
    .map((line) => line.match(/`([^`]+)`/)?.[1] ?? line.replace(/^-\s*/, '').trim())
    .filter(Boolean);
}

function recipeSummary(content: string) {
  return (
    content
      .split('\n')
      .map((line) => line.trim())
      .find((line) => line.length > 0 && !line.startsWith('#')) ?? ''
  );
}

function readRecipeMarkdown(slug: string) {
  return readFileSync(join(RECIPES_DIR, `${slug}.md`), 'utf8').replace(/\r\n/g, '\n');
}

function readRecipes() {
  return readdirSync(RECIPES_DIR)
    .filter((file) => file.endsWith('.md') && file !== 'index.md')
    .sort((a, b) => a.localeCompare(b))
    .map((file) => {
      const slug = file.replace(/\.md$/, '');
      const sourcePath = join(RECIPES_DIR, file);
      const content = readFileSync(sourcePath, 'utf8').replace(/\r\n/g, '\n');
      const stats = statSync(sourcePath);
      const tsxBlockCount = content.match(/^```tsx/mg)?.length ?? 0;
      return {
        slug,
        title: content.match(/^#\s+(.+)/m)?.[1] ?? slug,
        summary: recipeSummary(content),
        file,
        path: `docs/recipes/${file}`,
        category: recipeCategory(slug),
        components: parseComponents(content),
        tsxBlockCount,
        previewable: tsxBlockCount > 0,
        modifiedAt: stats.mtime.toISOString(),
      };
    });
}

export function recipeApiPlugin(): Plugin {
  return {
    name: 'recipe-api',
    configureServer(server: ViteDevServer) {
      server.middlewares.use((req: NodeRequest, res: NodeResponse, next: () => void) => {
        try {
          const url = new URL(req.url, 'http://localhost');

          if (req.method === 'GET' && url.pathname === '/api/recipes') {
            return json(res, 200, { recipes: readRecipes() });
          }

          if (req.method === 'GET' && url.pathname === '/api/recipe') {
            const slug = url.searchParams.get('slug') ?? '';
            if (!SLUG_RE.test(slug)) {
              return json(res, 400, { error: 'Invalid recipe slug.' });
            }

            try {
              return json(res, 200, { markdown: readRecipeMarkdown(slug) });
            } catch {
              return json(res, 404, { error: `Recipe "${slug}" not found.` });
            }
          }

          return next();
        } catch (err) {
          if (!res.headersSent) {
            return json(res, 500, { error: err instanceof Error ? err.message : String(err) });
          }
          return undefined;
        }
      });
    },
  };
}
