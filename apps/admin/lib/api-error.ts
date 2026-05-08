export function sanitizeApiErrorMessage(fallback = 'Internal server error.'): string {
  return fallback;
}

export function logApiError(context: string, error: unknown): void {
  console.error(`[admin-api] ${context}`, error);
}
