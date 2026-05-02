/* eslint-disable curly, no-cond-assign, no-nested-ternary, no-plusplus, no-regex-spaces, prefer-template */

export const PITFALL_FIX_OPERATIONS = new Set([
  'replace_pitfall',
  'replace_subbullets',
  'append_pitfall',
]);

export const PITFALL_FIX_OPERATION_SPECS = {
  append_pitfall: {
    description: 'Append one brand-new canonical pitfall block.',
    requiredFields: ['section', 'targetFile', 'operation', 'newPitfallSlug'],
    forbiddenFields: ['targetPitfallSlug'],
    optionalFields: ['old'],
    oldUsage: 'Set old to an empty string.',
  },
  replace_pitfall: {
    description: 'Rewrite exactly one existing pitfall block selected by slug.',
    requiredFields: ['section', 'targetFile', 'operation', 'targetPitfallSlug'],
    forbiddenFields: ['newPitfallSlug'],
    optionalFields: ['old'],
    oldUsage: 'Use old only as an optional verbatim verification hint.',
  },
  replace_subbullets: {
    description: 'Rewrite structured content inside one existing pitfall block selected by slug.',
    requiredFields: ['section', 'targetFile', 'operation', 'targetPitfallSlug'],
    forbiddenFields: ['newPitfallSlug'],
    optionalFields: ['old'],
    oldUsage: 'Use old only as an optional verbatim verification hint.',
  },
};

export function formatPitfallOperationSpecsForPrompt() {
  return Object.entries(PITFALL_FIX_OPERATION_SPECS)
    .map(([operation, spec]) => {
      const required = spec.requiredFields.join(', ');
      const forbidden = spec.forbiddenFields.length > 0 ? spec.forbiddenFields.join(', ') : 'none';
      return `  - "${operation}": ${spec.description} Required fields: ${required}. Forbidden/non-empty fields: ${forbidden}. ${spec.oldUsage}`;
    })
    .join('\n');
}

/**
 * Collapse exactly-two trailing backticks at end-of-line to a single backtick.
 * Preserves ``` fences (three-or-more) untouched.
 */
export function sanitizeTrailingDoubleBackticks(text) {
  return text.replace(/(?<!`)``(?!`)(\s*)$/gm, '`$1');
}

/**
 * Derive a kebab-case pitfall slug from a summary string.
 * Takes the first 4-6 meaningful words.
 */
export function summaryToSlug(summary) {
  return summary
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, '')
    .trim()
    .split(/\s+/)
    .slice(0, 5)
    .join('-');
}

export function normalizeStringList(value) {
  if (Array.isArray(value)) {
    return value
      .filter((item) => typeof item === 'string')
      .map((item) => item.trim())
      .filter(Boolean);
  }
  if (typeof value === 'string' && value.trim()) {
    return [value.trim()];
  }
  return [];
}

