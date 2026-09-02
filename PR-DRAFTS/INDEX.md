# Upstream PR series — Lody seam patches

Branches prepared against the vendored upstream pin `f3474894`
(`fix(electron): detect system language before onboarding (#175)`, 2026-08-30),
which is the commit `vendor/lody/UPSTREAM.md` records. The npm daemon pinned
beside it is `lody@0.88.1`; nothing here touches the daemon.

Each branch carries one idea, applies to the pin, and typechecks and tests
clean in `packages/components`.

| Seam patch | Branch | Classification | Summary | Submit priority |
|---|---|---|---|---|
| 10 (BUG-1) | `blitz/seam-10-desktop-quick-open-dialog` | A — upstream bug fix | Ctrl/Cmd+P does nothing on desktop: the quick-open dialog is mounted only in the mobile return. | P1 |
| 10 (BUG-2) | `blitz/seam-10-file-index-retry` | A — upstream bug fix | Once the Code Collab file index fails, "Files unavailable" is terminal — nothing retries and the panel offers no way out. | P1 |
| 11 | `blitz/seam-11-mention-chip-click-and-path-drilldown` | A — upstream bug fix | A committed chip answers no click, and the file drill-down leaves the Files category. | P1 |
| 7 (capability half) | `blitz/seam-7-github-capability-gate` | A — upstream bug fix | Seven Session and chat surfaces never ask the `githubIntegration` capability that already exists. | P1 |
| 8 | `blitz/seam-8-local-file-handoff-before-token-guard` | A — upstream bug fix | A missing cloud token bails out in front of the local file handoff, which needs no token. | P1 |
| 12 | `blitz/seam-12-landing-image-offline-fallback` | A — upstream bug fix | An image staged on the chat landing has no offline fallback, though the in-session composer already has one. | P2 |
| 14 (capability half) | `blitz/seam-14-archive-pr-badge-capability-gate` | A — upstream bug fix | The archived row's PR badge links to github.com on a platform with no GitHub App. | P2 |
| 2 + 13 | `blitz/seam-2-sidebar-suppression-props` | B — host configurability | `LoroSidebar` has no way for an embedding host to suppress its own header, or to keep just one footer entry. | P2 |
| 6 | `blitz/seam-6-side-chat-requires-assistant-turn` | A — upstream bug fix | Side Chat accepts a click in a session with no assistant turn and refuses with a toast the host may not even mount. | P2 |
| 9 | `blitz/seam-9-session-list-worktree-glyph` | A — upstream bug fix | `SessionList` never renders `SessionRowWorktreeIndicator`, although its rows already carry `isWorktree`. | P2 |
| 1 | `blitz/seam-1-non-electron-local-bridge` | B — host configurability | Five local-plane guards ask "is this Electron" when the question they mean is "is there an IPC bridge". | P3 |
| 10 (SP26) | `blitz/seam-10-language-service-actions-prop` | B — host configurability | Go to Definition and Find References are registered unconditionally, so a machine with no language service answers every identifier with "unsupported". | P3 |
| 10 (SP28) | `blitz/seam-10-copy-file-path` | A — small missing feature, parity fix | The desktop file viewer has no "Copy file path"; the mobile drawer and the diff header both do. | P3 |
| 14 (prop half) | `blitz/seam-14-archive-team-scope-prop` | B — host configurability | The archive page's My Tasks / All Tasks control has nothing to switch between in a single-member workspace. | P3 |
| 3 | `blitz/seam-3-local-attachment-bridge-gate` | B — host configurability | The local attachment fast path is gated on Electron, though the channel behind it is a generic IPC proxy. | P3 |
| 4 | `blitz/seam-4-session-readonly-prop` | B — host configurability | No read-only mode exists: every member who can see a session may drive it. | P3 |
| 5 | `blitz/seam-5-host-surface-tabs` | B — host configurability | A host cannot contribute a tab to the session tab strip, though the strip already carries an unused non-session tab channel. | P3 |
| 7 (prop half) | `blitz/seam-7-host-suppression-props` | B — host configurability | Five opt-in props for cloud menu rows, the notification prompt, Agent Roles, the product hint band and the ⌘L chip. | P3 |

