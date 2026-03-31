/**
 * System Prompt Assembly
 *
 * Loads the A2UI system prompt and appends response format instructions.
 * Shared by all LLM provider clients.
 */

// @ts-expect-error Vite raw import
import systemPromptMd from '@tale-ui/a2ui/src/agent/system-prompt.md?raw';

const RESPONSE_INSTRUCTIONS = `

## Response Format

You MUST respond with a JSON array of A2UI messages. Do not include markdown fences, explanatory text, or anything else around the JSON. Your entire response must be a valid JSON array.

Each response should start with a beginRendering message, followed by one or more surfaceUpdate messages, and optionally dataModelUpdate messages.

Use surfaceId "main" for all surfaces.

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

When a user action is dispatched back to you (prefixed with [Action]), respond with updated A2UI messages if the UI should change, or a brief JSON array with just a Text component acknowledging the action.`;

const SYSTEM_PROMPT: string = systemPromptMd + RESPONSE_INSTRUCTIONS;

export function getSystemPrompt(): string {
  return SYSTEM_PROMPT;
}
