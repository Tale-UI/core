# Tale UI vs. "How Design Systems Reduce LLM Hallucinations" — Gap Analysis

## Context

The research report outlines 6 strategies (plus emerging practices) that design systems should adopt to reduce LLM hallucinations in generated UI code. This analysis maps every recommendation to Tale UI's current implementation, grades coverage, and identifies gaps.

**Grading:** **Full** = fully addressed | **Strong** = well covered with minor gaps | **Partial** = some coverage, notable gaps | **Weak** = minimal coverage | **None** = not addressed

---

## Strategy 1: Closed Contracts and Schemas for Components

### 1.1 LLM Component Schema Standards — **Full**

| Recommendation | Tale UI Implementation |
|---|---|
| Component identity and version | `registry/components.json` — 90 components with `name`, `slug`, `import`, `category`, `kind` |
| Prop list with types, defaults, allowed values | Every prop has `name`, `type`, `required`, `default`, `allowedValues` (enum constraints) |
| Variant definitions as unions | Typed as `Variant = 'primary' \| 'neutral' \| 'ghost' \| 'danger'` in TS; `allowedValues` in registry |
| Accessibility roles and ARIA attributes | Inherited from React Aria Components — built-in, not opt-in |
| State machines (hover, focus, disabled, etc.) | Documented via `data-*` attributes in CSS and docs; 10 state attributes enumerated in CLAUDE.md |
| Known patterns/recipes | `docs/recipes/` with multi-component patterns; `list_recipes` / `get_recipe` MCP tools |
| Anti-patterns | `docs/consumer-claude-md-snippet.md` — 40+ explicit gotchas ("do NOT do X") |
| Drift detection | `pnpm registry:check` verifies registry matches source; `pnpm audit:components` runs 19-point check |
| Agent evaluation harness | `tools/golden-prompts/` (83 prompts) + `tools/a2ui-golden-prompts/` (44 prompts) with L1–L3 scoring |

**Verdict: Full.** Tale UI implements every sub-recommendation. The registry is auto-generated from TypeScript source, drift is detected in CI, and an eval harness benchmarks LLM correctness. The A2UI catalog adds a second 135-type registry for declarative UI generation.

### 1.2 UXPin Merge / GPT Configuration — **Full (via MCP)**

| Recommendation | Tale UI Implementation |
|---|---|
| Whitelist visible components | MCP `list_components` returns only registered components |
| Map concepts to specific props/variants | MCP `search_components` uses 60+ synonyms (e.g., "dropdown" → Select/Combobox/Menu) |
| Example compositions as reference patterns | MCP `get_component` returns `examples` array; `get_recipe` returns multi-component patterns |
| Strict prompt: "Only use components from this library" | `docs/consumer-claude-md-snippet.md` and `CLAUDE.md` both enforce this constraint |

**Verdict: Full.** The MCP server is functionally equivalent to UXPin Merge's GPT configuration but deeper — it also supports validation (`validate_code`) and A2UI catalog querying.

### 1.3 Storybook AI Manifests and MCP — **Strong**

| Recommendation | Tale UI Implementation |
|---|---|
| Component Manifest with props/argTypes/controls | `registry/components.json` serves this role (not Storybook-generated but equivalent data) |
| MCP server exposing manifests | 10-tool MCP server at `tools/mcp-server.mjs` |
| Example stories and their args | `examples` field in registry + Storybook stories in `playground/storybook/` |
| Linked design tokens and theming info | `cssClasses` field in registry; full token reference in `ai-reference.md` |

**Minor gap:** The manifest is _not_ auto-generated from Storybook args/controls — it's generated from TypeScript source via `tools/generate-registry.js`. This is arguably better (source of truth is the type system, not Storybook), but it means Storybook stories are not the canonical source for examples.

**Verdict: Strong.** Exceeds the Storybook MCP recommendation in most dimensions; minor gap in that stories aren't the manifest source.

---

## Strategy 2: LLM-Readable Design Systems and Component Documentation

### 2.1 Structured Per-Component Documentation — **Full**

