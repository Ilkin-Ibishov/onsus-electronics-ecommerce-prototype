import assert from 'node:assert/strict';
import test from 'node:test';
import {
  buildProductMutationPayload,
  isMissingProductImageGalleryColumnError,
  isMissingProductOptionalColumnError,
} from '@/lib/products-write-contract';

const baseInput = {
  name: 'Sample product',
  categoryId: 'cat-1',
  price: 25,
  originalPrice: 40,
  discountPercent: 10,
  stockAvailable: 5,
  imageUrl: 'https://example.com/image.png',
};

test('includes optional localized description fields when enabled', () => {
  const payload = buildProductMutationPayload(baseInput, true);
  assert.equal(payload.description_az, baseInput.name);
  assert.equal(payload.description_ru, baseInput.name);
});

test('omits optional localized description fields when disabled', () => {
  const payload = buildProductMutationPayload(baseInput, false);
  assert.equal('description_az' in payload, false);
  assert.equal('description_ru' in payload, false);
});

test('detects schema cache mismatch for optional columns', () => {
  const err = {
    message: "Could not find the 'description_az' column of 'products' in the schema cache",
  };
  assert.equal(isMissingProductOptionalColumnError(err), true);
});

test('detects schema cache mismatch for required description column', () => {
  const err = {
    message: "Could not find the 'description_en' column of 'products' in the schema cache",
  };
  assert.equal(isMissingProductOptionalColumnError(err), true);
});

test('detects schema cache mismatch for image gallery column', () => {
  const err = {
    message: "Could not find the 'image_gallery' column of 'products' in the schema cache",
  };
  assert.equal(isMissingProductImageGalleryColumnError(err), true);
});

test('omits all description fields when descriptions are disabled', () => {
  const payload = buildProductMutationPayload(baseInput, false);
  assert.equal('description_en' in payload, false);
  assert.equal('description_az' in payload, false);
  assert.equal('description_ru' in payload, false);
});

test('keeps descriptions when only image gallery is disabled', () => {
  const payload = buildProductMutationPayload(baseInput, true, false);
  assert.equal(payload.description_en, baseInput.name);
  assert.equal(payload.description_az, baseInput.name);
  assert.equal(payload.description_ru, baseInput.name);
  assert.equal('image_gallery' in payload, false);
});

test('ignores unrelated errors', () => {
  const err = { message: 'permission denied for table products' };
  assert.equal(isMissingProductOptionalColumnError(err), false);
  assert.equal(isMissingProductImageGalleryColumnError(err), false);
});
