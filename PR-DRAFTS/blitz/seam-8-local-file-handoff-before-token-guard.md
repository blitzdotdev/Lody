**Title**

```
fix(components): a missing cloud token must not disable the local file handoff
```

**Body**

---

All three attachment entry points bail on `if (!workspaceId || !authToken)`
before they reach the local handoff, and that handoff needs no cloud token: it
hands the bytes to the machine that runs the session over the local IPC
transport. A composition with no cloud token — the local desktop entry, which
must not make authenticated product-cloud requests — therefore fails every `+`
attachment with "Missing workspace or auth token" without issuing a single
request, and Retry re-enters the same guard.

Move the local handoff in front of the guard in `startFileUpload` and in the
chat-landing file draft, adding `workspaceId &&` to its own condition; the guard
keeps its text and still owns the cloud path below it.

For images, widen the guard to `!workspaceId || (!authToken && !canSendFileLocally)`
and throw inside the `try` when there is no token, so a tokenless image lands in
the `catch` that already degrades a failed image upload to a pending file
attachment over the local transport.

With a token present the order of operations is unchanged: the guard passes, the
local path runs first and the cloud path second, exactly as before.

### Compatibility

Every change is additive at its default. With the new prop, parameter or flag
absent, the touched components render and behave exactly as they do today, and
no existing call site in this repository passes one.

### Testing

`packages/components` typecheck and the full vitest suite pass. No new test is added here: the three entry points need a workspace runtime and a live IPC bridge to exercise, and this repo has no harness for either. The behaviour is verifiable by hand in a local composition — attach a file with no cloud token and watch the handoff run.

### Notes for the reviewer

Two of the three moved blocks had the credential guard as their only reachable predecessor, so with a token present the order of operations is byte-identical.

---

### Review metadata

BlitzOS fork only. Delete this section before sending the PR to `LodyAI/Lody`.

| | |
|---|---|
| Branch | `blitz/seam-8-local-file-handoff-before-token-guard` |
| Branched from | `f3474894 (the pinned upstream commit)` |
| Classification | A — upstream bug fix |
| Suggested submit priority | P1 |
| Vendor seam patch | 8 |

```
.../sessions/session-chat-input-area.tsx           | 38 +++++++++++++++-------
 .../src/hooks/use-chat-landing-file-draft.ts       | 26 ++++++++-------
 2 files changed, 41 insertions(+), 23 deletions(-)
```
