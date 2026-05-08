import test from 'node:test';
import assert from 'node:assert/strict';
import {
  isReadAllowed,
  isMutationAllowed,
  type AdminReadPermission,
  type AdminMutationPermission,
} from './admin-authorization';
import type { AdminRole } from './auth';

const ALL_ROLES: AdminRole[] = ['admin', 'editor', 'viewer'];

const CASES: Array<{
  permission: AdminMutationPermission;
  allow: AdminRole[];
}> = [
  { permission: 'categories:create', allow: ['admin', 'editor'] },
  { permission: 'categories:update', allow: ['admin', 'editor'] },
  { permission: 'categories:delete', allow: ['admin'] },
  { permission: 'products:create', allow: ['admin', 'editor'] },
  { permission: 'products:update', allow: ['admin', 'editor'] },
  { permission: 'products:delete', allow: ['admin'] },
  { permission: 'settings:social-links:update', allow: ['admin'] },
];

const READ_CASES: Array<{
  permission: AdminReadPermission;
  allow: AdminRole[];
}> = [
  { permission: 'categories:read', allow: ['admin', 'editor', 'viewer'] },
  { permission: 'products:read', allow: ['admin', 'editor', 'viewer'] },
  { permission: 'settings:social-links:read', allow: ['admin'] },
];

for (const { permission, allow } of CASES) {
  test(`allows expected roles for ${permission}`, () => {
    for (const role of ALL_ROLES) {
      const expected = allow.includes(role);
      assert.equal(isMutationAllowed(role, permission), expected);
    }
  });
}

for (const { permission, allow } of READ_CASES) {
  test(`allows expected roles for ${permission}`, () => {
    for (const role of ALL_ROLES) {
      const expected = allow.includes(role);
      assert.equal(isReadAllowed(role, permission), expected);
    }
  });
}
