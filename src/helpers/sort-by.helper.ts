import { SortByFilesTypes } from 'common/enums';

function sortByField<T>(arr: T[], field: SortByFilesTypes): T[] {
  return arr.sort((a, b) =>
    a[field].localeCompare(b[field], undefined, { numeric: true })
  );
}

function sortTitleByField<T>(arr: T[], field: SortByFilesTypes): string[] {
  return arr
    .map(it => it[field])
    .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));
}

export { sortByField, sortTitleByField };