| Recommendation | Tale UI Implementation |
|---|---|
| Front-matter / metadata (id, name, import, status) | Registry JSON has all fields; docs have structured headers |
| Props table with type, required, default, allowedValues | Registry JSON + docs table per component |
| Canonical usage patterns (3–5 labeled examples) | Registry `examples` array + docs with multiple labeled examples |
| States and behavior (how states map to tokens/ARIA) | `data-*` attributes enumerated; CSS shows exact token mapping per state |
| Accessibility checklist | Inherited from React Aria (keyboard, labels, ARIA roles are built in) |
| Design ↔ code mapping (Figma ↔ code) | Not applicable — Tale UI is code-first, no Figma source |

**Verdict: Full.** Every per-component doc at `docs/components/{name}.md` follows a consistent template (imports, parts, props, examples, CSS classes). The 90-component `docs/component-index.md` provides an at-a-glance catalogue.

### 2.2 AI Instruction Files — **Full**

| Recommendation | Tale UI Implementation | File |
|---|---|---|
| CLAUDE.md with explicit rules | Monorepo-level + package-level | `CLAUDE.md`, `packages/css/CLAUDE.md` |
| Consumer-facing AI instructions | 132 KB template with 40+ gotchas | `docs/consumer-claude-md-snippet.md` |
| "Only use tokens, never hardcode" | Enforced in CLAUDE.md + audit scripts | `pnpm audit:brand`, `pnpm audit:bem` |
| "If component doesn't exist, leave TODO" | Implicit in consumer snippet (lists all available components) | — |
| Pre-commit validation scripts | 8+ audit scripts, all runnable in CI | `tools/audit-*.js`, `tools/validate-*.mjs` |
| Self-critique prompt | 5-step validation checklist | `tools/prompts/self-critique.md` |
| `llms.txt` standard file | Quick (10 KB) + full (321 KB) versions | `llms.txt`, `llms-full.txt` |

**Verdict: Full.** Tale UI goes beyond the recommendation by providing _three_ levels of AI instruction: monorepo contributor guide (CLAUDE.md), consumer template (consumer-claude-md-snippet.md), and self-critique prompt.

---

## Strategy 3: Token Architecture and Styling Methods

### 3.1 Token Layers: Primitive → Semantic → Component — **Strong**

| Recommendation | Tale UI Implementation |
|---|---|
| Primitive tokens (raw values) | `--brand-*` palette tokens (raw color values, NOT for component use) |
| Semantic tokens (intent-oriented) | `--color-*`, `--neutral-*`, `--space-*`, `--text-*-font-size`, `--label-*-font-size` |
| Component tokens (per-component slots) | Partially — components reference semantic tokens directly rather than having dedicated `--button-bg-*` tokens |
| "Only reference semantic tokens, never primitives" | **Strictly enforced**: CLAUDE.md states "NEVER use `--brand-*` in component CSS"; `pnpm audit:brand` catches violations |

**Gap:** Tale UI does **not** have a dedicated **component token** layer (e.g., `--button-bg-default`, `--button-radius`). Components reference semantic tokens directly. This is a deliberate simplification that reduces indirection but means per-component theming requires CSS overrides rather than token reassignment.

**Verdict: Strong.** Two clean layers (palette/primitive → semantic) with strict enforcement. Missing dedicated component-level tokens, which is a conscious trade-off.

### 3.2 Token Emission and CSS Usage — **Full**

| Recommendation | Tale UI Implementation |
|---|---|
| CSS variables consumed by components | All component CSS uses `var(--color-*)`, `var(--neutral-*)`, `var(--space-*)` etc. |
| LLMs manipulate class names/variant props, not CSS | BEM classes auto-applied; consumers use `variant`, `size` props |
| Dark mode via token inversion | `data-color-mode="dark"` on `<html>` inverts `--color-*` and `--neutral-*` automatically |

**Verdict: Full.** The entire styling architecture is token-first with zero hardcoded values in component CSS.

### 3.3 Agent-Friendly Styling Stack — **Full**

| Recommendation | Tale UI Implementation |
|---|---|
| Token-first CSS | All values are CSS custom properties |
| Predictable utility classes | Documented in `ai-reference.md` with exact allowed values and responsive variants |
| Minimal runtime CSS-in-JS | Zero CSS-in-JS — plain CSS files, no runtime |
| Static analysis can validate styling | `pnpm audit:brand` + `pnpm audit:bem` + `pnpm lint:css` |