export function unwrapInlineCode(snippet) {
  const trimmed = snippet.trim();
  const match = trimmed.match(/^`([^`]+)`$/);
  return match ? match[1] : trimmed;
}

export function normalizeSnippetList(value) {
  return normalizeStringList(value).map(unwrapInlineCode);
}

export function parsePitfallHeader(line) {
  const headerMatch = line.match(/^- \*\*(.+?)\*\*(?: — (.+))?$/);
  if (!headerMatch) return null;
  return {
    summary: headerMatch[1].trim(),
    details: headerMatch[2]?.trim() ?? '',
  };
}

export function normalizeSourcePatchBlock(text) {
  const block = text.replace(/^   /gm, '').trim();
  const lines = block.split('\n');
  const firstContentLine = lines.findIndex(
    (line) => line.startsWith('<!-- ') || line.startsWith('- ') || line.startsWith('  - '),
  );
  if (firstContentLine === -1) return block;
  return lines.slice(firstContentLine).join('\n').trimEnd();
}

export function parsePitfallBlock(blockText) {
  const normalized = normalizeSourcePatchBlock(blockText).trimEnd();
  if (!normalized) return null;

  const lines = normalized.split('\n');
  const comments = [];
  let index = 0;

  while (index < lines.length) {
    const line = lines[index];
    if (/^<!-- .* -->$/.test(line.trim())) {
      comments.push(line.trim());
      index++;
      continue;
    }
    if (line.trim() === '') {
      index++;
      continue;
    }
    break;
  }

  if (index >= lines.length) return null;

  const header = parsePitfallHeader(lines[index]);
  if (!header) return null;
  index++;

  const antiPatterns = [];
  const fixes = [];
  const proseLines = [];
  let completeExample = '';
  let completeExampleLanguage = 'tsx';

  while (index < lines.length) {
    const line = lines[index];

    const antiPatternMatch = line.match(/^  - anti-pattern:\s*(.+)$/);
    if (antiPatternMatch) {
      antiPatterns.push(unwrapInlineCode(antiPatternMatch[1]));
      index++;
      continue;
    }

    const fixMatch = line.match(/^  - fix:\s*(.+)$/);
    if (fixMatch) {
      fixes.push(unwrapInlineCode(fixMatch[1]));
      index++;
      continue;
    }

    if (/^  - complete example:\s*$/.test(line)) {
      index++;
      const exampleLines = [];
      while (index < lines.length) {
        exampleLines.push(lines[index]);
        index++;
      }
      const dedented = exampleLines.map((exampleLine) => exampleLine.replace(/^    /, ''));
      const openFence = dedented.find((exampleLine) => /^```/.test(exampleLine));
      if (openFence) {
        completeExampleLanguage = openFence.replace(/^```/, '').trim() || 'tsx';
      }
      const openFenceIndex = dedented.findIndex((exampleLine) => /^```/.test(exampleLine));
      const closeFenceIndex =
        openFenceIndex === -1
          ? -1
          : dedented.findIndex(
              (exampleLine, lineIndex) => lineIndex > openFenceIndex && /^```$/.test(exampleLine),
            );
      if (openFenceIndex !== -1 && closeFenceIndex !== -1) {
        completeExample = dedented
          .slice(openFenceIndex + 1, closeFenceIndex)
          .join('\n')
          .trimEnd();
      } else {
        completeExample = dedented.join('\n').trimEnd();
      }
      break;
    }

    proseLines.push(line);
    index++;
  }

  return {
    comments,
    summary: header.summary,
    details: header.details,
    antiPatterns,
    fixes,
    completeExample,
    completeExampleLanguage,
    proseLines,
  };
}

export function serializePitfallBlock(data) {
  const lines = [];
  if (data.comments?.length) {
    lines.push(...data.comments.map((line) => line.trim()));
  }
  const header = `- **${data.summary.trim()}**${data.details?.trim() ? ` — ${data.details.trim()}` : ''}`;
  lines.push(header);

  for (const antiPattern of normalizeSnippetList(data.antiPatterns)) {
    lines.push(`  - anti-pattern: \`${antiPattern}\``);
  }
  for (const fix of normalizeSnippetList(data.fixes)) {
    lines.push(`  - fix: \`${fix}\``);
  }

  if (Array.isArray(data.proseLines) && data.proseLines.length > 0) {
    lines.push(...data.proseLines);
  }

  const completeExample =
    typeof data.completeExample === 'string' ? data.completeExample.trimEnd() : '';
  if (completeExample) {
    lines.push('  - complete example:');
    lines.push(`    \`\`\`${data.completeExampleLanguage?.trim() || 'tsx'}`);
    for (const exampleLine of completeExample.split('\n')) {
      lines.push(`    ${exampleLine}`);
    }
    lines.push('    ```');
  }

  return lines.join('\n').trimEnd();
}

