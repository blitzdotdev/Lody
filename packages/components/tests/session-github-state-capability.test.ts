import { describe, expect, it } from 'vitest';
import type { SessionMeta, SessionId, SessionPullRequestMeta } from '@lody/shared';

import { getSessionGitHubState } from '../src/lib/session-github-state';

const createPullRequest = (
  overrides: Partial<SessionPullRequestMeta> = {}
): SessionPullRequestMeta => ({
  url: 'https://github.com/loro-dev/lody/pull/1518',
  number: 1518,
  repository: 'loro-dev/lody',
  branch: 'fix/example',
  status: 'open',
  reportedAt: '2026-03-27T10:00:00.000Z',
  ...overrides,
});

const createSession = (overrides: Partial<SessionMeta> = {}): SessionMeta =>
  ({
    id: 'session-1' as SessionId,
    machineId: 'machine-1',
    userId: 'user-1',
    createdAt: '2026-03-27T09:00:00.000Z',
    cliType: 'builtin',
    agentType: 'codex',
    ...overrides,
  }) as SessionMeta;

// A local clone carries a GitHub remote whether or not the platform can reach
// the GitHub App, so the repo name alone must not decide what the user sees.
describe('getSessionGitHubState with gitHubIntegrationAvailable', () => {
  const session = createSession({
    repoFullName: 'loro-dev/lody',
    workspaceDirty: true,
    pullRequests: [createPullRequest()],
  });

  it('defaults to available, so an existing caller is unchanged', () => {
    const state = getSessionGitHubState(session, null);
    expect(state.repoFullName).toBe('loro-dev/lody');
    expect(state.latestPr).not.toBeNull();
    expect(state.canShowGitHubActions).toBe(true);
    expect(state.hasExistingPr).toBe(true);
  });

  it('drops the repo identity and the pull request when the capability is off', () => {
    const state = getSessionGitHubState(session, null, false);
    expect(state.repoFullName).toBe('');
    expect(state.latestPr).toBeNull();
    expect(state.latestPrState).toBeNull();
    expect(state.canShowGitHubActions).toBe(false);
    expect(state.hasExistingPr).toBe(false);
  });

  it('keeps the change signals, which are not about GitHub', () => {
    const state = getSessionGitHubState(
      createSession({
        repoFullName: 'loro-dev/lody',
        workspaceDirty: true,
        diffStats: { allChange: { add: 3, del: 1 } },
      }),
      null,
      false
    );
    expect(state.workspaceDirty).toBe(true);
    expect(state.hasChanges).toBe(true);
  });
});
