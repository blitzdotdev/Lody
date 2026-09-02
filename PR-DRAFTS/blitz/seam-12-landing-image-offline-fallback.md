**Title**

```
fix(components): degrade a chat-landing image to a file attachment when there is no cloud token
```

**Body**

---

`session-chat-input-area.tsx` already turns an image it cannot upload into a
pending FILE attachment over the local transport, with the
`sessions.imageStoredAsLocalFile` toast. On the chat landing the same two state
machines are two sibling hooks, and the image one has no fallback at all: with
no cloud token it fails with "Missing workspace or auth token", even though the
file draft beside it can hand the same bytes to the machine.

Give `useChatLandingImageDraft` an optional `degradeToFileAttachments`, called
before the credential guard when there is no token. `chat-landing.tsx` supplies
the file draft's own `addFiles` when that draft reports `canSendFileLocally`, so
the bytes take the file draft's transport, limits, chip, status and Retry, and
land on the same reserved session id. Nothing about the local send is restated
in the image hook.

The two hook calls swap order because the image draft now reads from the file
draft; the file draft has never read anything from the image draft.

With a cloud token the inserted block's condition is false, so `startUpload`
runs the same statements in the same order as before. The degrade is not
extended to a genuine upload failure — that would change what a token holder
sees, and the case here is the tokenless one alone.

Builds on the guard-order fix in the local file handoff.

### Compatibility

Every change is additive at its default. With the new prop, parameter or flag
absent, the touched components render and behave exactly as they do today, and
no existing call site in this repository passes one.

### Testing

`packages/components` typecheck and the full vitest suite pass. No new test: the landing drafts need a workspace runtime and an IPC bridge.

### Notes for the reviewer

**Stacked on `blitz/seam-8-local-file-handoff-before-token-guard`.** Without that fix the degraded file reaches the file draft and then fails at the same credential guard, so the two only make sense in that order.

---

### Review metadata

BlitzOS fork only. Delete this section before sending the PR to `LodyAI/Lody`.

| | |
|---|---|
| Branch | `blitz/seam-12-landing-image-offline-fallback` |
| Branched from | `blitz/seam-8-local-file-handoff-before-token-guard` |
| Classification | A — upstream bug fix |
| Suggested submit priority | P2 |
| Vendor seam patch | 12 |

```
.../src/components/chat/chat-landing.tsx           | 40 +++++++++--------
 .../src/hooks/use-chat-landing-file-draft.ts       |  3 ++
 .../src/hooks/use-chat-landing-image-draft.ts      | 51 ++++++++++++++++++++++
 3 files changed, 77 insertions(+), 17 deletions(-)
```
