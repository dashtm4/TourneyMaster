function mapKeys<T, U>(
  toArr: T[],
  fromArr: U[],
  primaryKey: string,
  keys: string[]
): T[] {
  return toArr.map(toItem => {
    const currentFromItem = fromArr.find(
      item => item[primaryKey] === toItem[primaryKey]
    );

    if (!currentFromItem) {
      return toItem;
    }

    return Object.assign(
      {},
      toItem,
      ...keys.map(key => ({ [key]: currentFromItem[key] }))
    );
  });
}

export { mapKeys };
