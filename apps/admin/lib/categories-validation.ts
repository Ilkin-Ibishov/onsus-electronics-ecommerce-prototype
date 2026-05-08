const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export interface CategoryInput {
  name: string;
  slug: string;
  sortOrder: number;
}

export function validateCategoryInput(payload: unknown): {
  data: CategoryInput | null;
  error: string | null;
} {
  if (!payload || typeof payload !== 'object') {
    return { data: null, error: 'Invalid request payload.' };
  }

  const raw = payload as Record<string, unknown>;
  const name = String(raw.name ?? '').trim();
  const slug = String(raw.slug ?? '').trim().toLowerCase();
  const sortOrder = Number(raw.sortOrder);

  if (name.length < 2) {
    return { data: null, error: 'Name must be at least 2 characters.' };
  }

  if (!SLUG_PATTERN.test(slug)) {
    return { data: null, error: 'Slug must be lowercase kebab-case.' };
  }

  if (!Number.isInteger(sortOrder) || sortOrder < 0) {
    return { data: null, error: 'Sort order must be an integer >= 0.' };
  }

  return {
    data: {
      name,
      slug,
      sortOrder,
    },
    error: null,
  };
}
