export const PITFALL_SHAPE_STOPWORDS = new Set([
  // Generic English stopwords
  'no',
  'not',
  'is',
  'a',
  'an',
  'the',
  'on',
  'in',
  'for',
  'with',
  'use',
  'uses',
  'used',
  'using',
  'are',
  'be',
  'it',
  'its',
  'of',
  'to',
  'from',
  'or',
  'and',
  'do',
  'does',
  'only',
  'always',
  'never',
  // Structural slug terms (describe shape, not the rule content)
  'sub',
  'part',
  'parts',
  'valid',
  'values',
  'value',
  'required',
  'correct',
  'explicit',
  'missing',
  'type',
]);

export const PITFALL_SLUG_ABBREVS = {
  rac: 'react-aria-components',
  btn: 'button',
  bg: 'background',
  ap: 'antipattern',
};

const STEM_LEN = 4;

export function stripBacktickContent(str) {
  return str.replace(/`[^`]*`/g, '');
}

export function tokenize(str) {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter(Boolean);
}

function compactPathTokens(str) {
  const matches = str.toLowerCase().match(/@?[a-z0-9][a-z0-9-]*(?:\/[a-z0-9][a-z0-9-]*)+/g);
  if (!matches) {
    return [];
  }
  return matches
    .map((match) => match.replace(/[^a-z0-9]/g, ''))
    .filter((token) => token.length > 1);
}

export function tokenizeSummary(str) {
  return [...tokenize(str), ...compactPathTokens(str)];
}

export function dropStopwords(tokens) {
  return tokens.filter((token) => !PITFALL_SHAPE_STOPWORDS.has(token) && token.length > 1);
}

export function componentTokensForSlug(componentSlug = '') {
  return dropStopwords(tokenize(componentSlug.replace(/-/g, ' ')));
}

export function normalizeForComparison(str) {
  return dropStopwords(tokenize(stripBacktickContent(str)));
}

export function stemMatch(a, b) {
  if (a === b) {
    return true;
  }
  if (
    a.length >= STEM_LEN &&
    b.length >= STEM_LEN &&
    a.slice(0, STEM_LEN) === b.slice(0, STEM_LEN)
  ) {
    return true;
  }
  const min = Math.min(a.length, b.length);
  if (min >= 3 && (a.startsWith(b.slice(0, min)) || b.startsWith(a.slice(0, min)))) {
    return true;
  }
  if (a.length >= 3 && b.includes(a)) {
    return true;
  }
  if (b.length >= 3 && a.includes(b)) {
    return true;
  }
  return false;
}

export function slugSummaryMatch(slug, summary, options = {}) {
  const componentTokens =
    options.componentTokens ?? componentTokensForSlug(options.componentSlug ?? '');
  const slugTokens = dropStopwords(tokenize(slug.replace(/-/g, ' ')));
  if (slugTokens.length === 0) {
    return true;
  }

  const ruleTokens = slugTokens.filter((token) => !componentTokens.includes(token));
  if (ruleTokens.length === 0) {
    return true;
  }

  const summaryWords = dropStopwords(tokenizeSummary(summary));
  const expandedTokens = ruleTokens.map((token) => PITFALL_SLUG_ABBREVS[token] || token);

  let matched = 0;
  for (const slugToken of expandedTokens) {
    if (summaryWords.some((summaryWord) => stemMatch(slugToken, summaryWord))) {
      matched += 1;
    }
  }
  return matched / expandedTokens.length >= 0.4;
}
