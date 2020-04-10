export enum TableSortRowTypes {
  ID = 'id',
  TITLE = 'title',
  LAST_MODIFIED = 'lastModified',
}

export enum OrderTypes {
  ASC = 'asc',
  DESC = 'desc',
}

export interface HeadCell {
  id: TableSortRowTypes;
  label: string;
}
