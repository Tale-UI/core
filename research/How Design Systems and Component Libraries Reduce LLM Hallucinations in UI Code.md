# How Design Systems and Component Libraries Reduce LLM Hallucinations in UI Code

## Executive Summary

As teams increasingly use large language models (LLMs) and agentic coding tools to generate UI, design systems and component libraries are adapting to prevent hallucinations in prop names, variants, and fine-grained component behavior. The emerging pattern is to treat the design system as a **machine-readable contract**, backed by schemas, curated documentation, and automated audits rather than just human-facing guidelines.[^1][^2][^3][^4]

Key measures include:

- Constraining agents to **closed vocabularies** of components, props, and variants via schemas, Storybook manifests, UXPin Merge configs, and zeroheight/Figma integrations.[^3][^5][^6][^7]
- Making design systems **LLM-readable** by restructuring tokens and component specs into structured markdown, JSON, and manifest files that tools can ingest deterministically.[^2][^8][^1]
- Using **automated drift detection and CI audits** to catch hardcoded values, invalid tokens, or API mismatches when agents generate or modify code.[^4][^7][^1][^2]
- Providing **agent-oriented prompts and instruction files** (CLAUDE.md, Cursor rules, system prompts) that explicitly forbid guessing and require adherence to tokens and specs.[^9][^1][^2][^3]
- Architecting the overall system so that LLMs plan non-deterministically but are forced through deterministic, schema-validated rendering steps for actual UI code.[^5][^10][^4]

Together, these techniques move LLMs away from “vibe coding” and toward **contract-based composition**, where the only valid outputs are those that match the design system’s formal specification.[^1][^5]

## Background: Why LLMs Hallucinate UI Details

LLMs hallucinate props, variants, and structural details because they are trained on a broad corpus of generic components, design systems, and UI code, then asked to target a specific system without a strong contract. Without tight constraints, they infer patterns from training data—e.g. inventing `variant="primary"` for a library that actually uses `appearance="primary"`—and confidently output syntactically valid but semantically wrong code.[^3][^5][^1]

General hallucination mitigation advice—RAG, prompt tuning, and controlled decoding—reduces some errors but is insufficient for UI code, where a single wrong prop can break the component or silently violate accessibility rules. Design systems therefore focus on **shaping the context and contract** (what the model sees and what counts as valid) rather than just the decoding parameters.[^11][^12][^13]

***

## Strategy 1: Closed Contracts and Schemas for Components

### 1.1 LLM Component Schema Standards

Emerging standards propose explicit **component schemas** that describe structure, behavior, accessibility, and constraints in machine-readable form. These schemas typically include:[^4]

- Component identity and version.
- Prop list with names, types, required flags, default values, and allowed literal unions.
- Variant definitions (e.g. `variant`, `size`, `tone`) and valid combinations.
- Accessibility roles and required ARIA attributes.
- State machines (default, hover, focus, active, disabled, loading, error, success).
- Known patterns/recipes and anti-patterns.

By exposing these schemas to agents, the design system defines a **closed world** of allowed props and variants, so agents select from enumerated options rather than inventing new names. Some schema projects also include **drift detection** between schema, Storybook args, and source code, and an **agent evaluation harness** that tests whether agents can correctly apply components from schema alone.[^4]

### 1.2 UXPin Merge and GPT Configuration

UXPin Merge integrates coded design systems (e.g., MUI, Ant Design, Shadcn, custom React libraries) with GPT so that AI builds UIs using real components instead of generic HTML. Teams upload JSON or config files describing component APIs, then attach strict prompts, such as:[^3]

> "You are a front-end developer using the [Design System] library. Only use components available in this library. Do not use standard HTML tags like `<button>` unless the library lacks an equivalent."[^3]

UXPin lets teams:

- Whitelist which components are visible to the AI.
- Map user-facing concepts (e.g. "primary button") to specific props/variants.
- Provide example compositions as reference patterns.

This approach prevents GPT from inventing new components or props, while ensuring that generated UIs stay within the library’s supported variants and tokens.[^3]

### 1.3 Storybook AI Manifests and MCP

Storybook’s AI integration produces a **Component Manifest**—a compact artifact with props, argTypes, controls, and design token bindings—for each component. The manifest is then exposed via a Model Context Protocol (MCP) server so agents can query it directly instead of scraping source files.[^14][^5]

Manifests typically embed:

- Prop names, types, and defaults (from `react-docgen` / TS metadata).[^14]
- Variant options and descriptions.
- Example stories and their args.
- Linked design tokens and theming info.

