# Tale UI Documentation Audit Handoff Plan

## Summary

Audit all existing Tale UI documentation and golden consumer guidance for contradictions, drift, formatting issues, and stale generated artifacts. Start with deterministic checks, fix only concrete findings, then optionally run stochastic golden evals after the source docs are clean.

Primary success criteria:

- Markdown, pitfall shape, pitfall truth, generated-docs checks, golden validation, and patchability audits pass.
- Any fixed documentation changes are narrow, explainable, and backed by an audit failure.
- No broad manual rewriting of pitfalls/examples unless a deterministic check or eval artifact proves the issue.
- If `golden:fix-review` rejects a patch, use the saved replay artifact and `pnpm pitfalls:patch` to debug it.

## Audit Flow

1. Capture starting state.

```bash
git status --short
```

Record existing modified/untracked files before changing anything. Do not revert unrelated user changes.

2. Run deterministic documentation checks first.

```bash
pnpm markdownlint
pnpm pitfalls:shape
pnpm pitfalls:truth
pnpm pitfalls:audit
pnpm generate-docs:check
pnpm golden:validate
pnpm audit:golden-patchability
```

Treat failures as the source of truth for cleanup. Do not start with `golden:fix-review`.

3. Classify each failure before editing.

Use these categories:

- `formatting`: markdownlint/table/fence/list issues.
- `pitfall-shape`: malformed pitfall block, bad slug, multi-bullet merge, invalid snippet wrapping.
- `pitfall-truth`: doc claim contradicts implementation.
- `generated-drift`: registry/snippet/eval-context output differs from committed files.
- `golden-reference`: golden prompt reference code is invalid.
- `patchability`: golden prompt tags/components cannot be patched deterministically.

4. Fix in small batches.

Use the narrowest possible edit. After each batch, rerun only the failing command first, then rerun the full deterministic audit stack when the batch is clean.

5. Regenerate only when checks prove drift.

If `pnpm generate-docs:check` fails, run:

```bash
pnpm generate-docs
pnpm generate-docs:check
```

Review generated diffs carefully before keeping them.

6. Use deterministic patch replay for pitfall payload issues.

If a rejected patch payload exists under `tools/.golden-patches/.../rejected/`, replay it with:

```bash
pnpm pitfalls:patch -- --json tools/.golden-patches/<run>/rejected/<file>.json --dry-run
```

Only use `--write` after the dry-run diff is correct.

## Optional Golden Eval Pass

Run stochastic evals only after deterministic checks pass.

Recommended first pass:

```bash
pnpm golden:eval -- --provider claude --model sonnet --mcp --no-cache
```

If failures indicate missing docs/pitfalls, use:

```bash
pnpm golden:fix-review -- --provider claude --model sonnet --fix-provider claude --fix-model sonnet --mcp --until-pass --mcp-max-turns 10
```

After `golden:fix-review`, rerun:

```bash
pnpm pitfalls:shape
pnpm pitfalls:truth
pnpm markdownlint
pnpm generate-docs:check
```

Review `git diff docs/pitfalls.md docs/components registry tools/.eval-context.md` before accepting changes.

## Test Plan

Final acceptance commands:

```bash
pnpm markdownlint
pnpm pitfalls:shape
pnpm pitfalls:truth
pnpm pitfalls:audit
pnpm generate-docs:check
pnpm golden:validate
pnpm audit:golden-patchability
node --test tools/pitfall-source-target-lib.test.mjs tools/pitfall-patch-lib.test.mjs tools/eval-fix-review.test.mjs tools/eval-golden-prompts.test.mjs
```

If any source code or public API docs changed, also run the repo-required checks relevant to the touched area:

```bash
pnpm eslint
pnpm typescript
pnpm docs:api
```

If full `pnpm eslint` fails on pre-existing unrelated issues, record that separately and run targeted lint on touched files where possible.

## Deliverables

- A short audit report listing commands run, pass/fail results, and fixes made.
- A categorized list of any remaining failures, if any.
- Clean deterministic audit commands listed above.
- A concise diff summary of changed docs/generated files.
- Any rejected/applied patch replay artifacts referenced by path if they informed a fix.

## Assumptions

- Scope includes `docs/pitfalls.md`, `docs/components/*.md`, generated registries/snippets/eval context, golden prompts, and public docs/examples touched by audit failures.
- Do not perform broad editorial cleanup without a failing check or concrete eval evidence.
- Prefer deterministic checks over LLM evals for the initial audit.
- Existing unrelated working-tree changes must be preserved.
