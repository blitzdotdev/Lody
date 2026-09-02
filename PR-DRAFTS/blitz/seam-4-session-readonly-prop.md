**Title**

```
feat(components): add an opt-in readOnly mode to the session surface
```

**Body**

---

A host may embed a session that the current viewer is allowed to read but not
drive. There is no such mode today: every member of a workspace may drive every
session they can see, so `SessionChatInterface` has no notion of a viewer.

Add `readOnly` to `SessionChatInterface`, defaulting to false. With it on the
composer is not rendered, and neither is `FloatingPermissionRequest` — its
options are answers, and an answer this viewer cannot write is a button that
does nothing. The request still appears in the transcript. `SessionDetail`
declares and forwards the same prop to every chat surface it mounts.

The two suppressions the component already has, `isArchivedSession` and
`isMachineRemoved`, were considered and are not reusable: both put a statement
on the screen that would be false here, and both change the header copy as well
as the composer.

The prop is presentation only — enforcement belongs wherever the writes are
applied — but a control that cannot work should not be offered. With the prop
absent every call site renders exactly what it rendered before, and no existing
call site passes it.

The header's "…" menu still offers archive, delete, rename and fork; widening
the prop to the menu is a larger change through `headerVariant="toolbar"` and is
a follow-up rather than part of this one.

### Compatibility

Every change is additive at its default. With the new prop, parameter or flag
absent, the touched components render and behave exactly as they do today, and
no existing call site in this repository passes one.

### Testing

`packages/components` typecheck and the full vitest suite pass. No new test: `SessionChatInterface` needs a workspace runtime and a daemon.

### Notes for the reviewer

The prop suppresses two controls and no more. The header's "…" menu still offers archive, delete, rename and fork to a viewer; widening it there is a larger change through the `headerVariant="toolbar"` call site and belongs in a follow-up. The `hideMessageArea` instance is deliberately not passed the prop — it renders no composer and no permission card, so passing it would suggest it selected something.

---

### Review metadata

BlitzOS fork only. Delete this section before sending the PR to `LodyAI/Lody`.

| | |
|---|---|
| Branch | `blitz/seam-4-session-readonly-prop` |
| Branched from | `f3474894 (the pinned upstream commit)` |
| Classification | B — host configurability |
| Suggested submit priority | P3 |
| Vendor seam patch | 4 |

```
.../components/sessions/session-chat-interface.tsx | 31 +++++++++++++++++-----
 .../src/components/sessions/session-detail.tsx     |  6 +++++
 2 files changed, 30 insertions(+), 7 deletions(-)
```
