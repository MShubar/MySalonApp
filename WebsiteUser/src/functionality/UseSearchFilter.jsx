import { useState, useMemo } from 'react';

export function useSearchFilter(data = [], field = 'name') {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredData = useMemo(() => {
    return data.filter((item) =>
      item[field]?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [data, field, searchQuery]);

  return { searchQuery, setSearchQuery, filteredData };
}
