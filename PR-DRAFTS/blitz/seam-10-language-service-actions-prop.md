**Title**

```
feat(components): let a host without a language service drop the two LSP actions
```

**Body**

---

`Go to Definition` and `Find References` are registered on every Monaco viewer
unconditionally, so they sit in the context menu and on F12 / Shift+F12 whatever
the host can answer. A machine that runs no language service answers "Host
language service does not support this file" for every identifier.

Add one optional prop per level, each defaulting to today's behaviour:
`SessionDetail.hideLanguageServiceActions`, `SessionFileContentView.lspAvailable`
and `SessionMonacoTextViewer.lspActions`, down to `lspActions` on
`SessionMonacoEditorControllerOptions`, which gates the two `addAction` calls.

Gating the ACTIONS rather than the callbacks is the point: an action whose
callback is `undefined` still sits in the context menu and does nothing at all,
which is worse than the message it replaces. `renderViewerTabContent` is shared
by the desktop and mobile branches, so one line covers both.

No existing call site passes any of them.

### Compatibility

Every change is additive at its default. With the new prop, parameter or flag
absent, the touched components render and behave exactly as they do today, and
no existing call site in this repository passes one.

### Testing

`packages/components` typecheck and the full vitest suite pass. No new test: the controller needs a live Monaco editor.

### Notes for the reviewer

Gating the ACTIONS rather than the callbacks is the point — an action wired to an absent callback still sits in the context menu and does nothing at all, which is worse than the message it replaces. `renderViewerTabContent` is shared by desktop and mobile, so one line covers both.

---

### Review metadata

BlitzOS fork only. Delete this section before sending the PR to `LodyAI/Lody`.

| | |
|---|---|
| Branch | `blitz/seam-10-language-service-actions-prop` |
| Branched from | `f3474894 (the pinned upstream commit)` |
| Classification | B — host configurability |
| Suggested submit priority | P3 |
| Vendor seam patch | 10 (SP26) |

```
.../src/components/sessions/session-detail.tsx     | 12 +++
 .../sessions/session-file-content-view.tsx         | 16 ++++
 .../sessions/session-monaco-text-viewer.tsx        |  9 +++
 .../src/lib/session-monaco-editor-controller.ts    | 89 ++++++++++++----------
 4 files changed, 86 insertions(+), 40 deletions(-)
```