**Verdict: Full.** CSS-first, zero-runtime, fully auditable.

---

## Strategy 4: Testing Tools, Methods, and Drift Detection

### 4.1 Static Checks and Schema Validation — **Full**

| Recommendation | Tale UI Implementation |
|---|---|
| TypeScript: strongly-typed props | All components use TS interfaces with union types for variants/sizes |
| ESLint rules | `pnpm eslint` (JS/TS); `pnpm lint:css` (CSS) |
| Schema validation | `validate-generated.mjs` — registry + tsc validation in one call |
| Drift detection | `pnpm registry:check`, `pnpm a2ui:check-catalog`, `pnpm a2ui:check-docs` — all CI-mode |

**Verdict: Full.** Drift detection across 5 artifact types (registry, A2UI catalog, A2UI docs, component docs, consumer snippet).

### 4.2 Storybook and Visual Regression — **Strong**

| Recommendation | Tale UI Implementation |
|---|---|
| Component Manifests as ground truth | Registry JSON (not Storybook-generated but functionally equivalent) |
| Visual regression (Playwright/Chromatic) | `pnpm test:chromium` runs browser tests; `ComponentAudit.tsx` exercises every component variant |
| Golden stories as test oracle | `golden-prompts/` serves this purpose (reference implementations, not Storybook stories) |

**Minor gap:** No mention of dedicated visual regression via Chromatic or screenshot comparison (Playwright browser tests exist but may focus on functional rather than pixel-level regression).

**Verdict: Strong.** ComponentAudit + Storybook + browser tests cover most ground; visual regression tooling (Chromatic/Percy) is not documented.

### 4.3 Token Audits and Hardcoded Value Detection — **Full**

| Recommendation | Tale UI Implementation |
|---|---|
| Scan for hardcoded values | `pnpm audit:brand` catches `--brand-*` in component CSS |
| Fail CI on violations | Audit scripts return non-zero exit codes |
| Apply equally to human and agent edits | Part of standard CI pipeline |

**Verdict: Full.**

### 4.4 Scenario-Based LLM Evaluation and Drift Monitoring — **Full**

| Recommendation | Tale UI Implementation |
|---|---|
| Suite of prompts with expected structures | 83 React golden prompts + 44 A2UI golden prompts |
| Automated agent runs | `pnpm golden:eval` + `pnpm a2ui:golden:eval` run prompts against models |
| Correctness metrics (pass/fail) | L1 (validity), L2 (component coverage), L3 (import/structural correctness) |
| Behavioral drift monitoring | Cacheable results enable comparison across model versions |
| Auto-fix pipeline | `pnpm golden:fix-review` evals, auto-fixes, and opens visual review |

**Verdict: Full.** This is one of Tale UI's strongest areas — the 3-level scoring system with auto-fix pipeline goes beyond the report's recommendations.

---

## Strategy 5: Deterministic vs Non-Deterministic LLM Usage

### 5.1 Deterministic Rendering Layer — **Strong**

| Recommendation | Tale UI Implementation |
|---|---|
| Split: planning (non-deterministic) → rendering (deterministic) | A2UI protocol is inherently this architecture: LLM plans the UI graph, renderer deterministically maps to Tale UI components |
| Schema/TS errors as hard failures → re-prompt | `validate_code` MCP tool returns errors; `golden:eval` treats L1 failures as fails |
| Normalize output for deterministic validation | A2UI validation checks structure, types, props, values, icon names deterministically |

**Gap:** For direct React code generation (not A2UI), there's no explicit "planning then rendering" split — the LLM generates JSX directly. The validation is post-hoc rather than constraining generation.

**Verdict: Strong.** The A2UI protocol is a textbook implementation of this strategy. Direct React code generation is less constrained but has strong post-hoc validation.

### 5.2 Non-Determinism is Acceptable Where? — **Full**

| Recommendation | Tale UI Implementation |
|---|---|
| Copy/tone generation | Not constrained by the system |
| Layout exploration | Multiple recipes/patterns available; LLM chooses |
| Filter through deterministic validation | `validate_code` + golden prompt eval pipeline |

