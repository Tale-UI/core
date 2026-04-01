# AI Agent Usability & Accuracy Analysis

How easy is it for AI agents and AI-driven workflows to pick up and use UntitledUI Pro (and Tale UI by comparison) with high accuracy and minimal hallucinations?

## 1. Discoverability

### UntitledUI Pro

**Component discovery: Good**

- Directory names match component names (`checkbox/checkbox.tsx`, `select/select.tsx`)
- Kebab-case file naming is consistent and greppable
- Category folders (`base/`, `application/`, `foundations/`) provide logical grouping
- An agent searching for "date picker" will find `application/date-picker/`

**Weaknesses:**

- No barrel `index.ts` files in most component directories — an agent must guess the filename
- Some components span multiple files (`select/` has 8 files) — unclear which is the main export
- Radio groups split across `radio-buttons/` and `radio-groups/` — confusing naming overlap
- 14+ dropdown variant files — hard to know which to use without reading CLAUDE.md

### Tale UI

**Component discovery: Very Good**

- Every component directory has `index.ts` — always a clear entry point
- Per-component markdown docs provide a human/AI-readable overview
- Consistent directory pattern: `{Component}.styled.tsx` is always the main file
- `docs/components/index.md` provides a complete catalogue

**Weaknesses:**

- Must read multiple files to get full picture (styled.tsx + docs/components/ + styles/src/)
- No single file that lists all components with their purpose

## 2. Correctness of First-Attempt Code Generation

### UntitledUI Pro

**Simple components: High accuracy (90%+)**

```tsx
// Agent can likely generate this correctly from CLAUDE.md alone
<Checkbox label="Remember me" size="sm" />
<Button color="primary" size="md">Save</Button>
<Toggle label="Dark mode" />
```

The single-tag pattern has very few ways to go wrong — props are self-documenting via TypeScript.

**Compound components: Medium accuracy (60-70%)**

```tsx
// Agent must know: namespace object, sub-parts, correct order
<TextEditor.Root limit={500}>
    <TextEditor.Label>Notes</TextEditor.Label>
    <TextEditor.Toolbar />         // Must know this exists
    <TextEditor.Content />         // Must know this exists
    <TextEditor.HintText />        // Optional — agent may forget
</TextEditor.Root>
```

Without reading the source, an agent might:

- Miss required sub-parts
- Use wrong sub-part names
- Forget the namespace pattern (`TextEditor.Root` vs `<TextEditorRoot>`)

**Data-driven components: Medium-low accuracy (50-60%)**

```tsx
// Agent must know the exact item shape
<RadioGroups.IconCard
    items={[{
        value: "basic",
        title: "Basic",           // required
        description: "...",       // required
        price: "$10",             // optional — agent might not know
        icon: StarIcon,           // required — must be FC, not element
    }]}
/>
```

The item type shapes are not documented in CLAUDE.md — an agent would need to read the source or rely on TypeScript errors.

### Tale UI

**All components: Medium-high accuracy (75-85%)**

```tsx
// Agent can generate from docs/components/checkbox.md
<Checkbox.Root value="apple">
    <Checkbox.Indicator>
        <Icon icon={Check} size="sm" />
    </Checkbox.Indicator>
    Apple
</Checkbox.Root>
```

The compound parts pattern has a consistent structure across all components, so once an agent learns the pattern for one component, it applies to all.

**Risk factors:**

- Must know which sub-parts each component has
- Must know the correct nesting order
- More boilerplate = more places for syntax errors
- Icon component must be imported separately

**Advantage:**

- `@example` JSDoc blocks provide copy-paste templates
- Per-component markdown has complete examples
- Pattern is consistent — same mental model for all 67 components

## 3. Documentation Surface for Agents

### UntitledUI Pro

| Documentation Layer | Agent Usefulness | Coverage |
|---|---|---|
| CLAUDE.md (36KB) | **High** — loaded in one read | ~8 of ~50 components detailed |
| JSDoc on props | **Medium** — requires reading source files | All exported interfaces |
| TypeScript types | **Medium** — guides autocomplete, not generation | All components |
| External docs | **None** — agents can't access untitledui.com | Full but inaccessible |

