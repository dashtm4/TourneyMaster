export enum TableSortRowTypes {
  ID = 'id',
  TITLE = 'title',
  VERSION = 'version',
  LAST_MODIFIED = 'lastModified',
}

export enum OrderTypes {
  ASC = 'asc',
  DESC = 'desc',
}

export interface ITableSortRow {
  id: string;
  title: string;
  lastModified: string;
}

export interface HeadCell {
  id: TableSortRowTypes;
  label: string;
}
