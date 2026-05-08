import test from 'node:test';
import assert from 'node:assert/strict';
import { checkLoginAttempt, resetLoginAttemptCounter } from './login-rate-limit';

test('blocks repeated failed login attempts for same key', () => {
  const ip = '127.0.0.1';
  const email = 'admin@example.com';
  const now = 1_000;

  resetLoginAttemptCounter(ip, email);

  for (let attempt = 0; attempt < 5; attempt += 1) {
    checkLoginAttempt({
      ip,
      email,
      now,
      loginSucceeded: false,
    });
  }

  const blocked = checkLoginAttempt({
    ip,
    email,
    now,
    loginSucceeded: false,
  });

  assert.equal(blocked.allowed, false);
  assert.ok((blocked.retryAfterMs ?? 0) > 0);
});

test('clears limiter state after successful login', () => {
  const ip = '127.0.0.1';
  const email = 'admin@example.com';
  const now = 2_000;

  resetLoginAttemptCounter(ip, email);

  checkLoginAttempt({
    ip,
    email,
    now,
    loginSucceeded: false,
  });
  checkLoginAttempt({
    ip,
    email,
    now: now + 100,
    loginSucceeded: true,
  });

  const result = checkLoginAttempt({
    ip,
    email,
    now: now + 200,
    loginSucceeded: false,
  });

  assert.equal(result.allowed, true);
});
