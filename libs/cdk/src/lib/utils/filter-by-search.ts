export function filterBySearch<T>(
  array: Partial<T>[],
  search: string,
  keyFilter: keyof T | (keyof T)[] = 'name' as keyof T
): Partial<T>[] {
  return array.filter((item) => {
    if (typeof keyFilter === 'string')
      return item[keyFilter] && (item[keyFilter] + '').toLowerCase().indexOf(search.toLowerCase()) > -1;
    else {
      const results = (keyFilter as (keyof T)[]).map((key) => {
        return item[key] && (item[key] + '').toLowerCase().indexOf(search.toLowerCase()) > -1;
      });
      return results.some((result) => result);
    }
  });
}
