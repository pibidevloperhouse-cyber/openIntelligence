import { createHmac, timingSafeEqual } from 'node:crypto';

export const votingStartsAt = Date.parse('2026-11-11T00:00:00+05:30');
export const votingEndsAt = Date.parse('2026-12-01T00:00:00+05:30');

export function hasProjectVoteLinkSecret() {
  return (getProjectVoteLinkSecret()?.length ?? 0) >= 32;
}

function getProjectVoteLinkSecret() {
  return process.env.PROJECT_VOTE_LINK_SECRET || process.env.SUPABASE_SERVICE_ROLE_KEY;
}

export function votingWindowOpen(now = Date.now()) {
  return now >= votingStartsAt && now < votingEndsAt;
}

export function makeProjectVoteToken(projectId) {
  const secret = getProjectVoteLinkSecret();
  if (!secret || secret.length < 32) throw new Error('Voting link secret is missing or too short');
  const signature = createHmac('sha256', secret).update(`showcase-2026:${projectId}`).digest('base64url');
  return `${projectId}.${signature}`;
}

export function readProjectVoteToken(token) {
  if (typeof token !== 'string' || !/^[a-f0-9-]{36}\.[A-Za-z0-9_-]{43}$/i.test(token)) return null;
  const [id] = token.split('.');
  if (!hasProjectVoteLinkSecret()) return null;
  const expected = makeProjectVoteToken(id);
  return timingSafeEqual(Buffer.from(token), Buffer.from(expected)) ? id : null;
}
