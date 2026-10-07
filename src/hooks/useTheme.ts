import { useCallback, useState } from 'react';

type Theme = 'dark' | 'light';

function current(): Theme {
  return document.documentElement.getAttribute('data-theme') === 'light' ? 'light' : 'dark';
}

export function useTheme() {
  const [theme, setThemeState] = useState<Theme>(current);

  const toggle = useCallback(() => {
    const next: Theme = current() === 'light' ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', next);
    try {
      localStorage.setItem('theme', next);
    } catch {
      /* storage unavailable, theme lasts for this visit only */
    }
    setThemeState(next);
  }, []);

  return { theme, toggle };
}
