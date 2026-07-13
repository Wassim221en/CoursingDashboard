import React from 'react';
import { useLocation } from 'react-router-dom';

function useSearchParams(key: string) {
  const { search } = useLocation();

  return React.useMemo(
    () => Number(new URLSearchParams(search).get(key)),
    [key, search],
  );
}

export default useSearchParams;
