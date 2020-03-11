export enum TableColNames {
  TITLE = 'title',
  VERSION = 'version',
  LAST_MODIFIED = 'lastModified',
}

export enum OrderTypes {
  ASC = 'asc',
  DESC = 'desc',
}

export interface Data {
  title: string;
  version: string;
  lastModified: string;
}

export interface HeadCell {
  id: keyof Data;
  label: string;
}
