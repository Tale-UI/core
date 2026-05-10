/* eslint-disable curly, no-regex-spaces */

import { readFileSync, readdirSync } from 'fs';
import { join } from 'path';

export const EVAL_HEADING_TO_SOURCE_HEADING = {
  'Trigger styling': 'Trigger Styling',
  'Controlled state': 'Controlled State Patterns',
  'Color state': 'Color State Imports',
  'React Aria conventions': 'React Aria Conventions',
  Imports: 'Import Path Patterns',
  Layout: 'Layout Patterns',
  'Visual exports': 'Visual Exports',
  'Dark mode': 'Dark Mode',
  'General conventions': 'General Conventions',
};

export function normalizeTargetFileSlug(targetFile) {
  const normalized = targetFile?.trim();
  if (!normalized) return null;
  if (normalized === 'docs/pitfalls.md' || normalized.endsWith('/docs/pitfalls.md')) {
    return { kind: 'shared' };
  }
  const componentMatch = normalized.match(/(?:^|\/)docs\/components\/([a-z0-9-]+)\.md$/);
  if (componentMatch) {
    return { kind: 'component', slug: componentMatch[1] };
  }
  if (/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(normalized)) {
    return { kind: 'component', slug: normalized };
  }
  return null;
}

export function createComponentSlugResolver(root) {
  const componentRegistryPath = join(root, 'registry/components.json');
  const nameToSlug = new Map();

  try {
    const reg = JSON.parse(readFileSync(componentRegistryPath, 'utf8'));
    for (const component of reg.components) nameToSlug.set(component.name, component.slug);
  } catch {
    /* non-fatal - source patching will skip component targets if map is empty */
  }

  // Supplement with docs/components/*.md filenames, covering chart docs and any
  // component whose name did not make it into components.json.
  try {
    for (const file of readdirSync(join(root, 'docs/components'))) {
      if (!file.endsWith('.md') || file === 'index.md') continue;
      const slug = file.slice(0, -3);
      const name = slug
        .split('-')
        .map((word) => word[0].toUpperCase() + word.slice(1))
        .join('');
      if (!nameToSlug.has(name)) nameToSlug.set(name, slug);
    }
  } catch {
    /* non-fatal */
  }

  const nameToSlugLower = new Map(
    [...nameToSlug].map(([key, value]) => [key.toLowerCase(), value]),
  );

  return (name) => nameToSlug.get(name) ?? nameToSlugLower.get(name.toLowerCase()) ?? null;
}

export function createPitfallSourceTargetResolver(root) {
  const resolveSlug = createComponentSlugResolver(root);
  const pitfallsDocPath = join(root, 'docs/pitfalls.md');

  function resolveSectionTarget(fix) {
    if (!fix.section) return null;
    if (fix.section === 'general') {
      return { kind: 'shared', sectionHeading: 'General Conventions' };
    }
    if (fix.section.startsWith('cross:')) {
      const category = fix.section.slice(6);
      const categoryToHeading = {
        'trigger-styling': 'Trigger Styling',
        'controlled-state': 'Controlled State Patterns',
        'color-state': 'Color State Imports',
        'react-aria': 'React Aria Conventions',
        imports: 'Import Path Patterns',
        layout: 'Layout Patterns',
        'visual-exports': 'Visual Exports',
        'dark-mode': 'Dark Mode',
      };
      return {
        kind: 'shared',
        sectionHeading: categoryToHeading[category] ?? null,
      };
    }
    if (fix.section.startsWith('component:')) {
      const componentName = fix.section.slice(10).trim();
      const slug = resolveSlug(componentName);
      if (!slug) return null;
      return {
        kind: 'component',
        slug,
        componentName,
      };
    }
    return null;
  }

  function inferTargetFromOldHeading(fix, evalContextContent) {
    if (!fix.old) return null;

    let headingLabel = null;
    let parentHeading = null;
    const pos = evalContextContent.indexOf(fix.old);
    if (pos === -1) return null;

    const headingInOld = fix.old.match(/^\s*#{3,4}\s+(.+)/);
    if (headingInOld) {
      headingLabel = headingInOld[1].trim();
      const before = evalContextContent.slice(0, pos);
      const h3Before = [...before.matchAll(/^   ### (.+)$/gm)];
      if (h3Before.length > 0) {
        parentHeading = h3Before[h3Before.length - 1][1].trim();
      }
    } else {
      const before = evalContextContent.slice(0, pos);
      const h4Match = [...before.matchAll(/^   #### (.+)$/gm)];
      const h3Match = [...before.matchAll(/^   ### (.+)$/gm)];

      if (h4Match.length > 0) {
        headingLabel = h4Match[h4Match.length - 1][1].trim();
        const h4Pos = before.lastIndexOf(h4Match[h4Match.length - 1][0]);
        const beforeH4 = before.slice(0, h4Pos);
        const h3Before = [...beforeH4.matchAll(/^   ### (.+)$/gm)];
        if (h3Before.length > 0) {
          parentHeading = h3Before[h3Before.length - 1][1].trim();
        }
      } else if (h3Match.length > 0) {
        headingLabel = h3Match[h3Match.length - 1][1].trim();
      }
    }

    if (!headingLabel) return null;

    const isCrossCutting = fix.scope === 'cross-cutting';
    const isGeneral =
      headingLabel === 'General conventions' ||
      (parentHeading == null &&
        EVAL_HEADING_TO_SOURCE_HEADING[headingLabel] === 'General Conventions');
    const isPerComponent =
      !isCrossCutting &&
      (parentHeading === 'Per-component pitfalls' ||
        (!isGeneral &&
          !EVAL_HEADING_TO_SOURCE_HEADING[headingLabel] &&
          resolveSlug(headingLabel) !== null));

    if (isPerComponent) {
      const slug = resolveSlug(headingLabel);
      if (!slug) return null;
      return {
        kind: 'component',
        slug,
        componentName: headingLabel,
      };
    }

    const sourceHeading =
      EVAL_HEADING_TO_SOURCE_HEADING[headingLabel] ??
      (isCrossCutting ? 'General Conventions' : null);
    if (!sourceHeading) return null;
    return {
      kind: 'shared',
      sectionHeading: sourceHeading,
    };
  }

  function resolveSourceTarget(fix, evalContextContent = '') {
    const explicitTarget = normalizeTargetFileSlug(fix.targetFile);
    const sectionTarget = resolveSectionTarget(fix);
    const inferredTarget = sectionTarget ?? inferTargetFromOldHeading(fix, evalContextContent);

    if (sectionTarget && explicitTarget) {
      if (sectionTarget.kind !== explicitTarget.kind) {
        return null;
      }
      if (sectionTarget.kind === 'component' && sectionTarget.slug !== explicitTarget.slug) {
        return null;
      }
    }

    const target = inferredTarget ?? explicitTarget;
    if (!target) return null;
    if (target.kind === 'shared' && !target.sectionHeading) return null;

    return target.kind === 'component'
      ? {
          filePath: join(root, `docs/components/${target.slug}.md`),
          sectionHeading: 'Pitfalls',
          isComponent: true,
          slug: target.slug,
          componentName: target.componentName ?? '',
          appendOnly: fix.operation === 'append_pitfall',
        }
      : {
          filePath: pitfallsDocPath,
          sectionHeading: target.sectionHeading,
          isComponent: false,
          appendOnly: fix.operation === 'append_pitfall',
        };
  }

  return {
    inferTargetFromOldHeading,
    resolveSectionTarget,
    resolveSlug,
    resolveSourceTarget,
  };
}
