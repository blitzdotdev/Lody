**Title**

```
feat(components): add Copy file path to the desktop file viewer
```

**Body**

---

`MobileFileViewerDrawer` has carried this action since it landed, under
`sessions.fileViewer.copyPath`, and `ui/diff-viewer/diff-file-header-actions.tsx`
draws the same button with the same key. The desktop viewer has no way to get at
the path it is showing.

Add the button to the viewer toolbar, before the search control. The path is
knowable for every file the viewer can show, binary previews included, so the
control has no condition of its own beyond a non-empty path, and it joins
`showViewerTopBar` so a file whose toolbar was otherwise empty still gets one.

Adds `sessions.fileViewer.pathCopyFailed` beside the existing `pathCopied`.

### Compatibility

Every change is additive at its default. With the new prop, parameter or flag
absent, the touched components render and behave exactly as they do today, and
no existing call site in this repository passes one.

### Testing

`packages/components` typecheck and the full vitest suite pass. No new test: the viewer needs a file provider to mount.

### Notes for the reviewer

Adds `sessions.fileViewer.pathCopyFailed` to `en.json` and `zh_CN.json`, beside the existing `pathCopied`.

---

### Review metadata

BlitzOS fork only. Delete this section before sending the PR to `LodyAI/Lody`.

| | |
|---|---|
| Branch | `blitz/seam-10-copy-file-path` |
| Branched from | `f3474894 (the pinned upstream commit)` |
| Classification | A — small missing feature, parity fix |
| Suggested submit priority | P3 |
| Vendor seam patch | 10 (SP28) |

```
locales/en.json                                    |  1 +
 locales/zh_CN.json                                 |  1 +
 .../sessions/session-file-content-view.tsx         | 29 +++++++++++++++++++++-
 3 files changed, 30 insertions(+), 1 deletion(-)
```
