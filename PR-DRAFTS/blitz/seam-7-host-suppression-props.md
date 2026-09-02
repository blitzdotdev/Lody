**Title**

```
feat(components): opt-in props for surfaces an embedding host does not serve
```

**Body**

---

Three groups of controls render on a hosted or single-member composition and
cannot work there, and none of them has a capability that answers the question.
Each is a new optional prop defaulting to today's behaviour; no existing call
site passes any of them.

- `SessionChatInterface.hideCloudMenuItems`, forwarded to `SessionHeaderMenu`:
  drops "Change owner", "Share with team" and "Copy URL". A single-member
  workspace has no second member to hand a session to, a host may serve sharing
  from its own chrome, and "Copy URL" builds a deep link and toasts success
  either way. Each row's existing gate (`owner`, `sharing`, `onCopyUrl`) answers
  a different question.
- `SessionChatInterface.hideNotificationPrompt`: for a host that mounts no push
  provider, so Enable asks the browser for a permission nothing consumes.
- `SessionChatInterface.hideAgentRoles` and `ChatLanding.hideAgentRoles`, both
  forwarded to the composer's run-config menu: for a workspace catalog with no
  Roles and no writer for one, where an empty list renders a "New role" entry
  opening an editor whose save has nowhere to land.
- `ChatLanding.hideProductHints`: the hint band's `no-machine` state resolves
  `download-client` outside Electron, so a hosted surface tells the member to
  install the desktop app; `no-agent-config` offers "Go to Settings", which on a
  host that mounts no settings surface only flips an atom.
- `SessionDetail.keyboardShortcutsAvailable`: the composer draws its ⌘L
  discovery chip from the `session.focusInput` registration, so a host that never
  calls `commands.attach(window)` advertises a chord nothing answers. Passed as
  `useCommand`'s existing second argument.

`SessionDetail` declares and forwards the three chat-surface props to every
surface it mounts.

### Compatibility

Every change is additive at its default. With the new prop, parameter or flag
absent, the touched components render and behave exactly as they do today, and
no existing call site in this repository passes one.

### Testing

`packages/components` typecheck and the full vitest suite pass. No new test: every prop is a render guard inside a component that needs a workspace runtime.

### Notes for the reviewer

Companion to `blitz/seam-7-github-capability-gate`, which is the half of this work that needed no prop because the capability already existed. These three groups have no capability that answers them, and inventing one per group would be a bigger claim than the suppression. Every prop defaults to today's behaviour and no existing call site passes one.

`keyboardShortcutsAvailable` uses `useCommand`'s existing second argument, so it is one changed line.

---

### Review metadata

BlitzOS fork only. Delete this section before sending the PR to `LodyAI/Lody`.

| | |
|---|---|
| Branch | `blitz/seam-7-host-suppression-props` |
| Branched from | `f3474894 (the pinned upstream commit)` |
| Classification | B — host configurability |
| Suggested submit priority | P3 |
| Vendor seam patch | 7 (prop half) |

```
.../src/components/chat/chat-landing.tsx           | 58 ++++++++++++++-----
 .../sessions/session-chat-input-area.tsx           | 13 ++++-
 .../components/sessions/session-chat-interface.tsx | 66 +++++++++++++++++-----
 .../src/components/sessions/session-detail.tsx     | 33 ++++++++++-
 4 files changed, 139 insertions(+), 31 deletions(-)
```
