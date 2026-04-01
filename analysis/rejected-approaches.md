# Rejected Approaches: Ideas Considered and Why They Were Dropped

This document captures approaches from the [gap analysis](tale-ui-gap-analysis.md) that were initially recommended but later identified as contradicting Tale UI's core strengths. The underlying problems these approaches address are real — the solutions were wrong.

---

## 1. Convenience Wrappers (Pre-Composed Single-Tag APIs)

### The Idea

Offer a single-tag convenience API alongside compound parts for the top 10-15 components:

```tsx
// Proposed convenience API
<Checkbox label="Remember me" size="sm" />

// Existing compound parts API
<Checkbox.Root value="remember">
    <Checkbox.Indicator><Icon icon={Check} size="sm" /></Checkbox.Indicator>
    Remember me
</Checkbox.Root>
```

### Why It Was Initially Appealing

The verbosity gap between Untitled UI Pro and Tale UI is real. For simple use cases, the compound parts pattern requires 3-4 decisions and 4+ lines where a single-tag component needs 1 line and 2-3 decisions. This adds friction without compositional benefit when the consumer just wants a standard checkbox with a label.

### Why It Was Rejected

**It directly contradicts Tale UI's #1 AI advantage: pattern consistency.**

The [comparative analysis](comparative-analysis.md) scores Tale UI at +2.0 over Untitled UI Pro on pattern consistency (4.5 vs 2.5) — the single largest gap in any dimension. The analysis identifies Untitled UI Pro's multiple composition patterns (6 patterns, 4 export strategies) as its biggest AI usability weakness.

Adding convenience wrappers would:

1. **Introduce a second composition pattern** — agents would need to learn "is this a single-tag component or a compound-parts component?" This is exactly the mental-model confusion the analysis criticizes Untitled UI Pro for.
2. **Create hallucination risk** — an agent might use `<Select label="Country" />` (convenience syntax) on a component that only supports compound parts, or mix the two patterns incorrectly.
3. **Double the documentation surface** — every convenience-wrapped component would need two sets of examples, two API references, and guidance on when to use which.
4. **Fragment the codebase** — some components would have two APIs, others wouldn't. The inconsistency about which components have convenience wrappers becomes its own source of confusion.

The gap analysis's own "Explicitly NOT Recommended" section says: *"Pattern consistency is Tale UI's largest advantage (+2.0 gap). Adding patterns would degrade this."* The convenience wrapper recommendation contradicted this directly.

### The Better Solution: Recipe Docs

The verbosity problem is real but is better solved at the **documentation level**, not the API level:

- **Copy-paste recipe snippets** in `docs/recipes/` provide the same "here's a one-liner" benefit
- An agent copies the recipe and has working compound-parts code — no second pattern to learn
- The recipe is documentation, not API surface — it doesn't fragment the component library
- Recipe docs were already Tier 1 recommendation #3 in the gap analysis

Example recipe:

```markdown
## Checkbox with Label

\`\`\`tsx
<Checkbox.Root value="remember">
    <Checkbox.Indicator><Icon icon={Check} size="sm" /></Checkbox.Indicator>
    Remember me
</Checkbox.Root>
\`\`\`
```

An agent that reads this recipe produces the same code as an agent using a convenience wrapper — but there's only one pattern to learn, one API to document, and no consistency degradation.

---

## 2. Data-Driven Convenience APIs

### The Idea

Offer a data-driven API for components with predictable structures, where consumers provide an array and the component renders everything:

```tsx
// Proposed data-driven API
<RadioGroup.IconCards items={[
    { value: "basic", title: "Basic", icon: StarIcon, price: "$10" },
    { value: "pro", title: "Pro", icon: RocketIcon, price: "$25" },
]} />

// Existing compound parts API
<RadioGroup.Root>
    <RadioGroup.Item value="basic">
        <Icon icon={Star} /> Basic — $10
    </RadioGroup.Item>
    <RadioGroup.Item value="pro">
        <Icon icon={Rocket} /> Pro — $25
    </RadioGroup.Item>
</RadioGroup.Root>
```

### Why It Was Initially Appealing

Untitled UI Pro's `<RadioGroups.IconCard items={[...]} />` pattern eliminates JSX composition entirely for predictable layouts. The consumer provides data, the component handles rendering. This is particularly attractive for radio groups, navigation menus, and other list-like components where the structure rarely varies.

### Why It Was Rejected

**It introduces a second export pattern — the exact weakness the analysis identifies in Untitled UI Pro.**

The [comparative analysis](comparative-analysis.md) rates Untitled UI Pro's data-driven pattern at 50-60% first-attempt accuracy for AI agents because:

1. **Item type shapes are opaque** — an agent must know the exact shape of the `items` array (`{ value, title, description, price, icon }`) without visible JSX to guide it.
2. **It's a different mental model** — compound parts say "compose these pieces"; data-driven says "give me this shape." An agent must identify which model each component uses.
3. **Customization is constrained** — want to add a tooltip on one item? A badge on another? The data-driven API either doesn't support it or requires escape hatches that are harder to discover than JSX composition.

The gap analysis already criticizes Untitled UI Pro for having 4 export patterns. Adding a data-driven pattern to Tale UI would move it from 1 pattern to 2 — a 100% increase in pattern complexity.

### The Better Solution: Recipe Docs

As with convenience wrappers, recipe docs solve the boilerplate problem without adding API surface:

```markdown
## Radio Group with Icon Cards

\`\`\`tsx
<RadioGroup.Root>
    {items.map(item => (
        <RadioGroup.Item key={item.value} value={item.value}>
            <RadioGroup.ItemIndicator />
            <Icon icon={item.icon} />
            <div>
                <span>{item.title}</span>
                <span>{item.price}</span>
            </div>
        </RadioGroup.Item>
    ))}
</RadioGroup.Root>
\`\`\`
```

