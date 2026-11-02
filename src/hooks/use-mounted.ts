import { useEffect, useState } from 'react';

/**
 * Hook to determine if component has mounted on the client.
 * Useful for avoiding hydration mismatches when rendering client-specific values.
 */
export function useMounted(): boolean {
  const [mounted, setMounted] = useState<boolean>(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return mounted;
}

