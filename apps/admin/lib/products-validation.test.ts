import assert from 'node:assert/strict';
import test from 'node:test';
import { validateProductInput } from './products-validation';

const basePayload = {
  name: 'Sample product',
  categoryId: 'cat-1',
  price: 25,
  originalPrice: 40,
  discountPercent: 10,
  stockAvailable: 5,
  imageUrl: 'https://example.com/image.png',
};

test('rejects image URL with non-http scheme', () => {
  const result = validateProductInput({
    ...basePayload,
    imageUrl: 'javascript:alert(1)',
  });

  assert.equal(result.data, null);
  assert.equal(result.error, 'Image URL must use http or https.');
});

test('rejects overly long product name', () => {
  const result = validateProductInput({
    ...basePayload,
    name: 'a'.repeat(201),
  });

  assert.equal(result.data, null);
  assert.equal(result.error, 'Name must be at most 200 characters.');
});

test('rejects overly long image URL', () => {
  const result = validateProductInput({
    ...basePayload,
    imageUrl: `https://example.com/${'a'.repeat(2050)}`,
  });

  assert.equal(result.data, null);
  assert.equal(result.error, 'Image URL must be at most 2048 characters.');
});
