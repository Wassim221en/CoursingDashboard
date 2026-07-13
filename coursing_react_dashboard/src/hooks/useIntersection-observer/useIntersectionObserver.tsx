/* eslint-disable consistent-return */
import { useEffect, useState } from 'react';

function useIntersectionObserver(
  elementRef: Element | null,
  options = {
    threshold: 0,
    root: null,
    rootMargin: '0%',
    freezeOnceVisible: false,
  },
): IntersectionObserverEntry | undefined {
  const { freezeOnceVisible, root, rootMargin, threshold } = options;
  const [entry, setEntry] = useState<IntersectionObserverEntry>();

  const frozen = entry?.isIntersecting && freezeOnceVisible;

  const updateEntry = ([elem]: IntersectionObserverEntry[]): void => {
    setEntry(elem);
  };

  useEffect(() => {
    const node = elementRef; // DOM Ref
    const hasIOSupport = !!window.IntersectionObserver;

    if (!hasIOSupport || frozen || !node) return;

    const observerParams = { threshold, root, rootMargin };
    const observer = new IntersectionObserver(updateEntry, observerParams);

    observer.observe(node);

    return () => observer.disconnect();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [elementRef, JSON.stringify(threshold), root, rootMargin, frozen]);

  return entry;
}

export default useIntersectionObserver;
