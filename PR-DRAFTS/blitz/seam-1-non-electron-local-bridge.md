**Title**

```
feat(components): let a non-Electron host serve the local planes
```

**Body**

---

The local Machine RPC, local file preview, local project git state, local
project control and local session-control planes all gate on
`window.__LODY_ELECTRON__`. The transport behind them is `window.ipc`, which is
not Electron-specific: `getIpcServices()` is a generic proxy and the local Loro
data plane already gates on that alone.

Declare `window.__LODY_LOCAL_BRIDGE__` and accept it beside the Electron flag,
so a host that installs `window.ipc` by some other means can reach the same
planes. Every predicate is widened by disjunction, so it can only become true
where it was false; no Electron path changes.

### Compatibility

Every change is additive at its default. With the new prop, parameter or flag
absent, the touched components render and behave exactly as they do today, and
no existing call site in this repository passes one.

### Testing

`packages/components` typecheck and the full vitest suite pass. No new test: every guard is inside a provider that needs a live machine route.

### Notes for the reviewer

The alternative you may prefer is a capability probe over `window.ipc` instead of a second global. That would suit a host equally well and this PR would be withdrawn for it — the flag is the smallest change, not the only one. Note that the local Loro DATA plane already gates on `getIpcServices()` alone, so the asymmetry this removes is already half gone upstream.

---

### Review metadata

BlitzOS fork only. Delete this section before sending the PR to `LodyAI/Lody`.

| | |
|---|---|
| Branch | `blitz/seam-1-non-electron-local-bridge` |
| Branched from | `f3474894 (the pinned upstream commit)` |
| Classification | B — host configurability |
| Suggested submit priority | P3 |
| Vendor seam patch | 1 |

```
packages/components/src/providers/create-workspace-runtime.ts  |  2 +-
 .../components/src/providers/workspace-machine-rpc-facade.ts   | 10 ++++++----
 packages/components/src/window-globals.d.ts                    |  1 +
 3 files changed, 8 insertions(+), 5 deletions(-)
```
