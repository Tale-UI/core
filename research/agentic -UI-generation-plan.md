# Action plan: agentic UI generation with `@tale-ui/react`

You can’t make hallucinations impossible, but you can get very close by treating `@tale-ui/react` as a **machine-readable API surface** (schema + tools) and wrapping generation in a strict validate–correct loop.[web:24][web:27] This plan assumes you control the library and docs and want agents to reliably emit working tale-ui code, not generic React UI.[cite:16][cite:18]

---

## Goals and constraints

Design for this outcome:

- Agent **only** uses `@tale-ui/react` exports and valid props.
- Agent can **discover** components and usage via tools instead of guessing.
- Every generation passes through **type/ESLint checks + self-critique** before you ship it.
- The system is **versioned and regenerable** when tale-ui evolves.

---

## Phase 1 – Make tale-ui “agent-readable”

Treat your component library like an API you expose via schema, not just TypeScript.

1. **Enforce a predictable export shape**
   - One entry per component with clear, stable names (no surprise re-exports).
   - Grouped barrel exports only where it matches how you want agents to import (`import { Button } from "@tale-ui/react"`).
   - Keep compound components explicit (`<Dialog.Root>`, `<Dialog.Trigger>`) or with consistent subcomponent naming.

2. **Generate a component registry from source**
   - Create a build step that emits a JSON registry like:

     ```json
     {
       "name": "Button",
       "import": "@tale-ui/react",
       "kind": "component",
       "description": "Primary action button.",
       "props": [
         { "name": "variant", "type": "'primary' | 'ghost'", "required": false, "description": "Visual style" },
         { "name": "size", "type": "'sm' | 'md' | 'lg'", "required": false },
         { "name": "asChild", "type": "boolean", "required": false }
       ],
       "examples": [
         "import { Button } from '@tale-ui/react';\n\n<Button variant=\"primary\">Save</Button>"
       ]
     }
     ```

   - Use TS AST (ts-morph) or your existing build tooling to extract:
     - Prop names/types/defaults.
     - JSDoc descriptions.
     - Allowed literal values (for variants).
   - This mirrors MCP-style registries and JSON-schema-based tools for UI libraries.[web:24][web:29][web:34]

3. **Codify conventions in comments**
   - Add short, consistent JSDoc on components and props; these are ingested into the registry and become high-signal grounding for RAG and tools.[web:37]
   - Example: `/** Visual importance of the button; use "primary" for main CTAs. */` on `variant`.

**Deliverable for this phase:** `registry/components.json` (or similar) checked into the repo and updated in CI.

---

## Phase 2 – Expose the registry via MCP/tools

Next, give agents a *protocol* to query tale-ui instead of guessing from pretraining.

1. **Implement a minimal MCP (or tool) server for tale-ui**
   - Base it on patterns from “MCP server for UI libraries”: one tool to list components, one to get details.[web:24][web:29][web:34]
   - Tools you likely want:
     - `taleui.list_components() -> [{ name, import, summary }]`
     - `taleui.get_component({ name }) -> { props, examples, usage_notes }`
     - `taleui.search_components({ intent, layout_hints }) -> [...]`
   - Under the hood, these just read `components.json` and maybe some extra metadata.

2. **Validate registry data with schemas**
   - Use Zod or pure JSON Schema to validate registry entries at runtime when the server starts.[web:24][web:34]
   - This catches drift between code and registry early and keeps what the agent sees trustworthy.

3. **Wire the server into your agent framework**
   - In LangGraph/LangChain/etc, register these as tools so the agent can call them during planning and codegen.[web:28][web:33][web:38]
   - Encourage use in prompts: "Before writing any UI code, call `taleui.search_components` to choose appropriate components."

**Deliverable:** `taleui-mcp` (or equivalent) service that any agent client (CLI, VSCode, Cursor, etc.) can talk to.

---

## Phase 3 – Author strict “Tale UI rules” prompts

Now you make the model behave like a Tale UI specialist rather than a generic React dev.

1. **Create a “Tale UI Rules” spec (Shadcn-style)**
   - Inspired by shadcn/cursor rules docs that encode patterns, composition, and pitfalls.[web:25][web:30][web:35]
   - Include:
     - File naming/import style.
     - Layout and composition patterns (`Stack`, `Grid`, etc., or tale-ui equivalents).
     - Common component combos (e.g., `Form` + `Input` + `FieldError`).
     - Accessibility expectations (labels, aria, focus handling).
   - Store as a markdown or `.mdc` rules file you can feed as system prompt or MCP resource.

2. **System prompt template for UI codegen**
   - Core instructions:
     - "Use **only** components from `@tale-ui/react`; never invent new imports or packages."  Package hallucination is a real, measured problem.[web:32]
     - "Always call `taleui.get_component` before using a component you haven’t used in this conversation."
     - "After generating code, perform a self-check: list all components and props, and verify each one exists in the retrieved registry entries."
   - Add a style section derived from your design language and rules spec.[cite:17]

