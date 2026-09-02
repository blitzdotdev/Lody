**Title**

```
feat(components): let a host contribute tabs to the session tab strip
```

**Body**

---

A host embedding the session viewer may own surfaces that belong beside the
conversation rather than in a second tab strip of their own. This fills a hole
that already exists rather than cutting a new one: `SessionTabBar` already
carries `viewerTabs`, `activeViewerTabId`, `onViewerTabSelect` and
`onViewerTabClose`, the `viewer` arm of `SortableItemData` is implemented, and
the one production call site passes `variant="session"` and no viewer tabs at
all. `variant="viewer"` is declared and cannot be used, because `parentSession`
is required by a strip that variant tells not to draw.

`SessionTabBar`:
- `ViewerTabItem.type` gains `'custom'` and the item gains an optional `icon`,
  so the bar draws and sorts a host tab exactly like a file or diff tab without
  knowing what is behind it.
- `parentSession` becomes optional, and the two places that read it are guarded,
  so `variant="viewer"` is finally usable.

`SessionDetail` gains six props: `surfaceTabs`, `activeSurfaceTabId`,
`onSurfaceTabSelect`, `onSurfaceTabClose`, `onSessionTabSelect` and
`onSessionMissing`. The host owns the list, the selection and both verbs; the
page owns the drawing and the layout, and tells the host when its own selection
has taken the view back.

Two of those need saying:

- An active host tab hides every conversation surface, so the host's selection
  has to end when the page selects a conversation tab — and that selection is
  `useState`, per parent session, not in the URL. Ten call sites move it, so the
  notification is a wrapper around the setter rather than a call at each site,
  and not an effect on the value: an effect fires on a CHANGE, and the click that
  most needs the call changes nothing, because the parent tab is already
  selected while a host tab covers it. The three writers that keep the raw setter
  are corrections rather than selections (the render-time session-switch reset
  and the two `?tab=` syncs), and their signature difference — an updater, not an
  id — makes the exclusion structural.
- `SessionDetail` returns above the tab strip on the not-found branch, and that
  return takes every host tab with it. `onSessionMissing` is how the host hears
  it. The call sits above the once-per-session-id analytics gate deliberately:
  what a host does with this is move an address, and an address can come back.
  It is read from a ref so a fresh host closure does not re-run the effect.

`content` is a `ReactNode` mounted inline and hidden, not a portal host: React
remounts a portal whose container identity changes, so the container swap a
ref-callback host was meant to avoid happens anyway. The memo that maps
`surfaceTabs` sits beside `viewerTabItems`, above every early return, because
this component returns early below it.

The mobile drawer is deliberately not changed: `MobileSessionTabSheet` keeps its
own kind enum, and the props are inert there.

With every new prop absent, both components render exactly what they rendered
before, and no existing call site passes one.

### Compatibility

Every change is additive at its default. With the new prop, parameter or flag
absent, the touched components render and behave exactly as they do today, and
no existing call site in this repository passes one.

### Testing

`packages/components` typecheck and the full vitest suite pass. No new test: both components need a workspace runtime. The one defect worth a regression test — the `useMemo` placement, which must sit above every early return or React reports "Rendered more hooks than during the previous render" — is pinned downstream against a live daemon and does not translate to this repo's harness.

### Notes for the reviewer

The largest of this series and the one most worth arguing with. Two things to look at first:

1. The setter wrapper (`setActiveTabSessionId`). It exists because an active host tab hides every conversation surface, so the host's selection has to end when this page selects one — and that selection is `useState`, not a URL field. An effect on the value cannot do it: the click that most needs the call changes nothing.
2. `onSessionMissing`. `SessionDetail` returns above the tab strip on the not-found branch and every host tab goes with it.

If you would rather grow a host-tab concept of your own, all of this is replaceable by it.

---

### Review metadata

BlitzOS fork only. Delete this section before sending the PR to `LodyAI/Lody`.

| | |
|---|---|
| Branch | `blitz/seam-5-host-surface-tabs` |
| Branched from | `f3474894 (the pinned upstream commit)` |
| Classification | B — host configurability |
| Suggested submit priority | P3 |
| Vendor seam patch | 5 |

```
.../src/components/sessions/session-detail.tsx     | 158 +++++++++++++++++++--
 .../src/components/sessions/session-tab-bar.tsx    |  29 ++--
 2 files changed, 170 insertions(+), 17 deletions(-)
```
