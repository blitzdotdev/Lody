/** @vitest-environment jsdom */

import { createStore } from 'jotai';
import { beforeEach, describe, expect, it } from 'vitest';

// Importing this module evaluates the repos-cache atom's default exactly once,
// against an empty localStorage. Every write below happens after that, which is
// the whole point: a store built later must not inherit that snapshot.
import {
  allGitHubReposCacheAtom,
  setWorkspaceReposCacheAtom,
  workspaceReposCacheAtomFamily,
} from '../src/atoms/local-storage-cache';
import { githubReposCache, type CachedGitHubRepo } from '../src/lib/local-storage-cache';

const REPOSITORY: CachedGitHubRepo = { fullName: 'LodyAI/Lody', description: null };

beforeEach(() => {
  localStorage.clear();
});

describe('allGitHubReposCacheAtom', () => {
  it('gives a store created after a write the cached repos, not the import-time snapshot', () => {
    githubReposCache.set('ws-1', { repositories: [REPOSITORY], updatedAt: 1 });

    const laterStore = createStore();

    expect(laterStore.get(allGitHubReposCacheAtom)['ws-1']?.repositories).toEqual([REPOSITORY]);
    expect(laterStore.get(workspaceReposCacheAtomFamily('ws-1'))).toEqual([REPOSITORY]);
  });

  it('stays writable through setWorkspaceReposCacheAtom, in localStorage and in the store', () => {
    const store = createStore();

    store.set(setWorkspaceReposCacheAtom, { workspaceId: 'ws-2', repositories: [REPOSITORY] });

    expect(store.get(workspaceReposCacheAtomFamily('ws-2'))).toEqual([REPOSITORY]);
    expect(githubReposCache.get('ws-2')?.repositories).toEqual([REPOSITORY]);
  });

  it('keeps each store independent', () => {
    const writingStore = createStore();
    writingStore.set(setWorkspaceReposCacheAtom, {
      workspaceId: 'ws-3',
      repositories: [REPOSITORY],
    });

    // A store built afterwards re-reads localStorage rather than sharing state.
    const laterStore = createStore();
    expect(laterStore.get(workspaceReposCacheAtomFamily('ws-3'))).toEqual([REPOSITORY]);

    localStorage.clear();
    const cleanStore = createStore();
    expect(cleanStore.get(workspaceReposCacheAtomFamily('ws-3'))).toBeNull();
    // The store that did the write keeps its own value.
    expect(writingStore.get(workspaceReposCacheAtomFamily('ws-3'))).toEqual([REPOSITORY]);
  });
});
