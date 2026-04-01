/**
 * System Prompt Assembly
 *
 * Loads the A2UI system prompt and appends response format instructions.
 * Shared by all LLM provider clients.
 */

import systemPromptMd from '@tale-ui/a2ui/src/agent/system-prompt.md?raw';

const RESPONSE_INSTRUCTIONS = `

## Response Format

You MUST respond with a JSON array of A2UI messages. Do not include markdown fences, explanatory text, or anything else around the JSON. Your entire response must be a valid JSON array.

Each response should start with a beginRendering message, followed by one or more surfaceUpdate messages, and optionally dataModelUpdate messages.

Use surfaceId "main" for all surfaces.

**dataModelUpdate format.** If you include dataModelUpdate messages, each MUST have \`surfaceId\`, \`path\` (string), and \`value\`:

\`\`\`
{ "type": "dataModelUpdate", "surfaceId": "main", "path": "fieldName", "value": "fieldValue" }
\`\`\`

Alternatively, use a \`data\` object to set multiple values at once:

\`\`\`
{ "type": "dataModelUpdate", "surfaceId": "main", "data": { "field1": "value1", "field2": "value2" } }
\`\`\`

Do NOT omit both \`path\` and \`data\` — one of them is required.

**CRITICAL: Component format.** Each component in the surfaceUpdate components array MUST use this exact structure:

\`\`\`
{ "id": "myId", "component": { "TypeName": { ...props, "children": ["childId1", "childId2"] } } }
\`\`\`

Do NOT use \`"type"\`, \`"props"\`, or top-level \`"children"\` fields. The component type name and all its props (including children IDs) go INSIDE the \`"component"\` object.

**Example — a Column with a Button:**

\`\`\`
[
  { "type": "beginRendering", "surfaceId": "main", "rootComponentId": "root" },
  { "type": "surfaceUpdate", "surfaceId": "main", "components": [
    { "id": "root", "component": { "Column": { "spacing": "m", "children": ["btn"] } } },
    { "id": "btn", "component": { "Button": { "label": "Click me", "variant": "primary", "action": { "name": "click" } } } }
  ]}
]
\`\`\`

When the user asks you to modify the current UI, send a complete new set of messages (beginRendering + surfaceUpdate) that replaces the current surface.

When a user action is dispatched back to you (prefixed with [Action]), respond with updated A2UI messages if the UI should change, or a brief JSON array with just a Text component acknowledging the action.

**CRITICAL: Response size limits.** Your output WILL be truncated if you exceed the token limit, which will produce INVALID JSON and a broken UI. You MUST keep responses under 80 component nodes per surfaceUpdate. If the user asks for a very large UI (e.g. "show all components", "include everything"), you MUST NOT try to include all components. Instead:
1. Build a focused, representative UI with 30-50 components covering a variety of component types
2. End the JSON array properly (close all brackets)
3. Add a final Text component explaining that more sections are available on request

NEVER sacrifice valid JSON for completeness. A working UI with fewer components is always better than a truncated response.`;

const SYSTEM_PROMPT: string = systemPromptMd + RESPONSE_INSTRUCTIONS;

export function getSystemPrompt(): string {
  return SYSTEM_PROMPT;
}
