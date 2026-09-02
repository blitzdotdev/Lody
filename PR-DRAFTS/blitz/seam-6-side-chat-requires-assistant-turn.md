**Title**

```
fix(components): disable Side Chat until there is an assistant turn to fork
```

**Body**

---

In a session the agent has not answered yet, the Side Chat entry accepts a click
and nothing visible happens. The launcher forks the active conversation, a fork
needs a completed assistant turn, and with none `forkActiveConversation` returns
after a `toast.error` — so the entry reads as broken rather than as refused.

Say it before the click, the way the same launcher already says it for an
offline machine: `disabled`. Hiding the entry is worse — a session that has not
answered yet would look like one where Side Chat does not exist, and the option
comes back a second later.

The fork target has to be a value a render can read. `chatRefsMap` is a ref, so
`getLastAssistantTurnId()` answers when somebody asks, which is right for a
click and useless for a rendered state. `setChatTabRef` mirrors it into state on
ATTACH; `useImperativeHandle` already carries
`lastCompletedAssistantMessageId` in its dependency list, so React re-attaches
the ref on the commit that first has a turn.

The detach is ignored deliberately. Every render hands each chat surface a fresh
ref arrow, so React calls it with null and then with the handle inside one
commit; taking the null would queue a state change on every commit and the page
would re-render for ever.

Cost, against what it fixes: a session that HAS answered shows the launcher
disabled for the moment its history takes to paint. That is a control nobody is
looking at during a page load, and it replaces a control a member clicks that
answers with an error. Fork semantics are untouched — what changes is whether
the entry offers the click.

### Compatibility

Every change is additive at its default. With the new prop, parameter or flag
absent, the touched components render and behave exactly as they do today, and
no existing call site in this repository passes one.

### Testing

`packages/components` typecheck and the full vitest suite pass. No new test: `SessionDetail` needs a workspace runtime.

### Notes for the reviewer

Submitted UNCONDITIONAL. The vendored version of this change is behind an opt-in prop, only because that tree's rule is that no in-vendor edit may change default behaviour. "Disable Side Chat when there is nothing to fork" is not a host opinion, so it is offered here without the prop. If you would rather have it opt-in, the prop version is a two-line change on top.

---

### Review metadata

BlitzOS fork only. Delete this section before sending the PR to `LodyAI/Lody`.

| | |
|---|---|
| Branch | `blitz/seam-6-side-chat-requires-assistant-turn` |
| Branched from | `f3474894 (the pinned upstream commit)` |
| Classification | A — upstream bug fix |
| Suggested submit priority | P2 |
| Vendor seam patch | 6 |

```
.../src/components/sessions/session-detail.tsx     | 32 +++++++++++++++++++++-
 1 file changed, 31 insertions(+), 1 deletion(-)
```