Agents consume this succinct manifest, which dramatically reduces prop and variant hallucinations and encourages reuse of documented stories as canonical patterns.[^7][^5]

***

## Strategy 2: LLM-Readable Design Systems and Component Documentation

### 2.1 Structured Per-Component Documentation

For LLM use, component documentation needs to be **normalized, structured, and machine-parseable**, not just human-friendly prose. A robust per-component doc pattern includes:[^7][^1]

1. **Front-matter / metadata**
   - `id`, `name`, `package`, `importPath`, `status` (stable/experimental/deprecated).
2. **Props and variants**
   - One table pre prop with: `name`, `type`, `required`, `default`, `allowedValues`, `description`, `tokensUsed`.
   - Variants explicitly modeled as union types, e.g. `variant: 'primary' | 'secondary' | 'ghost'`.
3. **Canonical usage patterns**
   - 3–5 labeled examples (primary CTA, secondary action, destructive, icon-only, inline), each with code snippet and intent tag.
4. **States and behavior**
   - How each state (hover/focus/disabled/loading/error) maps to tokens, ARIA roles, and visual changes.
5. **Accessibility checklist**
   - Keyboard interactions, required labels, ARIA rules, focus handling.
6. **Design ↔ code mapping**
   - Figma variant names ↔ code props, based on tools like zeroheight’s Figma property mapping.[^6]

Because this structure is consistent across components and often encoded as MD/MDX with front-matter, MCP servers and RAG pipelines can reliably feed it to LLMs.[^1][^7]

### 2.2 Specs and “LLM Instruction” Files

Design-system authors are increasingly creating dedicated AI instruction files—e.g. `CLAUDE.md`, `.cursorrules`, `AI_USAGE.md`—with explicit rules for agents. Typical instructions include:[^2][^9][^1]

- Always read the relevant spec in `specs/components/<name>.md` before editing related code.
- Use only tokens defined in `tokens.json` / `tokens.css`; never hardcode color/spacing/typography.
- If a required component or variant does not exist, leave a TODO and reference the spec instead of inventing one.
- Before commit, run token audits and schema validation scripts; zero errors are allowed.

This converts “best practice” from tribal knowledge into **hard constraints that agents are required to follow**, drastically reducing hallucinated API surface area.[^9][^2]

***

## Strategy 3: Token Architecture and Styling Methods

### 3.1 Token Layers: Primitive → Semantic → Component

Modern design systems structure tokens in layers that are both design-useful and LLM-friendly.[^15][^8][^16][^17]

1. **Primitive tokens** (value-oriented)
   - Raw values for color, spacing, typography, motion.
   - Examples: `color.blue.500`, `space.2`, `font.size.200`, `radius.200`, `motion.duration.fast`.[^16]
   - Stored as platform-agnostic JSON; emitted to CSS variables.

2. **Semantic tokens** (intent-oriented)
   - Names describe role, not value: `color.bg.canvas`, `color.text.muted`, `color.border.subtle`, `color.brand.primary`, `space.stack.section`, `motion.easing.standard`.[^8][^17]
   - Map to primitives; agents and app code should use these exclusively.

3. **Component tokens**
   - Per-component slots, e.g. `button.bg.default`, `button.bg.hover`, `button.radius`, `button.padding.inline`.
   - Map to semantic tokens so teams can restyle components without changing code.[^8]

Agents are instructed to **only reference semantic and component tokens**, never primitives or raw values, which constrains the styling vocabulary and prevents hallucinated hex codes or spacing values.[^8][^1]

### 3.2 Token Emission and CSS Usage

Token systems typically emit CSS variables that components consume:[^15][^16]

```css
:root {
  --color-bg-canvas: #0b1020;
  --color-text-default: #e5e7eb;
  --space-2: 0.5rem;
  --radius-md: 0.5rem;
  --motion-duration-fast: 150ms;
  --motion-easing-standard: cubic-bezier(0.2, 0, 0, 1);
}

.t-button {
  color: var(--color-text-default);
  background: var(--button-bg-default);
  padding-inline: var(--button-padding-inline);
  border-radius: var(--button-radius);
}
```

LLMs then manipulate **class names and variant props** (which map to tokenized styles), rather than free-form CSS, significantly reducing styling hallucinations.[^15][^1]

### 3.3 Styling Stack Choices

To be agent-friendly, styling stacks prioritize:

- Token-first CSS (variables from JSON tokens) over ad-hoc values.[^16][^15]
- Predictable, documented utility classes (if used) defined and owned by the design system.
- Minimal runtime CSS-in-JS magic; styles should be discoverable from docs and manifests.

