**Title**

```
fix(components): let the Code Collab file index retry after a failure
```

**Body**

---

Once the file-index acquisition fails, "Files unavailable" is terminal. The
effect keys on `{cache, flockDocId, loadLocalSnapshot, prepareTarget}` and a
reconnect changes none of them, so it never runs again; closing and reopening the
panel restores the whole tree, which shows only the effect is stuck. The panel
offers no way out either: the `Try again` action exists on the `local-error`
branch and on no other.

- `useCodeCollabFileIndexLoadState` takes a `reloadNonce`, joined into the
  existing `requestKey`, so bumping it re-runs the acquisition exactly as a
  changed cache or doc id would.
- `useCodeCollabSessionFileProvider` returns `reload`, and re-arms itself on an
  offline -> online transition of the owning machine. A transition, never a
  status: "retry while the status is error" loops for ever against a machine that
  is online and answering errors, while an edge fires at most once per outage.
- `FileTreeView` takes `onProviderRetry` and gives the provider-unavailable panel
  the same `RefreshCw` + `sessions.codeSession.files.retry` action the
  `local-error` panel already draws. Callers that pass nothing see no button.
- `SessionDetail` passes the provider's `reload`.

### Compatibility

Every change is additive at its default. With the new prop, parameter or flag
absent, the touched components render and behave exactly as they do today, and
no existing call site in this repository passes one.

### Testing

`packages/components` typecheck and the full vitest suite pass. No new test: the acquisition effect needs a runtime and a Flock document. The offline→online re-arm is the part most worth a test and is the one that needs the most scaffolding; happy to add it if you point at the harness you would want it in.

### Notes for the reviewer

The re-arm fires on a TRANSITION, never on a status: "retry while the status is error" loops for ever against a machine that is online and answering errors.

---

### Review metadata

BlitzOS fork only. Delete this section before sending the PR to `LodyAI/Lody`.

| | |
|---|---|
| Branch | `blitz/seam-10-file-index-retry` |
| Branched from | `f3474894 (the pinned upstream commit)` |
| Classification | A — upstream bug fix |
| Suggested submit priority | P1 |
| Vendor seam patch | 10 (BUG-2) |

```
.../sessions/components/file-tree-view.tsx         | 16 ++++++
 .../src/components/sessions/session-detail.tsx     |  3 ++
 .../hooks/use-code-collab-session-file-provider.ts | 57 ++++++++++++++++++++--
 3 files changed, 72 insertions(+), 4 deletions(-)
```
