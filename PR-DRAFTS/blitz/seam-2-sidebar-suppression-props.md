**Title**

```
feat(components): optional header and per-item footer suppression on LoroSidebar
```

**Body**

---

A host that mounts the sidebar body inside an existing shell already draws its
own workspace-identity header, and may serve settings and help from its own
chrome. Today it gets two workspace headers and two settings entries;
`afterSessionListContent` is the only slot the component has.

Add three optional props, all inert by default:

- `hideHeader` suppresses the workspace-identity header row.
- `hideFooter` suppresses the whole footer utility rail.
- `footerItems` lists which footer utilities render when the footer renders at
  all — `settings`, `help`, `archive` and the mobile-only `filter` popover. The
  default is every item, so a host that says nothing renders exactly what it
  rendered before. `hideFooter` stays the shorter spelling for "none of them".

`footerItems` exists because `hideFooter` cannot express "keep one of them", and
the archive entry is the component's only affordance that reaches the archive
page: a host that serves its own settings and help but not its own archive had
no way to keep the one entry it wanted.

Worth stating for a host that hides the footer: on MOBILE the footer is the only
place the filter popover renders — the desktop trigger lives in the first section
header — so that host owns the organize/scope control.

With every prop absent the component renders byte-for-byte what it rendered
before, and no existing call site passes one.

### Compatibility

Every change is additive at its default. With the new prop, parameter or flag
absent, the touched components render and behave exactly as they do today, and
no existing call site in this repository passes one.

### Testing

`packages/components` typecheck and the full vitest suite pass. No new test: the component needs the sidebar provider stack. The three props are pure render guards with no logic.

### Notes for the reviewer

This carries two related changes at once, because the second is the first admitting it was too coarse: `hideFooter` is all-or-nothing, and the archive entry is the only affordance that reaches the archive page. `footerItems` is the finer control; `hideFooter` keeps its meaning as the shorter spelling for "none of them". Reviewing them separately is possible — say so and this splits into two PRs.

The raw diff is large because hunks 3 and 4 are a guard plus a re-indent of the block they wrap. `git diff -w` is ~23 changed lines, 15 of which are the doc comments.

---

### Review metadata

BlitzOS fork only. Delete this section before sending the PR to `LodyAI/Lody`.

| | |
|---|---|
| Branch | `blitz/seam-2-sidebar-suppression-props` |
| Branched from | `f3474894 (the pinned upstream commit)` |
| Classification | B — host configurability |
| Suggested submit priority | P2 |
| Vendor seam patch | 2 + 13 |

```
.../components/src/components/loro-sidebar.tsx     | 358 ++++++++++++---------
 1 file changed, 205 insertions(+), 153 deletions(-)
```