This ensures that static analysis, linting, and schema checks can all see and validate the actual styling choices an agent makes.

***

## Strategy 4: Testing Tools, Methods, and Drift Detection

### 4.1 Static Checks and Schema Validation

Design systems use multiple static layers to reject invalid agent output before it merges:

- **TypeScript**: strongly-typed props and variants; unknown props or invalid unions are compile-time errors.
- **ESLint**: custom rules that ban raw hex colors, un-tokenized spacing, direct DOM elements where DS components should be used, and missing accessibility props.
- **LLM Component Schema validation**: validating both components and generated UI against schema to ensure props/variants/states are allowed.[^4]

Schema tools also provide **drift detection**, catching mismatches between TS types, Storybook args, and schema definitions when the design system evolves.[^4]

### 4.2 Storybook, MCP, and Visual Regression

Storybook’s AI integration and best-practice guides recommend using:[^5][^14][^7]

- **Component Manifests** as the ground truth for agent usage.
- **Playwright/Chromatic** for visual regression on core stories to detect visual deviations in agent-touched components.
- **Args-based golden stories** as a test oracle; generated stories are compared structurally and visually to expected ones.

If an agent generates a new variant composition, CI runs the Storybook test suite plus visual regression; any failure indicates incompatibility with the design system contract.[^5][^7]

### 4.3 Token Audits and Hardcoded Value Detection

Token audit scripts scan the codebase for **hardcoded values** and suggest token replacements, often failing CI when violations exist. This applies equally to human and agent edits and drives convergence toward full token usage over time.[^2][^1]

### 4.4 LLM Application Testing and Model Drift

Recent work on testing LLM applications emphasizes scenario-based evaluation and drift monitoring rather than just unit tests. For UI generation, this translates to:[^10]

- A suite of prompts with expected component/prop structures.
- Automated runs where agents generate UI given current manifests.
- Metrics on correctness (pass/fail) and behavioral drift over time.

Data-drift literature provides techniques (PSI, KL, chi-square tests) to detect when the distribution of generated props/variants changes materially, indicating that the model or prompts may need recalibration.[^18][^19][^20]

***

## Strategy 5: Deterministic vs Non-Deterministic LLM Usage

### 5.1 Deterministic Rendering Layer

To avoid hallucinated API details, many architectures split LLM usage into:

- **Planning**: non-deterministic, higher-temperature generation of component graphs, layout alternatives, or UX flows.
- **Rendering**: deterministic or near-deterministic conversion from plans to concrete UI code, strictly conforming to schemas and manifests.[^10][^5][^4]

At the rendering layer, teams often:

- Set temperature to 0 (or very low) and constrain sampling.[^11]
- Treat TS/schema/ESLint errors as *hard failures* that trigger a re-prompt with explicit error feedback instead of manual patching.
- Normalize output (e.g. format AST, sort props) so validation is deterministic.

### 5.2 Where Non-Determinism is Acceptable

Non-determinism remains useful for:

- Copy and tone (microcopy variants, headings, helper text).
- High-level layout exploration (bento vs list vs table for given content).
- Choosing between multiple valid component combinations that all satisfy the schema.

In these contexts, a common pattern is:

- Generate multiple candidate plans at higher temperature.
- Filter them through deterministic validation (schema, tests, visual regression).
- Let humans or ranking heuristics choose among the valid subset.

This keeps creativity at the UX/content level while maintaining strict correctness at the component/API level.[^10]

***

## Strategy 6: Tooling Integrations and System Architecture

### 6.1 System of Record and Context Providers

A typical agent-integrated DS architecture includes:[^21][^7][^5]

- **System of record**
  - Storybook catalog plus Component Manifests.
  - Token JSON files as the single source of truth for visual decisions.
  - Component and foundation specs in `specs/` (MD/MDX or similar).
- **Context providers**
  - Storybook MCP exposing component manifests, stories, and tests.
  - zeroheight/Figma MCP exposing design-side variants, properties, and docs.[^22][^23][^6][^21]

### 6.2 Agent and Guardrail Layers

On top of that foundation, teams add:

- **Agent layer**
  - Agents that read manifests/specs, accept requirements, propose component graphs, then emit JSX/TSX.
- **Guardrail layer**
  - Typechecking, ESLint, schema validation.
  - Token audits and no-raw-values rules.
  - Storybook test runs and visual regression.
  - Scenario-based eval harnesses for agent behavior.[^10][^4]

