**Title**

```
feat(components): open the local file handoff to a non-Electron bridge
```

**Body**

---

`canUseElectronLocalFileSend` is the gate on the attachment fast path that hands
bytes to the machine running the session instead of uploading them. It asks two
questions: is this Electron, and is there an IPC bridge. Only the second one is
about the transport.

Accept `window.__LODY_LOCAL_BRIDGE__` beside `isElectronRenderer()`, keeping the
`Boolean(getIpcServices())` term that decides whether the channel exists at all.
The `typeof window` guard is not decoration: `isElectronRenderer()` carries one,
and without it the module would throw where it used to answer false.

### Compatibility

Every change is additive at its default. With the new prop, parameter or flag
absent, the touched components render and behave exactly as they do today, and
no existing call site in this repository passes one.

### Testing

`packages/components` typecheck and the full vitest suite pass.

### Notes for the reviewer

**Stacked on `blitz/seam-1-non-electron-local-bridge`**, which declares the global this reads. Same caveat: a capability probe over `window.ipc` would answer this equally well, and the bridge does serve the channel.

---

### Review metadata

BlitzOS fork only. Delete this section before sending the PR to `LodyAI/Lody`.

| | |
|---|---|
| Branch | `blitz/seam-3-local-attachment-bridge-gate` |
| Branched from | `blitz/seam-1-non-electron-local-bridge` |
| Classification | B — host configurability |
| Suggested submit priority | P3 |
| Vendor seam patch | 3 |

```
packages/components/src/lib/electron-session-file-sender.ts | 4 +++-
 1 file changed, 3 insertions(+), 1 deletion(-)
```
