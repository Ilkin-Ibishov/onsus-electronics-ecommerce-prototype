import test from 'node:test';
import assert from 'node:assert/strict';
import { validateSocialLinks } from './settings-validation';

test('rejects social links with hostname substring bypass', () => {
  const result = validateSocialLinks({
    facebook: 'https://facebook.com.evil.example/path',
    instagram: '',
    twitter: '',
    linkedin: '',
    youtube: '',
    tiktok: '',
  });

  assert.equal(result.data, null);
  assert.equal(result.error, 'URL domain for facebook is not allowed.');
});

test('accepts allowed social domains and subdomains only', () => {
  const result = validateSocialLinks({
    facebook: 'https://m.facebook.com/shop',
    instagram: 'https://www.instagram.com/acme',
    twitter: 'https://x.com/acme',
    linkedin: 'https://linkedin.com/company/acme',
    youtube: 'https://youtu.be/abc123',
    tiktok: 'https://www.tiktok.com/@acme',
  });

  assert.equal(result.error, null);
  assert.ok(result.data);
});