## Classification key

- **A — upstream bug fix.** A defect in upstream's own behaviour, submittable as
  it stands. Nothing is dropped from the vendor tree when it merges except the
  patch itself.
- **B — host configurability.** An opt-in prop, parameter or flag for a host
  embedding these components. Default behaviour is unchanged and no existing
  call site passes one.
- **C — not upstreamable.** See below.

## Submit priority

- **P1** — a member-visible defect with no workaround. Send first.
- **P2** — a member-visible defect with a workaround, or a small parity gap.
- **P3** — a new opt-in surface. Land after the A-class fixes, so review of the
  fixes is not blocked behind an API discussion.

## Stacked branches

Two branches are stacked and must be read (and merged) in order:

- `blitz/seam-12-landing-image-offline-fallback` sits on
  `blitz/seam-8-local-file-handoff-before-token-guard`. Without patch 8 the
  degraded file reaches the file draft and fails at the same guard.
- `blitz/seam-3-local-attachment-bridge-gate` sits on
  `blitz/seam-1-non-electron-local-bridge`, which declares the global it reads.

## Class C — not in this series, and why

- **`packages/box/patches/lody-local-platform.mjs`** — restores the
  `LODY_PLATFORM` env read in the published `lody` npm bundle, whose Vite config
  inlines the platform as a literal. This is a property of how the package is
  BUILT and published, not of the source tree; there is no source change that
  expresses it. It belongs in a release-configuration conversation, not a PR.
- **`packages/box/patches/lody-code-collab-worktree-root.mjs`** — the
  local-project branch of `resolveCodeCollabWorkspaceRoot` ignores
  `project.useWorktree` and `meta.isWorktree`, which the daemon's own terminal
  workdir resolver reads. This one IS a real upstream defect, but it lives in
  `apps/cli/src/lib/message-handler.ts` and the vendored evidence is a patch
  against the published bundle, not against the source. It needs its own
  investigation against `apps/cli` before it can be a PR.
- **`packages/box/patches/lody-acp-auth-queue.mjs`** — `extractQueueKey` sends
  every unnamed `machine/*` message to one serial chain, so the `submit-code`
  carrying an interactive login's code queues behind the login waiting for it.
  Also a real upstream defect, also in `apps/cli`, and also a bundle-level patch
  today. Same conclusion: worth opening, not from this series.
- **Everything under `packages/webapp/src/lody/`** in the BlitzOS tree — the
  integration layer, stubs, and inert clients. None of it is a change to these
  components; it is the host, and it is what the class B props exist to serve.

## What did not translate

The vendored patches are pinned by tests in a downstream webapp package that
mounts these components against a real daemon. Two of those translate to this
repository's `packages/components/tests` conventions and are included:

- `tests/mention-drill-down.test.ts` (seam 11)
- `tests/session-github-state-capability.test.ts` (seam 7, capability half)

The rest do not, and each PR body says which and why. The recurring reason is
that the downstream tests drive `SessionDetail`, `SessionChatInterface`, the
chat landing hooks or `LoroSidebar` against a live workspace runtime, a Flock
document and an IPC bridge; this repository has no equivalent harness, and a
mock-shaped substitute would assert the mock rather than the behaviour.

## Review PRs (BlitzOS fork only)

Every branch is pushed to `blitzdotdev/Lody` and carries a DRAFT pull request
there, for review before anything is sent to `LodyAI/Lody`. Nothing was opened
against upstream.