3. **Self-critique + repair loop**
   - Implement a simple 2-step agent pattern:
     1. Draft UI code.
     2. Call a second pass with instructions:
        "Given the registry responses and TypeScript errors, rewrite the code so that all imports and props are valid tale-ui usage."[web:27][web:31]
   - This "LLM as hallucination detector" approach has empirical support when combined with good context.[web:31]

**Deliverables:**

- `PROMPT_TALEUI_RULES.md`
- A reusable system prompt and tool-usage template for all your agent entry points.

---

## Phase 4 – TypeScript, lint, and tests as hard guardrails

Make it impossible for hallucinations to silently pass.

1. **Max out TS strictness and surface d.ts to the model**
   - Enable `strict`, `exactOptionalPropertyTypes`, `noImplicitAny`, `noUncheckedIndexedAccess`, etc.
   - Ensure the agent sees your **actual** tale-ui `.d.ts` (either via tools or as context snippets) so it doesn’t rely on pretraining guesses.[web:27]

2. **Automatic static checks on generated code**
   - Wrap the agent in a thin execution harness:
     - Ask the model for `ui.tsx`.
     - Run `tsc --noEmit` and ESLint on the result.
     - If there are errors, feed the diagnostics back into the self-critique step and have the agent fix them.[web:27]
   - Persist failures and patches; over time this gives you a dataset of "hallucination → fix" examples.

3. **Runtime/component tests for critical patterns**
   - For key components (forms, dialogs, navigation), keep a minimal Playwright or RTL test suite.
   - Optionally have an "AI scenario test" file where the agent is prompted to generate variants and the harness checks rendering + basic interactions.

**Deliverables:**

- Hardened TS config.
- `taleui-agent-harness` script or service that runs: generate → typecheck → lint → repair.

---

## Phase 5 – RAG over docs and recipes

Ground the model in your **docs and examples**, not just schema.

1. **Index documentation and code recipes**
   - Embed:
     - API docs.
     - Migration guides (e.g., Radix/React Aria → tale-ui).[cite:20]
     - Real example screens built with tale-ui.[web:37]
   - Use a small vector store or a flat embedding index.

2. **RAG step before codegen**
   - Before writing code, the agent:
     - Interprets the user’s UI request.
     - Runs a RAG query: "Find examples of tale-ui forms with validation" etc.
     - Inlines 1–3 best matches into context, and only then generates code.
   - RAG + guardrails substantially reduce hallucinations, though not to zero.[web:26][web:31][web:36]

**Deliverable:** a tiny `taleui-docs-search` tool used by your agent plans.

---

## Phase 6 – Evaluation, golden prompts, telemetry

Close the loop so you can see whether hallucinations are actually going down.

1. **Golden prompt set**
   - Curate 20–50 representative UI tasks:
     - Simple: "Primary CTA button with icon."
     - Medium: "Auth form with email/password and error states."
     - Complex: "Dashboard layout with sidebar nav, header, filters, data table, and pagination."
   - For each, maintain a reference implementation you consider canonical.

2. **Automated evaluation**
   - Nightly/CI job:
     - Run the agent on each golden prompt.
     - Diff outputs against reference code (AST- or rule-based, not pure text).
     - Run typechecks/tests and record:
       - Import/prop violations.
       - Layout/accessibility violations where you can codify rules.

3. **Hallucination metrics**
   - Track:
     - % of generations that require repair.
     - Common failure modes (invented props, wrong import, wrong composition, etc.), using known taxonomies of code hallucinations as a guide.[web:27][web:32]
   - Use this to refine:
     - Registry coverage.
     - Rules prompt.
     - Which components need better examples.

---

## Phase 7 – DX integration: editors and CLI

Make it easy for you to use this safely day-to-day.

1. **CLI wrapper**
   - `npx tale-ui agent`:
     - Takes a brief spec or Figma reference.
     - Calls the full pipeline (tools + RAG + checks).
     - Writes components into your repo.

2. **Editor integration**
   - Provide your MCP server + rules spec to tools like Cursor, Windsurf, or VSCode extensions.
   - They already support Shadcn-style rule bundles; you’re essentially shipping a “Tale UI expert” profile.[web:25][web:30][web:35][web:37]

3. **Versioning story**
   - Stamp the registry, docs index, rules, and d.ts with a **tale-ui schema version**.
   - When you ship breaking changes, bump the version and allow agents to query which version they’re targeting.

---

## Priority checklist

If you want a practical order for the next 1–2 weeks:

1. **Today–Tomorrow**
   - Harden TypeScript + ESLint.
   - Normalize exports for all public components.

2. **Next 2–4 days**
   - Build the **component registry generator** from your TS source and commit `components.json`.

3. **Next week**
   - Implement a small MCP/tools server around that registry.
   - Draft **Tale UI Rules** doc and initial system prompt.

4. **Following week**
   - Wrap an agent harness with generate → typecheck → repair.
   - Add a handful of golden prompts and start logging failure modes.
