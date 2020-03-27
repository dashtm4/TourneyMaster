import { IField } from 'common/models';

const sortFields = (fields: IField[]) => {
  const isAllowSort = !fields.some(it => it.isNew || it.isChange);

  return isAllowSort
    ? fields.sort((a, b) => {
        return (
          Number(b.is_premier_YN) - Number(a.is_premier_YN) ||
          a.field_name.localeCompare(b.field_name, undefined, {
            numeric: true,
          })
        );
      })
    : fields;
};

export { sortFields };