| Branch | PR base | Review PR | `tsgo --noEmit` | targeted `vitest run` |
|---|---|---|---|---|
| `blitz/seam-1-non-electron-local-bridge` | `main` | https://github.com/blitzdotdev/Lody/pull/1 | PASS | PASS (3 files) Tests  35 passed |
| `blitz/seam-10-copy-file-path` | `main` | https://github.com/blitzdotdev/Lody/pull/2 | PASS | PASS (1 files) + full suite 2839 passed |
| `blitz/seam-10-desktop-quick-open-dialog` | `main` | https://github.com/blitzdotdev/Lody/pull/3 | PASS | no test imports the changed modules |
| `blitz/seam-10-file-index-retry` | `main` | https://github.com/blitzdotdev/Lody/pull/4 | PASS | PASS (5 files) + full suite 2839 passed |
| `blitz/seam-10-language-service-actions-prop` | `main` | https://github.com/blitzdotdev/Lody/pull/5 | PASS | PASS (1 files) + full suite 2839 passed |
| `blitz/seam-11-mention-chip-click-and-path-drilldown` | `main` | https://github.com/blitzdotdev/Lody/pull/6 | PASS | PASS (5 files) Tests  67 passed |
| `blitz/seam-12-landing-image-offline-fallback` | `blitz/seam-8-local-file-handoff-before-token-guard` | https://github.com/blitzdotdev/Lody/pull/7 | PASS | no test imports the changed modules |
| `blitz/seam-14-archive-pr-badge-capability-gate` | `main` | https://github.com/blitzdotdev/Lody/pull/8 | PASS | no test imports the changed modules |
| `blitz/seam-14-archive-team-scope-prop` | `main` | https://github.com/blitzdotdev/Lody/pull/9 | PASS | no test imports the changed modules |
| `blitz/seam-2-sidebar-suppression-props` | `main` | https://github.com/blitzdotdev/Lody/pull/10 | PASS | PASS (4 files) Tests  16 passed |
| `blitz/seam-3-local-attachment-bridge-gate` | `blitz/seam-1-non-electron-local-bridge` | https://github.com/blitzdotdev/Lody/pull/11 | PASS | no test imports the changed modules |
| `blitz/seam-4-session-readonly-prop` | `main` | https://github.com/blitzdotdev/Lody/pull/12 | PASS | PASS (2 files) Tests  8 passed |
| `blitz/seam-5-host-surface-tabs` | `main` | https://github.com/blitzdotdev/Lody/pull/13 | PASS | PASS (1 files) Tests  2 passed |
| `blitz/seam-6-side-chat-requires-assistant-turn` | `main` | https://github.com/blitzdotdev/Lody/pull/14 | PASS | no test imports the changed modules |
| `blitz/seam-7-github-capability-gate` | `main` | https://github.com/blitzdotdev/Lody/pull/15 | PASS | PASS (10 files) Tests  42 passed |
| `blitz/seam-7-host-suppression-props` | `main` | https://github.com/blitzdotdev/Lody/pull/16 | PASS | PASS (4 files) Tests  14 passed |
| `blitz/seam-8-local-file-handoff-before-token-guard` | `main` | https://github.com/blitzdotdev/Lody/pull/17 | PASS | PASS (2 files) Tests  6 passed |
| `blitz/seam-9-session-list-worktree-glyph` | `main` | https://github.com/blitzdotdev/Lody/pull/18 | PASS | PASS (9 files) Tests  96 passed |

Both gates run in `packages/components`, the only package these branches touch.

`tsgo --noEmit` is the whole package, per branch, and is the strong gate: it is
what caught the one real defect this series had (`ViewerTabItem.type` gaining
`'custom'` widened two consumers in `session-detail.tsx` that map viewer tabs
into narrower side-panel and mobile-switcher unions).

The test column is every `tests/` file that imports a module the branch changed,
run with `--maxWorkers=2 --testTimeout=20000`. The full 396-file / 2839-test
suite passes at the pin and on the four branches marked above; running it 18
times was abandoned because the host is shared and an 8-worker run on 4 cores
manufactured timeout failures rather than real ones.

The fork's `main` is ~100 commits ahead of the pin these branches sit on, so
GitHub reports each branch as behind. The Files-changed view is still exactly
the branch's own diff, because it resolves against the merge base, which is the
pin. Rebasing onto current upstream is the last step before any of these leaves
the fork.
