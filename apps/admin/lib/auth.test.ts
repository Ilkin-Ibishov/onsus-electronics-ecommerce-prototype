import test from 'node:test';
import assert from 'node:assert/strict';
import { isAdminLoginAllowed, normalizeAdminRole, type AdminRole } from './auth';

test('normalizes unknown role to viewer', () => {
  assert.equal(normalizeAdminRole('unknown-role'), 'viewer');
  assert.equal(normalizeAdminRole(undefined), 'viewer');
});

test('allows login for all supported admin app roles', () => {
  const roles: AdminRole[] = ['admin', 'editor', 'viewer'];
  for (const role of roles) {
    assert.equal(isAdminLoginAllowed(role), true);
  }
});
