import { describe, expect, it, vi } from 'vitest';

import { getMentionDrillDownParent } from '../src/ui/mention/mention-trigger';
import {
  isMentionPathSearch,
  selectMentionMenuView,
  type MentionCandidate,
  type MentionCategory,
} from '../src/components/mentions/mention-registry';

function makeCandidate(value: string): MentionCandidate {
  return {
    value,
    label: value,
    insertText: `@${value}`,
    kind: 'file',
    icon: 'file',
    title: value,
  };
}

function makeCategory(
  id: MentionCategory['id'],
  namespace: string,
  label: string,
  candidates: string[],
  extra: Partial<MentionCategory> = {}
): MentionCategory {
  return {
    id,
    namespace,
    label,
    icon: 'file',
    status: 'ready',
    getCandidates: vi.fn((term: string) =>
      candidates.filter((entry) => entry.includes(term)).map(makeCandidate)
    ),
    ...extra,
  } as MentionCategory;
}

describe('getMentionDrillDownParent', () => {
  it('pops a bare namespace prefix to the bare trigger', () => {
    expect(getMentionDrillDownParent('issue:')).toBe('');
  });

  it('pops one path segment at a time', () => {
    expect(getMentionDrillDownParent('src/components/')).toBe('src/');
    expect(getMentionDrillDownParent('src/')).toBe('');
  });

  it('pops one path segment inside a namespace', () => {
    expect(getMentionDrillDownParent('file:src/components/')).toBe('file:src/');
    expect(getMentionDrillDownParent('file:src/')).toBe('file:');
  });

  // A level the user is still typing has nothing above it yet, so a key bound
  // to this stays out of the way instead of eating the keystroke.
  it('answers null mid-segment and for an empty search', () => {
    expect(getMentionDrillDownParent('src/comp')).toBeNull();
    expect(getMentionDrillDownParent('file:src/comp')).toBeNull();
    expect(getMentionDrillDownParent('')).toBeNull();
    expect(getMentionDrillDownParent('readme')).toBeNull();
  });
});

describe('isMentionPathSearch', () => {
  it('claims a search that carries a separator, and nothing else', () => {
    expect(isMentionPathSearch('src/')).toBe(true);
    expect(isMentionPathSearch('src/comp')).toBe(true);
    expect(isMentionPathSearch('readme')).toBe(false);
    expect(isMentionPathSearch('')).toBe(false);
  });
});

describe('selectMentionMenuView with a category that owns the bare search', () => {
  const file = makeCategory('file', 'file', 'Files', ['src/index.ts', 'src/app.ts'], {
    ownsBareSearch: isMentionPathSearch,
  });
  const command = makeCategory('command', 'command', 'Commands', ['src-sync']);

  it('scopes a bare path to the owning category instead of the aggregate level', () => {
    const view = selectMentionMenuView([file, command], 'src/');
    expect(view.level).toBe('category');
    if (view.level !== 'category') return;
    expect(view.category).toBe(file);
    expect(view.term).toBe('src/');
  });

  it('leaves a search no category claims at the aggregate level', () => {
    const view = selectMentionMenuView([file, command], 'src');
    expect(view.level).toBe('aggregate');
  });

  it('still resolves an explicit namespace first', () => {
    const view = selectMentionMenuView([file, command], 'command:src');
    expect(view.level).toBe('category');
    if (view.level !== 'category') return;
    expect(view.category).toBe(command);
  });
});
