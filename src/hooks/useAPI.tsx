import { useState, useEffect } from 'react';

interface APIState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

export function useAPI<T>(
  apiFunction: () => Promise<{ data: T | null; loading: boolean; error: string | null }>,
  dependencies: any[] = []
) {
  const [state, setState] = useState<APIState<T>>({
    data: null,
    loading: true,
    error: null,
  });

  const refetch = async () => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    const result = await apiFunction();
    setState(result);
  };

  useEffect(() => {
    refetch();
  }, dependencies);

  return { ...state, refetch };
}