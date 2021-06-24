export function filterBySearch(array: any[], search: string, key = 'name') {
  return array.filter((items) => items[key] && items[key].toLowerCase().indexOf(search.toLowerCase()) > -1);
}
