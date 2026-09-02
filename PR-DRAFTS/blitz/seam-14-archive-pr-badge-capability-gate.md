**Title**

```
fix(components): gate the archived row's PR badge on the githubIntegration capability
```

**Body**

---

An archived session carries `pullRequests` whatever platform is reading it, so
the archive row draws a PR status glyph linking to github.com on a composition
that declares no `githubIntegration` and has no GitHub App behind the link.
`useAppCapability('githubIntegration')` is the check the Session surfaces make;
the archive row simply never asked.

`getArchivedSessionItemViewModel` gains a third parameter defaulting to true, and
drops the pull-request list with the capability off — which zeroes `prUrl`,
`prStatusMeta`, `PrIcon` and `prTooltipLabel` together, the same shape
`getSessionGitHubState` uses. Both item components read the capability and pass
it.

No new prop and no new capability.

### Compatibility

Every change is additive at its default. With the new prop, parameter or flag
absent, the touched components render and behave exactly as they do today, and
no existing call site in this repository passes one.

### Testing

`packages/components` typecheck and the full vitest suite pass. No new test: `getArchivedSessionItemViewModel` is module-private, so the assertion would have to go through a rendered row. Exporting it for a test is a change this PR did not want to make on its own; say the word and it can.

### Notes for the reviewer

Same shape as the `getSessionGitHubState` gate in the Session surfaces, applied to the one row family that never asked.

---

### Review metadata

BlitzOS fork only. Delete this section before sending the PR to `LodyAI/Lody`.

| | |
|---|---|
| Branch | `blitz/seam-14-archive-pr-badge-capability-gate` |
| Branched from | `f3474894 (the pinned upstream commit)` |
| Classification | A — upstream bug fix |
| Suggested submit priority | P2 |
| Vendor seam patch | 14 (capability half) |

```
.../components/src/components/archive/archive-view.tsx | 18 ++++++++++++++----
 1 file changed, 14 insertions(+), 4 deletions(-)
```