**Key gap:** An agent can load CLAUDE.md in one read, but it only covers Button, Input, Select, Checkbox, Radio, Badge, Avatar, FeaturedIcon, and Link in detail. For the other ~40 components, the agent must read source files.

### Tale UI

| Documentation Layer | Agent Usefulness | Coverage |
|---|---|---|
| CLAUDE.md (root + packages) | **High** — architecture + conventions | All packages |
| docs/components/{name}.md | **Very High** — complete per-component guides | All 67 components |
| JSDoc with @example | **High** — copy-paste templates | All exported components |
| ai-reference.md | **High** — token/class reference | Full design system |
| Storybook stories | **Medium** — example code but verbose | Most components |
| ComponentAudit.tsx | **Medium** — exercises all variants | All components |

**Key advantage:** An agent can read `docs/components/checkbox.md` and have everything needed — imports, parts, props, examples, CSS classes — in a focused, component-specific document.

**Key cost:** Requires multiple file reads to build full understanding. An agent must read CLAUDE.md + the specific component doc + possibly the styled source.

## 4. Hallucination Risk Factors

### UntitledUI Pro — Risk Areas

**HIGH RISK: Multiple export patterns**

An agent might confuse:
```tsx
// Which pattern does this component use?
<Checkbox label="X" />              // Named export, single tag
<TextEditor.Root>...</TextEditor.Root>  // Namespace object
<Select.ComboBox items={...} />     // Type-augmented namespace
<RadioGroups.IconCard items={...} /> // Barrel re-export namespace
```

Four different export/composition patterns = four mental models to track. An agent trained on one pattern may apply it incorrectly to another.

**HIGH RISK: Icon passing ambiguity**

Icons can be passed three ways:
```tsx
// As component function
<Button icon={ArrowRight} />

// As React element
<Button icon={<ArrowRight className="size-4" />} />

// As element with data-icon attribute
<SomeComponent><ArrowRight data-icon /></SomeComponent>
```

An agent may hallucinate the wrong passing pattern for a given component.

**MEDIUM RISK: Similar component names**

- `RadioButton` vs `RadioGroup` vs `RadioGroupIconCard` vs `RadioGroupIconSimple`
- `Input` vs `InputBase` vs `TextField` vs `InputDate` vs `InputPhone` (11 variants!)
- `Button` vs `ButtonClose` vs `ButtonUtility` vs `SocialButton`

An agent may pick the wrong variant or conflate related but different components.

**MEDIUM RISK: Context-invisible behavior**

```tsx
// Size comes from parent context, not from this component's props
<RadioGroup size="md">
    <RadioButton label="A" />  // Agent might add size="md" here too
</RadioGroup>
```

Context propagation is invisible in JSX — an agent can't know that `size` is inherited without reading the implementation.

**LOW RISK: Color/size string unions**

Values like `"primary"`, `"sm"`, `"md"` are common across React component libraries. Agents are unlikely to hallucinate invalid values here, and TypeScript will catch mistakes.

### Tale UI — Risk Areas

**MEDIUM RISK: Sub-part discovery**

An agent must know which sub-parts each component exposes:
```tsx
// Does DateRangePicker have .Calendar? .Presets? .Input?
// Agent must check docs or source
<DateRangePicker.Root>
    <DateRangePicker.???>
</DateRangePicker.Root>
```

**Mitigation:** Consistent `index.ts` exports list all available parts. Per-component docs enumerate them.

**LOW RISK: Consistent pattern**

Once an agent learns the compound parts pattern, it applies uniformly. There's no ambiguity about "is this a namespace object or a named export?" — it's always the same.

**LOW RISK: BEM class predictability**

```css
.tale-{component}
.tale-{component}__{part}
.tale-{component}--{variant}
```

BEM naming is a well-known convention. An agent can predict class names without reading CSS source.

## 5. Composition Complexity

### Decision Count Per Component

How many decisions must an agent make to render a component correctly?

**UntitledUI Pro:**

