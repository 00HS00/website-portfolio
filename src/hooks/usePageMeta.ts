import { useEffect } from 'react';

function setMeta(selector: string, content: string) {
  const el = document.querySelector(selector);
  if (el) el.setAttribute('content', content);
}

export function usePageMeta(title: string, description?: string) {
  useEffect(() => {
    document.title = title;
    setMeta('meta[property="og:title"]', title);
    setMeta('meta[name="twitter:title"]', title);
    if (description) {
      setMeta('meta[name="description"]', description);
      setMeta('meta[property="og:description"]', description);
    }
  }, [title, description]);
}
