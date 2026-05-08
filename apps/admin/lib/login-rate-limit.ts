const MAX_FAILED_ATTEMPTS = 5;
const WINDOW_MS = 10 * 60 * 1000;
const BLOCK_MS = 15 * 60 * 1000;

type AttemptState = {
  failedAttempts: number;
  windowStartedAt: number;
  blockedUntil: number;
};

const loginAttempts = new Map<string, AttemptState>();

function buildAttemptKey(ip: string, email: string): string {
  return `${ip.toLowerCase()}::${email.toLowerCase()}`;
}

function getOrCreateState(key: string, now: number): AttemptState {
  const existing = loginAttempts.get(key);
  if (existing) {
    return existing;
  }

  const created: AttemptState = {
    failedAttempts: 0,
    windowStartedAt: now,
    blockedUntil: 0,
  };
  loginAttempts.set(key, created);
  return created;
}

export function resetLoginAttemptCounter(ip: string, email: string): void {
  loginAttempts.delete(buildAttemptKey(ip, email));
}

export function checkLoginAttempt(input: {
  ip: string;
  email: string;
  now?: number;
  loginSucceeded?: boolean;
}): { allowed: true } | { allowed: false; retryAfterMs: number } {
  const now = input.now ?? Date.now();
  const key = buildAttemptKey(input.ip, input.email);
  const state = getOrCreateState(key, now);

  if (state.blockedUntil > now) {
    return { allowed: false, retryAfterMs: state.blockedUntil - now };
  }

  if (now - state.windowStartedAt > WINDOW_MS) {
    state.failedAttempts = 0;
    state.windowStartedAt = now;
    state.blockedUntil = 0;
  }

  if (input.loginSucceeded === true) {
    loginAttempts.delete(key);
    return { allowed: true };
  }

  if (input.loginSucceeded === false) {
    state.failedAttempts += 1;
    if (state.failedAttempts > MAX_FAILED_ATTEMPTS) {
      state.blockedUntil = now + BLOCK_MS;
      return { allowed: false, retryAfterMs: BLOCK_MS };
    }
  }

  return { allowed: true };
}