In this architecture, agents cannot directly modify UI code without passing through multiple layers of design-system-aware validation, greatly reducing the practical impact of hallucinations.

***

## Emerging Practices and Open Challenges

### 7.1 Config-Driven Generative UI

Some practitioners are moving toward **config-driven UI**, where agents assemble pre-built, governed components based on configuration schemas that list available components, their intended usage, and their data requirements. This shifts AI’s job from picking arbitrary props to picking the right component and feeding it configuration, which is easier to constrain and test.[^24][^4]

### 7.2 Simplifying Taxonomies and Naming

There is pushback against overly complex variant and typography taxonomies, which confuse both humans and AIs.[^25] Simplified, standardized variant names (e.g. `size: 'sm' | 'md' | 'lg'`) and property naming systems make it easier for agents to correctly map user requirements to component props, especially when design and code use the same names.[^26][^6]

### 7.3 Governance and Design System Evolution

Even with schemas and manifsets, design systems evolve. Articles stress the need for **governance mechanisms**—schema versioning, change logs, and drift detection—to keep agent contracts synchronized with the real implementation. Without this, agents may faithfully follow outdated specs and still generate incorrect UI.[^27][^7][^1][^4]

### 7.4 Human-in-the-Loop and Ownership

Most guidance assumes persistent human oversight. Visual regression, manual review of schema changes, and maintaining curated example libraries all reflect the reality that LLMs are **pattern followers, not design owners**. Design systems therefore focus on narrowing the error surface and catching violations early, not on fully autonomous UI changes.[^28][^21][^5]

***

## Conclusion

Design systems and component libraries are evolving from static human-facing style guides into **machine-readable, contract-driven systems** designed to work safely with LLMs and agents. The core strategies are to:

- Express components, props, variants, states, and tokens in structured schemas and manifests.
- Make documentation LLM-readable and expose it via Storybook, zeroheight, UXPin, and MCP servers.
- Constrain agents through strict prompts and AI instruction files, and limit styling to token-based methods.
- Enforce adherence with typechecking, ESLint, schema validation, token audits, visual regression, and scenario-based agent evals.
- Architect the system so that LLM creativity is confined to planning and copy, while rendering passes through deterministic, schema-validated steps.

These measures do not eliminate hallucinations entirely, but they significantly reduce their impact, making it difficult for agents to invent new API surface and easy for teams to detect and correct any deviations from the design system’s contract.[^7][^1][^2][^5][^4]

---

## References