**Verdict: Full.** The system correctly constrains API correctness while leaving creative decisions to the LLM.

---

## Strategy 6: Tooling Integrations and System Architecture

### 6.1 System of Record and Context Providers — **Full**

| Recommendation | Tale UI Implementation |
|---|---|
| Storybook catalog + Component Manifests | `registry/components.json` (90 components) + Storybook stories |
| Token files as single source of truth | `packages/css/src/` CSS modules + `ai-reference.md` enumeration |
| Component specs in structured format | `docs/components/{name}.md` (90 per-component guides) |
| MCP exposing all of the above | 10-tool MCP server at `tools/mcp-server.mjs` |
| zeroheight/Figma integration | N/A (code-first, no Figma source) |

**Verdict: Full.**

### 6.2 Agent and Guardrail Layers — **Full**

| Recommendation | Tale UI Implementation |
|---|---|
| Agent reads manifests/specs | MCP tools: `get_component`, `search_components`, `search_docs` |
| Agent proposes component graphs | A2UI `beginRendering` + `surfaceUpdate` messages |
| Typechecking | TypeScript compilation in `validate-generated.mjs` |
| ESLint | `pnpm eslint` |
| Schema validation | Registry + A2UI catalog validation |
| Token audits | `pnpm audit:brand`, `pnpm audit:bem` |
| Visual regression | `pnpm test:chromium` + Storybook |
| Scenario-based eval | Golden prompts (L1–L3) + A2UI golden prompts |

**Verdict: Full.** Every guardrail layer from the report is implemented.

---

## Emerging Practices and Open Challenges

### 7.1 Config-Driven Generative UI — **Full**

The A2UI protocol is exactly this pattern: agents assemble governed components via configuration objects (JSON messages) rather than writing arbitrary JSX. The 135-type catalog constrains what can be assembled.

### 7.2 Simplified Taxonomies and Naming — **Full**

Tale UI uses consistent naming: `size: 'sm' | 'md' | 'lg'`, `variant: 'primary' | 'neutral' | 'ghost' | 'danger'`. BEM naming is predictable: `.tale-{component}`, `.tale-{component}--{modifier}`, `.tale-{component}__{element}`.

### 7.3 Governance and Evolution — **Strong**

| Recommendation | Tale UI Implementation |
|---|---|
| Schema versioning | A2UI catalog has `schemaVersion: "1.0.0"` |
| Change logs | Not explicitly documented in research context |
| Drift detection | 5+ drift detection scripts in CI |
| Keeping agent contracts synchronized | `registry:check`, `a2ui:check-catalog`, `a2ui:check-docs` all CI-gated |

**Minor gap:** No explicit versioning or deprecation workflow for the React component registry (e.g., marking components as `deprecated` with a migration path).

### 7.4 Human-in-the-Loop — **Full**

`golden:fix-review` pipeline generates → validates → auto-fixes → opens visual review for human inspection. The self-critique prompt is designed for human-guided LLM review cycles.

---

## Summary Scorecard

| Strategy | Sub-area | Grade | Key Strength | Gap (if any) |
|---|---|---|---|---|
| **1. Closed Contracts** | 1.1 Schema Standards | Full | Registry + A2UI catalog + eval harness | — |
| | 1.2 GPT Configuration | Full | MCP with 60+ synonyms + validation | — |
| | 1.3 Storybook MCP | Strong | 10-tool MCP server | Manifest sourced from TS, not Storybook |
| **2. LLM-Readable Docs** | 2.1 Per-Component Docs | Full | 90 structured component guides | — |
| | 2.2 AI Instruction Files | Full | 3-tier instruction system + llms.txt | — |
| **3. Token Architecture** | 3.1 Token Layers | Strong | Strict palette/semantic split with audit | No component-level token layer |
| | 3.2 Token Emission | Full | Pure CSS variables, zero runtime | — |
| | 3.3 Styling Stack | Full | CSS-first, fully auditable | — |
| **4. Testing & Drift** | 4.1 Static Checks | Full | Registry + tsc + ESLint + 5 drift checks | — |
| | 4.2 Visual Regression | Strong | ComponentAudit + browser tests + Storybook | No Chromatic/Percy pixel comparison |
| | 4.3 Token Audits | Full | `audit:brand` + `audit:bem` in CI | — |
| | 4.4 LLM Eval & Drift | Full | 127 golden prompts, L1–L3 scoring, auto-fix | — |
| **5. Determinism** | 5.1 Deterministic Rendering | Strong | A2UI = plan/render split | Direct JSX gen lacks explicit split |
| | 5.2 Creative Freedom | Full | Validation constrains API, not UX choices | — |
| **6. Architecture** | 6.1 System of Record | Full | Registry + A2UI catalog + docs + MCP | — |
| | 6.2 Guardrail Layers | Full | Every recommended layer present | — |
| **7. Emerging** | 7.1 Config-Driven UI | Full | A2UI protocol | — |
| | 7.2 Naming Simplicity | Full | Consistent sm/md/lg + BEM | — |
| | 7.3 Governance | Strong | 5+ drift checks in CI | No explicit deprecation/versioning for React registry |
| | 7.4 Human-in-the-Loop | Full | fix-review visual review pipeline | — |