export function buildStructuredPitfallFromFix(fix, options = {}) {
  const fallbackBlock = options.fallbackBlockText
    ? parsePitfallBlock(options.fallbackBlockText)
    : null;
  const summary =
    typeof fix.summary === 'string' && fix.summary.trim()
      ? fix.summary.trim()
      : (fallbackBlock?.summary ?? '');
  const details =
    typeof fix.details === 'string' && fix.details.trim()
      ? fix.details.trim()
      : (fallbackBlock?.details ?? '');
  const antiPatterns = normalizeSnippetList(fix.antiPatterns);
  const fixes = normalizeSnippetList(fix.fixes);
  const completeExample =
    typeof fix.completeExample === 'string' && fix.completeExample.trim()
      ? fix.completeExample.trimEnd()
      : (fallbackBlock?.completeExample ?? '');

  return {
    comments: options.comments ?? fallbackBlock?.comments ?? [],
    summary,
    details,
    antiPatterns: antiPatterns.length > 0 ? antiPatterns : (fallbackBlock?.antiPatterns ?? []),
    fixes: fixes.length > 0 ? fixes : (fallbackBlock?.fixes ?? []),
    completeExample,
    completeExampleLanguage: fallbackBlock?.completeExampleLanguage ?? 'tsx',
    proseLines: options.preserveProse ? (fallbackBlock?.proseLines ?? []) : [],
  };
}

export function getPitfallBlocks(sectionText) {
  const blocks = [];
  const pattern =
    /<!--\s*pitfall:\s*([a-z0-9-]+)\s*-->[\s\S]*?(?=(?:\n<!--\s*pitfall:\s*[a-z0-9-]+\s*-->)|$)/g;
  let match;
  while ((match = pattern.exec(sectionText)) !== null) {
    blocks.push({
      slug: match[1],
      start: match.index,
      end: pattern.lastIndex,
      text: match[0],
    });
  }
  return blocks;
}

export function findPitfallBlockBySlug(sectionText, slug) {
  return getPitfallBlocks(sectionText).find((block) => block.slug === slug) ?? null;
}

export function findContainingPitfallBlock(sectionText, offset) {
  return (
    getPitfallBlocks(sectionText).find((block) => offset >= block.start && offset < block.end) ??
    null
  );
}

export function extractSection(fileContent, sectionHeading) {
  const headingPattern = new RegExp(`^## ${sectionHeading}\\s*$`, 'm');
  const match = headingPattern.exec(fileContent);
  if (!match) return null;

  const sectionStart = match.index + match[0].length;
  const nextHeadingMatch = /^## /m.exec(fileContent.slice(sectionStart));
  const sectionEnd = nextHeadingMatch ? sectionStart + nextHeadingMatch.index : fileContent.length;

  return {
    sectionStart,
    sectionEnd,
    sectionText: fileContent.slice(sectionStart, sectionEnd),
  };
}

export function findInSection(sectionText, sourceOld) {
  const idx1 = sectionText.indexOf(sourceOld);
  if (idx1 !== -1) return { matchStart: idx1, matchEnd: idx1 + sourceOld.length };

  const norm = (s) => s.replace(/`/g, '');
  const normSection = norm(sectionText);
  const normOld = norm(sourceOld);
  const idx2 = normSection.indexOf(normOld);
  if (idx2 !== -1) {
    let realStart = 0;
    let normCount = 0;
    for (let i = 0; i < sectionText.length; i++) {
      if (normCount === idx2) {
        realStart = i;
        break;
      }
      if (sectionText[i] !== '`') normCount++;
    }
    let realEnd = realStart;
    const normEnd = idx2 + normOld.length;
    normCount = idx2;
    for (let i = realStart; i < sectionText.length; i++) {
      if (normCount >= normEnd) {
        realEnd = i;
        break;
      }
      if (sectionText[i] !== '`') normCount++;
      if (i === sectionText.length - 1) realEnd = sectionText.length;
    }
    return { matchStart: realStart, matchEnd: realEnd };
  }

  return null;
}

export function buildCommentBlock(target, slug, bulletText) {
  if (target.isComponent) {
    return `\n<!-- pitfall: ${slug} -->\n${bulletText}\n`;
  }
  const catSlugMap = {
    'Trigger Styling': 'trigger-styling',
    'Controlled State Patterns': 'controlled-state',
    'Color State Imports': 'color-state',
    'React Aria Conventions': 'react-aria',
    'Import Path Patterns': 'imports',
    'Layout Patterns': 'layout',
    'Visual Exports': 'visual-exports',
    'Dark Mode': 'dark-mode',
    'General Conventions': 'general',
  };
  const catSlug = catSlugMap[target.sectionHeading] ?? 'general';
  if (catSlug === 'general') {
    return `\n<!-- pitfall: ${slug} -->\n<!-- applies-to: * -->\n<!-- category: typescript -->\n${bulletText}\n`;
  }
  return `\n<!-- pitfall: ${slug} -->\n<!-- applies-to: * -->\n<!-- category: ${catSlug} -->\n${bulletText}\n`;
}

