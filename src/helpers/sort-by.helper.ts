import { compareTime } from 'helpers';
import { SortByFilesTypes } from 'common/enums';

const sortByField = <T>(arr: T[], field: SortByFilesTypes): T[] => {
  return arr.sort((a, b) =>
    a[field].localeCompare(b[field], undefined, { numeric: true })
  );
};

const sortTitleByField = <T>(arr: T[], field: SortByFilesTypes): string[] => {
  return arr
    .map(it => it[field])
    .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));
};

const sortByTime = <T>(arr: T[]): T[] => {
  const updtedByArr = arr
    .filter(it => it[SortByFilesTypes.UPDATED_DATETIME])
    .sort((a, b) =>
      compareTime(
        a[SortByFilesTypes.UPDATED_DATETIME],
        b[SortByFilesTypes.UPDATED_DATETIME]
      )
    );

  const createdByArr = arr
    .filter(
      it =>
        it[SortByFilesTypes.CREATED_DATETIME] &&
        !it[SortByFilesTypes.UPDATED_DATETIME]
    )
    .sort((a, b) =>
      compareTime(
        a[SortByFilesTypes.CREATED_DATETIME],
        b[SortByFilesTypes.CREATED_DATETIME]
      )
    );

  return [...updtedByArr, ...createdByArr];
};

export { sortByField, sortTitleByField, sortByTime };