### Overall: **16 Full / 5 Strong / 0 Partial / 0 Weak / 0 None**

---

## Identified Gaps (ordered by potential impact)

### 1. No Component-Level Token Layer (Strategy 3.1)
**Current:** Components use semantic tokens directly (`var(--color-60)`, `var(--neutral-14)`).
**Report recommends:** Per-component tokens like `--button-bg-default` that map to semantic tokens, enabling component-level theming without CSS overrides.
**Impact:** Low-medium. Current approach is simpler and works well. Component tokens would add indirection but enable easier per-component theming and more precise LLM instructions ("set `--button-bg-default`" vs "override `.tale-button--primary` background").

### 2. No Pixel-Level Visual Regression (Strategy 4.2)
**Current:** Browser tests (Playwright) + ComponentAudit + Storybook stories.
**Report recommends:** Chromatic or Percy-style screenshot comparison for detecting subtle visual regressions.
**Impact:** Low. Browser tests catch functional issues; BEM + token system means visual bugs are rare. Chromatic would catch subtle spacing/alignment issues from token value changes.

### 3. No Explicit Component Deprecation/Versioning (Strategy 7.3)
**Current:** Registry has no `status` field (stable/experimental/deprecated). A2UI catalog has `schemaVersion`.
**Report recommends:** Version stamps and deprecation markers so agents don't use sunset components.
**Impact:** Low. All 90 components are currently stable. This becomes important when components are removed or APIs change.

### 4. Direct JSX Generation Lacks Plan/Render Split (Strategy 5.1)
**Current:** For React code (not A2UI), the LLM generates JSX directly; validation is post-hoc.
**Report recommends:** Separating planning (what components, what layout) from rendering (actual JSX emission) for more constrained generation.
**Impact:** Low. The post-hoc validation (`validate_code` MCP tool + golden prompt eval) is effective. The A2UI protocol already implements the split for declarative use cases.

---

## Conclusion

Tale UI is a **reference-grade implementation** of the strategies outlined in the research report. It scores Full on 16 of 21 sub-areas and Strong on the remaining 5, with zero Partial/Weak/None scores. Its standout features relative to the report's recommendations are:

1. **Dual registry system** — Both a React component registry (90 components) and an A2UI declarative catalog (135 types), each with dedicated golden prompt evaluation
2. **3-tier AI instruction architecture** — Contributor guide (CLAUDE.md) + consumer template (consumer-claude-md-snippet.md) + self-critique prompt
3. **127 golden prompts with 3-level scoring** — Beyond what the report envisions for scenario-based evaluation
4. **Auto-fix pipeline** (`golden:fix-review`) — Eval → auto-fix → visual review is not mentioned in the report at all
5. **A2UI protocol** — A complete implementation of the report's "config-driven generative UI" emerging practice, with full validation, few-shot examples, and a system prompt

The 4 identified gaps are all low-impact, conscious trade-offs rather than oversights.

---

## Deliverable

Write a polished standalone markdown summary document at `research/Tale UI — LLM Hallucination Reduction Analysis.md` (alongside the source report). The document should be stakeholder-friendly: concise, well-structured with the scorecard table, key strengths, identified gaps, and conclusion. No code changes required.
