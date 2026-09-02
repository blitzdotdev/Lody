**Title**

```
fix(components): make a chip click select its mention, and ArrowLeft walk one path level
```

**Body**

---

Two defects in the `@` composer.

A committed chip answers no click. `MentionInput` already hit-tests the click
point against the highlight mirror, but the hit only forwards to the optional
`onMentionClick`; nothing happens to the range itself, so for every kind without
a kind-specific handler the click has no visible outcome. A committed mention is
already atomic to every other input path — Backspace deletes the whole range and
the horizontal arrows step over it — so a caret dropped inside one is a position
no edit can use. Select the range on a hit, and call the optional handler on top
of it. The chip mirror already paints a selected range; until now only a drag
could reach it.

The file drill-down leaves the Files category. Descending into a directory writes
a bare path (`@src/`), which carries no `<namespace>:` prefix, so
`selectMentionMenuView` falls back to the aggregate level and lists slash
commands and issues beside the files. ArrowLeft then closes the menu instead of
going up a level, because `tryNavigateBack` only pops a `<namespace>:` prefix.

- `MentionCategory` gains `ownsBareSearch`; the file category claims a search
  containing `/`, so the selector stays neutral and asks the categories rather
  than naming one.
- `getMentionDrillDownParent` answers the search one level up — `<ns>:` to the
  bare trigger, `src/components/` to `src/` — and is shared by ArrowLeft and the
  menu's own Back button, so both move by one rule.
- `onNavigateBack` takes the destination search, defaulting to the bare trigger.

Backspace is deliberately unchanged: inside a path it still deletes one
character at a time.

### Compatibility

Every change is additive at its default. With the new prop, parameter or flag
absent, the touched components render and behave exactly as they do today, and
no existing call site in this repository passes one.

### Testing

`packages/components` typecheck and the full vitest suite pass. Adds `tests/mention-drill-down.test.ts`, covering `getMentionDrillDownParent` at every level and the bare-path routing through `selectMentionMenuView`. The chip-click half is not unit tested here: `isPointInsideMentionHighlight` measures real client rects, which jsdom does not produce.

### Notes for the reviewer

`ui/mention/AGENTS.md` says ArrowLeft shares Backspace's namespace-only rule. That sentence is superseded by this change; the doc file is left untouched so the merge surface stays at the five source files, and it should be updated with (or right after) this PR.

---

### Review metadata

BlitzOS fork only. Delete this section before sending the PR to `LodyAI/Lody`.

| | |
|---|---|
| Branch | `blitz/seam-11-mention-chip-click-and-path-drilldown` |
| Branched from | `f3474894 (the pinned upstream commit)` |
| Classification | A — upstream bug fix |
| Suggested submit priority | P1 |
| Vendor seam patch | 11 |

```
.../src/components/mentions/mention-registry.ts    |  31 +++++++
 .../components/mentions/mention-two-level-menu.tsx |  14 ++-
 .../components/src/ui/mention/mention-input.tsx    |  41 +++++++--
 .../components/src/ui/mention/mention-root.tsx     |  57 +++++++-----
 .../components/src/ui/mention/mention-trigger.ts   |  31 +++++++
 .../components/tests/mention-drill-down.test.ts    | 101 +++++++++++++++++++++
 6 files changed, 238 insertions(+), 37 deletions(-)
```
