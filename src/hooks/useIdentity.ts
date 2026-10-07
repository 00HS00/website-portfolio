import { useCallback, useState } from 'react';
import { trackerConfig } from '@/data/tracker';

const KEY = 'tracker:name';

/** Returns the canonical allowed name for any casing or spacing, or null if not allowed. */
export function matchAllowedName(input: string): string | null {
  const wanted = input.trim().toLowerCase();
  return trackerConfig.allowedNames.find((n) => n.toLowerCase() === wanted) ?? null;
}

function read(): string {
  try {
    return matchAllowedName(localStorage.getItem(KEY) ?? '') ?? '';
  } catch {
    return '';
  }
}

export function useIdentity() {
  const [name, setNameState] = useState(read);

  /** Signs in as the matching allowed name. Returns false if the name is not allowed. */
  const signIn = useCallback((input: string) => {
    const match = matchAllowedName(input);
    if (!match) return false;
    setNameState(match);
    try {
      localStorage.setItem(KEY, match);
    } catch {
      /* storage unavailable, name lasts for this session only */
    }
    return true;
  }, []);

  const signOut = useCallback(() => {
    setNameState('');
    try {
      localStorage.removeItem(KEY);
    } catch {
      /* nothing to clear */
    }
  }, []);

  return { name, signIn, signOut };
}
