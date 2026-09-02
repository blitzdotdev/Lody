**Title**

```
feat(components): opt-in suppression of the archive page's My/All Tasks scope control
```

**Body**

---

A workspace with exactly one member has nothing to switch between: both entries
list the same sessions. Add `hideTeamScope` to `ArchiveView` and
`WebArchiveScreen`, defaulting to false, which is the scope picker every
multi-member workspace has always had.

The stored scope atom is still written and still read back; only the ANSWER is
pinned while the prop is on, so turning it off restores the member's own last
choice rather than a default. The mobile toolbar dropdown takes the same term.

No existing call site passes it.

### Compatibility

Every change is additive at its default. With the new prop, parameter or flag
absent, the touched components render and behave exactly as they do today, and
no existing call site in this repository passes one.

### Testing

`packages/components` typecheck and the full vitest suite pass. No new test: `ArchiveView` needs the workspace provider stack.

### Notes for the reviewer

The stored scope atom is still written and read back; only the answer is pinned while the prop is on, so turning it off restores the member's own last choice.

---

### Review metadata

BlitzOS fork only. Delete this section before sending the PR to `LodyAI/Lody`.

| | |
|---|---|
| Branch | `blitz/seam-14-archive-team-scope-prop` |
| Branched from | `f3474894 (the pinned upstream commit)` |
| Classification | B — host configurability |
| Suggested submit priority | P3 |
| Vendor seam patch | 14 (prop half) |

```
.../src/components/archive/archive-view.tsx        | 24 +++++++++++++++++++---
 .../src/components/archive/web-archive-screen.tsx  | 11 ++++++++++
 2 files changed, 32 insertions(+), 3 deletions(-)
```
