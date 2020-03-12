function arrToMap<T>(arr: T[], field: string): Object {
  return arr.reduce((acc, item) => {
    acc[item[field]] = item;

    return acc;
  }, {});
}

function mapToArr<T>(obj: Object, field: string): Array<T> {
  return Object.keys(obj).map(obj => obj[field]);
}

export { arrToMap, mapToArr };