| Pattern | Decisions | Example |
|---|---|---|
| Single-tag | 2-3 (which props, which values) | `<Checkbox label="X" size="sm" />` |
| Namespace compound | 4-6 (which sub-parts, order, props per part) | `<TextEditor.Root>...<TextEditor.Toolbar />...` |
| Data-driven | 3-5 (which variant, item shape, item count) | `<RadioGroups.IconCard items={[...]} />` |

**Tale UI:**

| Pattern | Decisions | Example |
|---|---|---|
| Simple compound | 3-4 (Root + parts + props) | `<Checkbox.Root><Checkbox.Indicator>...` |
| Complex compound | 5-8 (Root + multiple parts + nesting + props) | `<Select.Root><Select.Trigger />...` |
| All follow same model | Consistent cognitive load | Always: Root → Parts → Content |

### Comparison

UntitledUI's simple components require fewer decisions (2-3 vs 3-4), but complex components require similar effort. Tale UI has higher baseline complexity but **consistent** complexity — the mental model doesn't change between simple and complex components.

## 6. Comparison: Agent-Friendliness Scoring

### Scoring Criteria

- **1** = Agent will frequently produce incorrect code
- **2** = Agent will often need corrections
- **3** = Agent produces workable code with occasional issues
- **4** = Agent produces correct code most of the time
- **5** = Agent produces correct code reliably

### Scores

| Dimension | UntitledUI Pro | Tale UI | Notes |
|---|---|---|---|
| **Component discovery** | 3.5 | 4.5 | Tale UI: index.ts + per-component docs always findable. UntitledUI: no barrel exports, category confusion |
| **First-attempt correctness** | 3.5 | 4.0 | UntitledUI: simple components easy, but multiple patterns confuse. Tale UI: consistent pattern, more boilerplate but predictable |
| **Documentation completeness** | 3.0 | 4.5 | UntitledUI: CLAUDE.md covers ~8 of ~50 components. Tale UI: every component documented |
| **Hallucination resistance** | 2.5 | 4.0 | UntitledUI: 4 export patterns, icon ambiguity, similar names. Tale UI: one pattern, predictable BEM |
| **Customization guidance** | 3.0 | 4.5 | UntitledUI: Tailwind knowledge assumed, override via className unclear. Tale UI: BEM classes documented per component, CSS override path clear |
| **Context loading speed** | 4.5 | 3.0 | UntitledUI: one CLAUDE.md read. Tale UI: multiple file reads needed |
| **Pattern consistency** | 2.5 | 4.5 | UntitledUI: 4+ patterns to learn. Tale UI: one compound parts pattern for all |
| **Overall agent-friendliness** | **3.2** | **4.1** | Tale UI's consistency and documentation depth win despite higher token cost |

## 7. Recommendations

### For UntitledUI Pro (if improving agent usability)

1. **Expand CLAUDE.md** to cover all components, not just 8
2. **Standardize on fewer export patterns** — pick 2 (single-tag + namespace) instead of 4
3. **Add `@example` JSDoc** blocks to all exported components
4. **Add index.ts barrel exports** to every component directory
5. **Document item type shapes** for data-driven components in CLAUDE.md
6. **Clarify icon passing** — pick one canonical pattern and document it

### For Tale UI (maintain and enhance)

1. **Keep compound parts pattern** — it's the strongest agent-friendliness signal
2. **Keep per-component markdown** — high-value for accurate generation
3. **Consider a single-file component index** — listing all components with one-line descriptions for fast context loading
4. **Keep BEM class documentation** — predictable, greppable, agent-verifiable
5. **Ensure `@example` blocks stay current** — they're the primary copy-paste source for agents

## 8. Key Insight

**Consistency beats simplicity for AI agents.**

UntitledUI's simpler single-tag components are individually easier to generate, but the library's inconsistency across patterns (4 export strategies, 3 icon passing methods, context-invisible behavior) means an agent must hold more mental models simultaneously. When it guesses wrong about which pattern a component uses, it produces invalid code.

Tale UI's compound parts pattern is more verbose, but an agent that learns it once can apply it correctly to all 67 components. Combined with per-component documentation and predictable BEM classes, Tale UI gives agents a reliable, verifiable path to correct code generation.

**The best library for AI isn't the one with the least code — it's the one with the most predictable code.**
