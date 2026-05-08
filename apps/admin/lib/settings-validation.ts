export interface SocialLinks {
  facebook: string;
  instagram: string;
  twitter: string;
  linkedin: string;
  youtube: string;
  tiktok: string;
}

const allowedDomains: Record<keyof SocialLinks, string[]> = {
  facebook: ['facebook.com'],
  instagram: ['instagram.com'],
  twitter: ['twitter.com', 'x.com'],
  linkedin: ['linkedin.com'],
  youtube: ['youtube.com', 'youtu.be'],
  tiktok: ['tiktok.com'],
};

function matchesAllowedHost(hostname: string, allowedDomain: string): boolean {
  const host = hostname.toLowerCase();
  const domain = allowedDomain.toLowerCase();
  return host === domain || host.endsWith(`.${domain}`);
}

export function validateSocialLinks(payload: unknown): {
  data: SocialLinks | null;
  error: string | null;
} {
  if (!payload || typeof payload !== 'object') {
    return { data: null, error: 'Invalid request payload.' };
  }

  const raw = payload as Record<string, unknown>;
  const keys = Object.keys(allowedDomains) as (keyof SocialLinks)[];
  const result = {} as SocialLinks;

  for (const key of keys) {
    const value = String(raw[key] ?? '').trim();
    if (value.length === 0) {
      result[key] = '';
      continue;
    }

    let parsed: URL;
    try {
      parsed = new URL(value);
    } catch {
      return { data: null, error: `Invalid URL for ${key}.` };
    }

    const domainAllowed = allowedDomains[key].some((domain) =>
      matchesAllowedHost(parsed.hostname, domain)
    );
    if (!domainAllowed) {
      return { data: null, error: `URL domain for ${key} is not allowed.` };
    }

    result[key] = value;
  }

  return { data: result, error: null };
}