1. [Expose your design system to LLMs - Hardik Pandya](https://hvpandya.com/llm-design-systems) - LLMs drift, fabricate tokens, and start every session from scratch. Here's how to feed your design s...

2. [Expose Your Design System to LLMs - by Hardik Pandya](https://hardik.substack.com/p/expose-your-design-system-to-llms) - LLMs drift, fabricate tokens, and start every session from scratch. Here's how to feed your design s...

3. [How to build UI using GPT-5.2 + Custom Design Systems - UXPin](https://www.uxpin.com/studio/blog/build-ui-gpt-5-2-custom-design-systems-uxpin-merge/) - This helps the AI reference valid component names and props from your library. Use a system prompt l...

4. [From Template to Tested Product: Launching the LLM Component ...](https://dev.to/petrilahdelma/from-template-to-tested-product-launching-the-llm-component-schema-standard-42fc) - Schema drift detection across component props, schema fields, and Storybook args. Versioned contract...

5. [Supercharge Your Design System with LLMs and ...](https://tympanus.net/codrops/2025/12/09/supercharge-your-design-system-with-llms-and-storybook-mcp/) - A guide to combining LLM coding agents with Storybook MCP for higher-quality, lower-cost frontend de...

6. [Figma: Display Figma variants and component properties - zeroheight](https://help.zeroheight.com/hc/en-us/articles/35886908929051-Figma-Display-Figma-variants-and-component-properties) - You can add instances and display full properties for instances and components, including variant, b...

7. [How to Connect Your Design System to LLMs with Storybook](https://www.uxpin.com/studio/blog/how-to-connect-your-design-system-to-llms-with-storybook/) - Learn how to integrate design systems with AI using Storybook to streamline UI generation and enhanc...

8. [Design Systems & Tokens Guide - Design.dev](https://design.dev/guides/design-systems/) - Complete guide to design systems and design tokens. Learn token categories, naming conventions, impl...

9. [How to write a good spec for AI agents - Addy Osmani](https://addyosmani.com/blog/good-spec/) - This guide distills best practices from my use of coding agents including Claude Code and Gemini CLI...

10. [Rethinking Testing for LLM Applications - arXiv](https://arxiv.org/html/2508.20737v1) - We review AI-oriented evaluation methods in software engineering and assess their alignment with the...

11. [How to Measure and Prevent LLM Hallucinations - Promptfoo](https://www.promptfoo.dev/docs/guides/prevent-llm-hallucinations/) - Measure and reduce LLM hallucinations using perplexity metrics, RAG, and controlled decoding techniq...

12. [A Concise Review of Hallucinations in LLMs and their Mitigation](https://arxiv.org/html/2512.02527v1) - In choosing an LLM to reduce hallucinations: model architecture, quality and diversity of the traini...

13. [Reducing LLM Hallucinations: A Developer's Guide - Zep](https://www.getzep.com/ai-agents/reducing-llm-hallucinations/) - This guide explains why hallucinations occur and provides strategies to mitigate them, aiming to hel...

14. [Best practices for using Storybook with AI | Storybook docs](https://storybook.js.org/docs/ai/best-practices) - Storybook is a frontend workshop for building UI components and pages in isolation. Thousands of tea...

15. [Design Tokens For Motion](https://cursa.app/en/page/design-tokens-for-color-type-spacing-and-motion) - Free ebook: Designing Modular Brand Systems: From Visual DNA to Scalable Asset Libraries for you to ...

16. [Types of tokens | Made with Supernova](https://learn.supernova.io/latest/design-systems/design-tokens/types-of-tokens-yqeR2c29) - Learn about the types of tokens used for building your design system in Supernova. | Design system d...

17. [Design tokens | U.S. Web Design System (USWDS)](https://designsystem.digital.gov/design-tokens/) - USWDS makes it easier to build accessible, mobile-friendly government websites.

18. [5 methods to detect drift in ML embeddings - Evidently AI](https://www.evidentlyai.com/blog/embedding-drift-detection) - Monitoring embedding drift is relevant for the production use of LLM and NLP models. We ran experime...

19. [What is data drift in ML, and how to detect and handle it - Evidently AI](https://www.evidentlyai.com/ml-in-production/data-drift) - Data drift is a change in the statistical properties and characteristics of the input data. It occur...

20. [Model drift detection: Identifying performance decay - Statsig](https://www.statsig.com/perspectives/model-drift-detection) - Models drift gradually, affecting accuracy and trust. Use AI observability to detect and manage drif...

21. [AI that knows (and uses) your design system](https://www.youtube.com/watch?v=RU2dOLrJdqU) - AI can generate UI in seconds—but without your design system as context, the results are off-brand a...

22. [Vibe coding your design system with the zeroheight MCP](https://zeroheight.com/blog/vibe-coding-your-design-system-with-the-zeroheight-mcp/) - In Figma Make, that happens through the official zeroheight connector, which lets the AI reference d...

23. [How LLMs use MCPs to read your design system and how to write ...](https://zeroheight.com/blog/how-llms-use-mcps-to-read-your-design-system-and-how-to-write-prompts-that-work-with-that/) - Learn how LLMs prioritise and interpret design system documentation through MCP servers — and how to...

24. [Design Decision Encoding for AI-Generated Design Systems](https://www.linkedin.com/posts/katie-kovalcin-57358028_today-i-built-something-that-solves-a-problem-activity-7434762093389778944-Oqt5) - Hardik Pandya's article lays out a practical fix — make your design system LLM-readable: → Spec file...

25. [I deleted 50 font variants and let AI handle the physics. My vision of the future of Design Systems.](https://www.reddit.com/r/DesignSystems/comments/1pi4oh6/i_deleted_50_font_variants_and_let_ai_handle_the/) - I deleted 50 font variants and let AI handle the physics. My vision of the future of Design Systems.

26. [Naming component properties: A systematic approach for variant ...](https://www.designsystemscollective.com/naming-component-properties-a-systematic-approach-for-variant-configuration-2f1a38f1fd83) - In this article I explore a systematic way of standardising naming of component properties in design...

27. [Design for Systems, Not Users | Jake Redmond posted on the topic](https://www.linkedin.com/posts/jakeredmond_stop-designing-for-the-user-until-youve-activity-7443293735670607872-dlUn) - Hardik Pandya's article lays out a practical fix — make your design system LLM-readable: → Spec file...

28. [When the AI team Goes Rogue – Arresting the Implementation Drift](https://www.linkedin.com/pulse/when-ai-team-goes-rogue-arresting-implementation-drift-manoj-jha-kxdaf) - · Support the same variants and props as Figma components. · Implement ... Agentic AI Reference Arch...