export function hasMalformedInlineSnippets(blockText) {
  const snippetLines = [
    ...blockText.matchAll(/^\s+- anti-pattern:\s*(.+)$/gm),
    ...blockText.matchAll(/^\s+- fix:\s*(.+)$/gm),
  ].map((match) => match[1].trim());

  return snippetLines.some((snippet) => {
    if (!snippet) return false;
    if (snippet.startsWith('```')) return false;
    return !/^`[^`]+`$/.test(snippet);
  });
}

export function getPitfallSummary(blockText) {
  return blockText.match(/^- \*\*(.+?)\*\*/m)?.[1] ?? '';
}

export function normalizePitfallSummaryForMatch(summary) {
  return summary
    .toLowerCase()
    .replace(/`([^`]*)`/g, '$1')
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim()
    .replace(/\s+/g, ' ');
}

export function findPitfallBlocksByOldText(sectionText, sourceOld) {
  const normalizedOld = typeof sourceOld === 'string' ? sourceOld.trim() : '';
  if (!normalizedOld) return [];
  return getPitfallBlocks(sectionText).filter((block) => findInSection(block.text, normalizedOld));
}

export function findPitfallBlocksBySummary(sectionText, summary) {
  const normalizedSummary = normalizePitfallSummaryForMatch(summary ?? '');
  if (!normalizedSummary) return [];
  return getPitfallBlocks(sectionText).filter((block) => {
    const blockSummary = normalizePitfallSummaryForMatch(getPitfallSummary(block.text));
    return blockSummary === normalizedSummary;
  });
}

export function findPitfallBlocksByNearDuplicateSummary(sectionText, summary) {
  const normalizedSummary = normalizePitfallSummaryForMatch(summary ?? '');
  if (!normalizedSummary) return [];
  const summaryTokens = new Set(normalizedSummary.split(' ').filter(Boolean));
  return getPitfallBlocks(sectionText).filter((block) => {
    const blockSummary = normalizePitfallSummaryForMatch(getPitfallSummary(block.text));
    if (!blockSummary) return false;
    if (blockSummary === normalizedSummary) return true;

    const shorterLength = Math.min(blockSummary.length, normalizedSummary.length);
    if (
      shorterLength >= 40 &&
      (blockSummary.includes(normalizedSummary) || normalizedSummary.includes(blockSummary))
    ) {
      return true;
    }

    const blockTokens = new Set(blockSummary.split(' ').filter(Boolean));
    const unionSize = new Set([...summaryTokens, ...blockTokens]).size;
    if (unionSize === 0) return false;
    const sharedCount = [...summaryTokens].filter((token) => blockTokens.has(token)).length;
    return sharedCount / unionSize >= 0.86 && Math.min(summaryTokens.size, blockTokens.size) >= 5;
  });
}

function formatPitfallSlugList(blocks) {
  return blocks.map((block) => block.slug).join(', ');
}

function resolvePitfallTargetBlock(sectionText, fix, targetPitfallSlug, sourceOld, filePath) {
  const directBlock = findPitfallBlockBySlug(sectionText, targetPitfallSlug);
  if (directBlock) return { block: directBlock };

  const oldMatches = findPitfallBlocksByOldText(sectionText, sourceOld);
  if (oldMatches.length === 1) {
    return {
      block: oldMatches[0],
      recoveredBy: 'old text',
    };
  }
  if (oldMatches.length > 1) {
    return {
      error: `target pitfall slug '${targetPitfallSlug}' not found in ${filePath}; old text matched multiple pitfall slugs: ${formatPitfallSlugList(oldMatches)}`,
    };
  }

  const summaryMatches = findPitfallBlocksBySummary(sectionText, fix.summary ?? '');
  if (summaryMatches.length === 1) {
    return {
      block: summaryMatches[0],
      recoveredBy: 'summary',
    };
  }
  if (summaryMatches.length > 1) {
    return {
      error: `target pitfall slug '${targetPitfallSlug}' not found in ${filePath}; summary matched multiple pitfall slugs: ${formatPitfallSlugList(summaryMatches)}`,
    };
  }

  const candidates = [
    ...new Set(
      getPitfallBlocks(sectionText)
        .map((block) => block.slug)
        .filter(Boolean),
    ),
  ].join(', ');
  return {
    error: `target pitfall slug '${targetPitfallSlug}' not found in ${filePath}; no unique old text or summary match found${candidates ? `. Candidate slugs: ${candidates}` : ''}`,
  };
}

export function hasMultiIdeaSummary(blockText) {
  const summary = getPitfallSummary(blockText);
  if (!summary) return true;
  const stripped = summary.replace(/`[^`]*`/g, '');
  const dashCount = (stripped.match(/[—–]/g) || []).length;
  return dashCount >= 2 || /\band\b/.test(stripped) || /;/.test(stripped);
}

export function summaryReflectsPitfallSlug(slug, blockText) {
  const summary = getPitfallSummary(blockText).toLowerCase().replace(/`/g, '');
  if (!summary) return false;

  const stopWords = new Set([
    'a',
    'an',
    'and',
    'any',
    'for',
    'no',
    'not',
    'of',
    'or',
    'the',
    'to',
    'use',
    'when',
    'with',
  ]);
  const tokens = [...new Set(slug.split('-').filter((token) => token && !stopWords.has(token)))];
  if (tokens.length === 0) return true;

  const matchedCount = tokens.filter((token) => summary.includes(token)).length;
  const requiredMatches = tokens.length >= 4 ? 3 : tokens.length >= 2 ? 2 : 1;
  return matchedCount >= Math.min(tokens.length, requiredMatches);
}

export function hasMultiIdeaOptOut(blockText) {
  return /<!--\s*multi-idea-ok\s*-->/.test(blockText);
}

export function validatePitfallPatchBlock(blockText) {
  const topLevelBullets = blockText.split('\n').filter((line) => /^- \*\*/.test(line));
  if (topLevelBullets.length !== 1) {
    return `expected exactly one top-level pitfall bullet, found ${topLevelBullets.length}`;
  }
  if (!hasMultiIdeaOptOut(blockText) && hasMultiIdeaSummary(blockText)) {
    return 'summary appears multi-idea';
  }
  if (hasMalformedInlineSnippets(blockText)) {
    return 'malformed anti-pattern/fix inline snippets';
  }
  return null;
}

export function buildPitfallBlockTextFromFix(fix, options = {}) {
  const pitfall = buildStructuredPitfallFromFix(fix, {
    comments: options.comments,
    fallbackBlockText: options.fallbackBlockText ?? '',
    preserveProse: options.preserveProse,
  });
  if (!pitfall.summary) {
    return { error: 'missing pitfall summary' };
  }
  if (
    !pitfall.details &&
    !pitfall.completeExample &&
    pitfall.antiPatterns.length === 0 &&
    pitfall.fixes.length === 0
  ) {
    return { error: 'structured pitfall content is empty' };
  }

  const blockText = serializePitfallBlock(pitfall);
  const validationError = validatePitfallPatchBlock(blockText);
  if (validationError) {
    return { error: validationError };
  }

  return { blockText, pitfall };
}

export function validateFixPayload(fix) {
  const errors = [];
  const operation = fix.operation;
  const operationSpec = PITFALL_FIX_OPERATION_SPECS[operation];
  if (!operationSpec) {
    errors.push(`operation must be one of ${[...PITFALL_FIX_OPERATIONS].join(', ')}`);
  }
  if (typeof fix.section !== 'string' || !fix.section.trim()) {
    errors.push('section is required');
  }
  if (typeof fix.targetFile !== 'string' || !fix.targetFile.trim()) {
    errors.push('targetFile is required');
  }

  const summary = typeof fix.summary === 'string' ? fix.summary.trim() : '';
  const details = typeof fix.details === 'string' ? fix.details.trim() : '';
  const antiPatternEntries = normalizeStringList(fix.antiPatterns);
  const fixEntries = normalizeStringList(fix.fixes);
  const antiPatterns = antiPatternEntries.map(unwrapInlineCode);
  const fixes = fixEntries.map(unwrapInlineCode);
  const completeExample = typeof fix.completeExample === 'string' ? fix.completeExample.trim() : '';
  const targetPitfallSlug =
    typeof fix.targetPitfallSlug === 'string' ? fix.targetPitfallSlug.trim() : '';
  const newPitfallSlug = typeof fix.newPitfallSlug === 'string' ? fix.newPitfallSlug.trim() : '';

  if (!summary) errors.push('summary is required');
  if (summary.includes('**')) errors.push('summary must not include markdown bold markers');
  if (summary.length > 180) errors.push('summary must be 180 characters or fewer');
  if (!details) errors.push('details is required');
  if (details.startsWith('—') || details.startsWith('-')) {
    errors.push('details must not include the leading dash');
  }
  if (antiPatterns.length === 0) errors.push('antiPatterns must contain at least one snippet');
  if (fixes.length === 0) errors.push('fixes must contain at least one snippet');
  if (completeExample.includes('```'))
    errors.push('completeExample must not include markdown fences');

  for (const [label, snippets] of [
    ['antiPatterns', antiPatternEntries],
    ['fixes', fixEntries],
  ]) {
    for (const snippet of snippets) {
      if (!snippet.trim()) errors.push(`${label} entries must be non-empty strings`);
      if (/^`|`$/.test(snippet.trim()))
        errors.push(`${label} entries must not include markdown backticks`);
      if (snippet.includes('\n')) errors.push(`${label} entries must be single-line snippets`);
    }
  }

  if (operationSpec) {
    const fieldValues = {
      newPitfallSlug,
      targetPitfallSlug,
    };
    for (const field of operationSpec.requiredFields) {
      if (field in fieldValues && !fieldValues[field])
        errors.push(`${operation} requires ${field}`);
    }
    for (const field of operationSpec.forbiddenFields) {
      if (field in fieldValues && fieldValues[field]) {
        errors.push(`${operation} requires ${field} to be empty`);
      }
    }
  }

  if (operation === 'append_pitfall') {
    if (newPitfallSlug && !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(newPitfallSlug)) {
      errors.push('newPitfallSlug must be kebab-case');
    }
  }

  return {
    pass: errors.length === 0,
    errors,
  };
}

export function validateUpdatedPitfallSection(sectionText, expectedSlug) {
  const blocks = getPitfallBlocks(sectionText);
  if (blocks.length === 0) return { error: 'section contains no pitfall blocks after patching' };

  for (const block of blocks) {
    const parsed = parsePitfallBlock(block.text);
    if (!parsed) {
      return { error: `could not parse pitfall '${block.slug}' after patching` };
    }
    const normalizedBlock = serializePitfallBlock(parsed);
    const validationError = validatePitfallPatchBlock(normalizedBlock);
    if (validationError) {
      return { error: `pitfall '${block.slug}' is invalid — ${validationError}` };
    }
  }

  if (expectedSlug) {
    const targetBlock = findPitfallBlockBySlug(sectionText, expectedSlug);
    if (!targetBlock) {
      return { error: `pitfall '${expectedSlug}' is missing after patching` };
    }
    const normalizedTargetBlock = serializePitfallBlock(parsePitfallBlock(targetBlock.text));
    if (!summaryReflectsPitfallSlug(expectedSlug, normalizedTargetBlock)) {
      return { error: `pitfall '${expectedSlug}' no longer matches its slug` };
    }
  }

  return { error: null };
}

export function buildFixPreviewText(fix) {
  const builtBlock = buildPitfallBlockTextFromFix(fix);
  return builtBlock.blockText ?? '';
}

export function applyPitfallFixToSectionText(sectionText, fix, target, filePath = '<memory>') {
  const operation = PITFALL_FIX_OPERATIONS.has(fix.operation)
    ? fix.operation
    : fix.old?.trim()
      ? 'replace_pitfall'
      : 'append_pitfall';
  const sourceOld = normalizeSourcePatchBlock(fix.old ?? '');
  const targetPitfallSlug = fix.targetPitfallSlug?.trim() ?? '';
  const newPitfallSlug = fix.newPitfallSlug?.trim() ?? '';

  const fail = (message, detail = '') => ({
    error: detail ? `${message}\n${detail}` : message,
  });

  const replaceRange = (text, start, end, replacement) =>
    text.slice(0, start) + replacement + text.slice(end);

  if (operation === 'append_pitfall' || target.appendOnly) {
    if (targetPitfallSlug) {
      return fail('append_pitfall must not set targetPitfallSlug');
    }
    if (!newPitfallSlug) {
      return fail('append_pitfall requires newPitfallSlug');
    }
    if (sectionText.includes(`<!-- pitfall: ${newPitfallSlug} -->`)) {
      return fail(`pitfall '${newPitfallSlug}' already present in ${filePath} - skipping append`);
    }

    const builtBlock = buildPitfallBlockTextFromFix(fix);
    if (builtBlock.error) {
      return fail(`new pitfall block is invalid - ${builtBlock.error}`);
    }

    const duplicateSummaryBlocks = findPitfallBlocksByNearDuplicateSummary(
      sectionText,
      builtBlock.pitfall.summary,
    );
    if (duplicateSummaryBlocks.length > 0) {
      return fail(
        `new pitfall summary duplicates existing slug(s): ${formatPitfallSlugList(duplicateSummaryBlocks)}. Use replace_subbullets with targetPitfallSlug '${duplicateSummaryBlocks[0].slug}' instead of append_pitfall.`,
      );
    }
    if (!summaryReflectsPitfallSlug(newPitfallSlug, builtBlock.blockText)) {
      return fail(`pitfall summary does not match new slug '${newPitfallSlug}'`);
    }

    const commentBlock = buildCommentBlock(target, newPitfallSlug, builtBlock.blockText);
    const updatedSection = sectionText.trimEnd() + commentBlock + '\n';
    const validation = validateUpdatedPitfallSection(updatedSection, newPitfallSlug);
    if (validation.error) {
      return fail(validation.error);
    }
    return { updatedSection, expectedSlug: newPitfallSlug };
  }

  if (!targetPitfallSlug) {
    return fail(`${operation} requires targetPitfallSlug`);
  }

  const targetResolution = resolvePitfallTargetBlock(
    sectionText,
    fix,
    targetPitfallSlug,
    sourceOld,
    filePath,
  );
  if (targetResolution.error) {
    return fail(targetResolution.error);
  }
  const targetBlock = targetResolution.block;
  const resolvedPitfallSlug = targetBlock.slug;

  if (sourceOld) {
    const oldMatch = findInSection(targetBlock.text, sourceOld);
    if (!oldMatch) {
      return fail(
        `old text not found in pitfall '${resolvedPitfallSlug}' of ${filePath}`,
        `Looking for: ${JSON.stringify(sourceOld.slice(0, 80))}`,
      );
    }
  }

  const existingPitfall = parsePitfallBlock(targetBlock.text);
  if (!existingPitfall) {
    return fail(`could not parse existing pitfall '${resolvedPitfallSlug}'`);
  }

  const builtBlock = buildPitfallBlockTextFromFix(fix, {
    comments: existingPitfall.comments,
    preserveProse: operation === 'replace_subbullets',
  });
  if (builtBlock.error) {
    return fail(`replacement pitfall block is invalid - ${builtBlock.error}`);
  }
  if (!summaryReflectsPitfallSlug(resolvedPitfallSlug, builtBlock.blockText)) {
    return fail(`replacement pitfall summary does not match slug '${resolvedPitfallSlug}'`);
  }

  const updatedSection = replaceRange(
    sectionText,
    targetBlock.start,
    targetBlock.end,
    builtBlock.blockText + (targetBlock.text.match(/\s*$/)?.[0] ?? ''),
  );
  const validation = validateUpdatedPitfallSection(updatedSection, resolvedPitfallSlug);
  if (validation.error) {
    return fail(validation.error);
  }
  return { updatedSection, expectedSlug: resolvedPitfallSlug };
}