This gives agents a copy-paste pattern that:

- Uses the standard compound-parts API (one pattern to learn)
- Is fully customizable (add a tooltip, badge, or conditional styling per item)
- Makes the rendering structure visible in JSX (no opaque item shapes)

---

## 3. Polymorphic Button

### The Idea

A single `Button` component that renders as `<a>` when an `href` prop is provided, and as `<button>` otherwise. Untitled UI Pro uses this pattern so consumers write `<Button href="/dashboard">` instead of choosing between `Button` and `Link`.

### Why It Was Initially Appealing

It reduces the number of components a consumer needs to know. Instead of choosing between `Button` (for actions) and `Link` (for navigation), there's just `Button` that adapts its rendered element.

### Why It Was Rejected

**It creates ambiguity about the rendered element and ARIA semantics.**

Tale UI's explicit separation — `Button` for actions, `Link` for navigation — is intentionally cleaner:

1. **Predictable ARIA roles** — `Button` always renders `<button>` with `role="button"`. `Link` always renders `<a>` with implicit link semantics. A polymorphic button hides which element is actually rendered, making accessibility auditing harder.
2. **Agent clarity** — when an agent sees `<Button>`, it knows this is an action. When it sees `<Link>`, it knows this is navigation. A polymorphic button requires the agent to check whether `href` is present to determine the semantics — an extra decision point that invites errors.
3. **No real friction** — the "choose between Button and Link" decision maps directly to the semantic question "is this an action or navigation?". Consumers always know the answer. The polymorphic pattern solves a problem that doesn't exist in practice.
4. **Styling divergence** — buttons and links have different focus styles, different cursor defaults, and different disabled behaviour. Merging them behind one component creates edge cases where `disabled` is applied to an `<a>` (which doesn't natively support it) or link-specific styles leak into button instances.

### The Better Alternative

Use `Button` for actions and `Link` for navigation. Both components exist, are fully styled, and have clear semantic boundaries. The component name always tells you the intent.

---

## 4. Pre-Built Icon Sets

### The Idea

Bundle proprietary icon sets — payment icons (57), social icons (23), integration icons (17) — directly into the design system, as Untitled UI Pro does with 5,700+ icons across 3 packages.

### Why It Was Initially Appealing

Pre-built icon sets mean agents don't need to know which icon library to install. Every icon is available immediately, and there's a single consistent visual style across all icons in the system.

### Why It Was Rejected

**Tale UI's `<Icon>` component with consumer-chosen libraries is more flexible and avoids vendor lock-in.**

Tale UI's icon architecture uses `<Icon icon={...}>` from `@tale-ui/react/icon`, where the `icon` prop accepts any SVG component. The recommended library is [Lucide React](https://lucide.dev/) (4,000+ icons, MIT licensed, tree-shakeable), but consumers can use any library that exports React SVG components.

This approach is better because:

1. **No vendor lock-in** — consumers choose their icon library. Switching from Lucide to Heroicons (or any other library) requires zero changes to Tale UI components — just different imports.
2. **Tree-shaking** — only icons actually imported are included in the bundle. A proprietary set of 5,700+ icons would bloat the package even if only 20 are used.
3. **Community maintained** — Lucide has 4,000+ icons with active community contributions. A proprietary set requires ongoing maintenance to add new icons (payment processors, social platforms, etc. change frequently).
4. **Consistent API** — `<Icon icon={ChevronLeft} size="sm" />` works identically regardless of which icon library provides `ChevronLeft`. The Tale UI `<Icon>` component handles sizing, colour inheritance, and accessibility uniformly.
5. **Different product scope** — icon design is a separate discipline from component architecture. Bundling icons would expand the project's maintenance surface into visual asset creation, which is not the design system's core competency.

### The Better Alternative

Use `<Icon>` from `@tale-ui/react/icon` with Lucide React (or any SVG icon library):

```tsx
import { Icon } from '@tale-ui/react/icon';
import { CreditCard, Github, Slack } from 'lucide-react';

<Icon icon={CreditCard} size="sm" />  // payment
<Icon icon={Github} size="sm" />       // social
<Icon icon={Slack} size="sm" />        // integration
```

---

## Summary

| Approach | Problem It Solves | Why Rejected | Better Alternative |
|----------|-------------------|--------------|-------------------|
| Convenience wrappers | Verbosity for simple use cases | Introduces second composition pattern; degrades #1 AI advantage | Recipe docs with copy-paste snippets |
| Data-driven APIs | Boilerplate for list-like components | Introduces second export pattern; opaque item shapes reduce AI accuracy | Recipe docs with `.map()` patterns |
| Polymorphic button | Choosing between Button and Link | Hides rendered element and ARIA semantics; creates agent ambiguity | Separate `Button` (actions) and `Link` (navigation) components |
| Pre-built icon sets | Needing specific payment/social/integration icons | Vendor lock-in, bundle bloat, maintenance burden for visual assets | `<Icon>` component + Lucide React (or any SVG icon library) |

All rejected approaches address real or perceived developer friction. The key insight is that the friction is best solved at the **documentation layer** (recipes, snippets, examples) or by **embracing explicit separation** rather than adding API-level abstractions. Documentation-level solutions preserve Tale UI's pattern consistency while still giving agents and developers the "here's how to do this quickly" guidance they need.

This aligns with the gap analysis conclusion: *"The three highest-impact improvements are all documentation-level, not code-level."*
