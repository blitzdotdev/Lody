**Title**

```
fix(components): render the worktree glyph on SessionList rows
```

**Body**

---

`SessionRowWorktreeIndicator` is exported and rendered by `loro-app-sidebar.tsx`
and `sidebar-updated-session-list.tsx`, but not by `SessionList` — although its
rows already carry `isWorktree` from the session meta. A worktree session listed
by `SessionList` therefore never shows the indicator.

Render it in the row's metric cluster, in the same position
`loro-app-sidebar.tsx` uses: to the left of the PR icon and to the right of the
line diff. The cluster's render condition gains the same term, so a worktree row
with no PR and no diff reaches it instead of falling to the time-only branch.

The indicator renders null for a falsy `isWorktree`, so nothing changes for a
non-worktree row.

### Compatibility

Every change is additive at its default. With the new prop, parameter or flag
absent, the touched components render and behave exactly as they do today, and
no existing call site in this repository passes one.

### Testing

`packages/components` typecheck and the full vitest suite pass. No new test: the row is inline JSX inside a virtualized list, and rendering it needs the sidebar's provider stack. `tests/session-list-pr-badge.test.ts` is the nearest existing shape and covers a different, extracted model.

### Notes for the reviewer

Placement is copied from `loro-app-sidebar.tsx`, not chosen: `[diff][worktree][PR]`. The chat-group branch is deliberately untouched.

---

### Review metadata

BlitzOS fork only. Delete this section before sending the PR to `LodyAI/Lody`.

| | |
|---|---|
| Branch | `blitz/seam-9-session-list-worktree-glyph` |
| Branched from | `f3474894 (the pinned upstream commit)` |
| Classification | A — upstream bug fix |
| Suggested submit priority | P2 |
| Vendor seam patch | 9 |

```
packages/components/src/components/session-list.tsx | 5 ++++-
 1 file changed, 4 insertions(+), 1 deletion(-)
```
