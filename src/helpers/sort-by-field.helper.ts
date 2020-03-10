function sortByField<T>(arr: T[], field: string): string[] {
  return arr
    .map(it => it[field])
    .sort((a, b) => a.localeCompare(b, undefined, { numeric: 'true' }));
}

export { sortByField };
