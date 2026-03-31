/**
 * A2UI Response Parser
 *
 * Extracts A2UI messages from LLM text output and validates them.
 * Handles clean JSON arrays, markdown-fenced JSON, and error cases.
 */

import type { A2UIMessage } from '@tale-ui/a2ui/types';
import { validateMessages, formatErrors } from '@tale-ui/a2ui/validation';
import { taleUICatalog } from '@tale-ui/a2ui/catalog';

export interface ParseResult {
  messages: A2UIMessage[] | null;
  errors: string | null;
  raw: string;
}

/**
 * Parse LLM text output into A2UI messages.
 * Tries multiple strategies: raw JSON, markdown-fenced JSON.
 * Validates against the Tale UI catalog.
 */
export function parseA2UIResponse(text: string): ParseResult {
  const trimmed = text.trim();

  // Strategy 1: Direct JSON parse
  const direct = tryParse(trimmed);
  if (direct) return validate(direct, trimmed);

  // Strategy 2: Extract from markdown code fence
  const fenceMatch = trimmed.match(/```(?:json)?\s*\n?([\s\S]*?)\n?\s*```/);
  if (fenceMatch) {
    const fenced = tryParse(fenceMatch[1]!.trim());
    if (fenced) return validate(fenced, trimmed);
  }

  // Strategy 3: Find first [ ... ] in the text
  const bracketStart = trimmed.indexOf('[');
  const bracketEnd = trimmed.lastIndexOf(']');
  if (bracketStart !== -1 && bracketEnd > bracketStart) {
    const extracted = tryParse(trimmed.slice(bracketStart, bracketEnd + 1));
    if (extracted) return validate(extracted, trimmed);
  }

  return {
    messages: null,
    errors: 'Could not extract valid JSON from the response. The LLM output was not a JSON array of A2UI messages.',
    raw: trimmed,
  };
}

function tryParse(text: string): unknown[] | null {
  try {
    const parsed = JSON.parse(text);
    if (Array.isArray(parsed)) return parsed;
    // Single message wrapped as object
    if (parsed && typeof parsed === 'object' && 'type' in parsed) return [parsed];
    return null;
  } catch {
    return null;
  }
}

function validate(parsed: unknown[], raw: string): ParseResult {
  const result = validateMessages(parsed, taleUICatalog);
  if (!result.valid) {
    return {
      messages: null,
      errors: formatErrors(result.errors),
      raw,
    };
  }
  return {
    messages: parsed as A2UIMessage[],
    errors: null,
    raw,
  };
}
