**Title**

```
fix(components): mount the quick-open file dialog on desktop
```

**Body**

---

`{fileQuickOpenDialog}` is mounted only inside the `if (isMobile)` return, so on
desktop Ctrl/Cmd+P has no dialog to open. The keydown handler still runs and
calls `preventDefault`, which is why the chord reads as dead rather than as
unbound.

Mount it beside the other always-mounted dialogs in the desktop return. They
portal out, so tree position does not matter — the comment above that block
already says so for the two dialogs already there.

### Compatibility

Every change is additive at its default. With the new prop, parameter or flag
absent, the touched components render and behave exactly as they do today, and
no existing call site in this repository passes one.

### Testing

`packages/components` typecheck and the full vitest suite pass. No new test: `SessionDetail` needs a workspace runtime to mount.

### Notes for the reviewer

One line. The handler already runs and calls `preventDefault`, which is why the chord reads as dead rather than as unbound.

---

### Review metadata

BlitzOS fork only. Delete this section before sending the PR to `LodyAI/Lody`.

| | |
|---|---|
| Branch | `blitz/seam-10-desktop-quick-open-dialog` |
| Branched from | `f3474894 (the pinned upstream commit)` |
| Classification | A — upstream bug fix |
| Suggested submit priority | P1 |
| Vendor seam patch | 10 (BUG-1) |

```
packages/components/src/components/sessions/session-detail.tsx | 4 ++++
 1 file changed, 4 insertions(+)
```
