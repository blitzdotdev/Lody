**Title**

```
fix(components): ask the githubIntegration capability before drawing a GitHub surface
```

**Body**

---

`PLATFORM_CAPABILITIES` already names `githubIntegration` ("GitHub App
integration (repo registry, brokered tokens, PR status)") and
`LOCAL_PLATFORM_CAPABILITIES` is empty, so the answer is already false in every
local composition. `auto-archive-pr-watcher.tsx`, `general-setting.tsx` and
`integrations-setting.tsx` make that check; the Session surfaces never did.

A local clone carries a GitHub remote, so `repoFullName` is non-empty whether or
not the app can reach the GitHub App. On a local build that is enough to light
up the info bar's GitHub actions, the PR panel tab, the PR badge, the
`@issue`/`@pr` mention categories, the `#123` hydrator and the diff panel's
review-comment draft — every one of which ends at an App that is not connected.

`getSessionGitHubState` gains a third parameter, `gitHubIntegrationAvailable`,
defaulting to true so every existing caller keeps today's behaviour. With it off
both `repoFullName` and `latestPr` answer empty, and every value the consumers
read is downstream of those two. The four call sites pass
`useAppCapability('githubIntegration')`. The composer's `resolveSessionRepoFullName`
and the chat landing's local-project repo resolution answer the same capability,
and "Connect more GitHub projects" renders only with it.

No new capability is invented and no new prop is added: this is the existing
gate, asked in the places that never asked it.

### Compatibility

Every change is additive at its default. With the new prop, parameter or flag
absent, the touched components render and behave exactly as they do today, and
no existing call site in this repository passes one.

### Testing

`packages/components` typecheck and the full vitest suite pass. Adds `tests/session-github-state-capability.test.ts`. The seven call sites are React hooks reading `useAppCapability`; they are not unit tested here.

### Notes for the reviewer

No new capability and no new prop: `PLATFORM_CAPABILITIES` already declares `githubIntegration`, `LOCAL_PLATFORM_CAPABILITIES` is empty, and `auto-archive-pr-watcher.tsx`, `general-setting.tsx` and `integrations-setting.tsx` already make exactly this check.

---

### Review metadata

BlitzOS fork only. Delete this section before sending the PR to `LodyAI/Lody`.

| | |
|---|---|
| Branch | `blitz/seam-7-github-capability-gate` |
| Branched from | `f3474894 (the pinned upstream commit)` |
| Classification | A — upstream bug fix |
| Suggested submit priority | P1 |
| Vendor seam patch | 7 (capability half) |

```
.../src/components/chat/chat-landing.tsx           | 13 ++++-
 .../components/chat/unified-project-selector.tsx   | 15 +++--
 .../sessions/session-chat-input-area.tsx           | 11 +++-
 .../components/sessions/session-chat-interface.tsx | 11 +++-
 .../sessions/session-conversation-diff-panel.tsx   | 10 +++-
 .../src/components/sessions/session-detail.tsx     |  7 ++-
 .../components/src/lib/session-github-state.ts     | 25 ++++++--
 .../tests/session-github-state-capability.test.ts  | 68 ++++++++++++++++++++++
 8 files changed, 143 insertions(+), 17 deletions(-)
```
