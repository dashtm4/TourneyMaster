function sortByField<T>(arr: T[], field: string): string[] {
  return arr
    .map(it => it[field])
    .sort((a, b) => (a[field] > b[field] ? 1 : -1));
}

export { sortByField };
