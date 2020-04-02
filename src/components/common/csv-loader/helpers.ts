import { IColumnDetails, IField } from './index';
import { getVarcharEight } from 'helpers';

export const parseTableDetails = (tableDetails: string): IColumnDetails[] => {
  return JSON.parse(`[${tableDetails}]`).flat();
};

export const getPreviewFromResults = (
  results: string[][],
  isHeaderIncluded: boolean,
  headerPosition: number
) => {
  if (isHeaderIncluded) {
    return {
      headers: results[headerPosition - 1],
      row: results[headerPosition],
    };
  } else {
    return { headers: results[0].map((_res: string) => '—'), row: results[0] };
  }
};

export const getColumnOptions = (tableDetails: string) => {
  const parsedTableDetails = parseTableDetails(tableDetails);
  return parsedTableDetails.map((col: IColumnDetails) => ({
    label: col.column_display,
    value: col.column_name,
  }));
};

export const mapFieldForSaving = (fields: IField[]) => {
  return fields.map(field => {
    if (field.included) {
      return { [field.map_id]: field.csv_position };
    } else {
      return { [field.map_id]: '' };
    }
  });
};

export const parseMapping = (_fields: IField[], _mapping: string) => {
  const parsedMapping = JSON.parse(
    '[{"24":""},{"26":1},{"27":2},{"28":3},{"29":4},{"30":5},{"31":6},{"32":7},{"33":8},{"35":9},{"36":10},{"37":11},{"38":12},{"39":13},{"40":14},{"41":15},{"42":16},{"43":17},{"44":18},{"45":19},{"46":20},{"47":21},{"48":22},{"49":23},{"50":24},{"51":25},{"53":26},{"54":27},{"55":28},{"56":29},{"57":30},{"58":31},{"59":32},{"60":33},{"61":34},{"62":35},{"63":36},{"64":37},{"65":38},{"66":39},{"67":40},{"68":41},{"69":42},{"70":43},{"71":44},{"72":45},{"73":46}]'
  );
  console.log(parsedMapping);
};

const getBaseObj = (type: string, eventId?: string) => {
  switch (type) {
    case 'facilities':
      return {
        event_id: eventId,
        facilities_id: getVarcharEight(),
        isNew: true,
      };
    case 'event_master':
    case 'divisions':
      return {
        event_id: getVarcharEight(),
      };
    default:
      return {
        event_id: getVarcharEight(),
      };
  }
};

export const mapDataForSaving = (
  type: string,
  data: string[],
  fields: IField[],
  eventId?: string
) => {
  const baseObj = getBaseObj(type, eventId);

  return fields.reduce((obj, item) => {
    if (data[item.csv_position] && item.included) {
      Object.assign(obj, {
        [item.value]: data[item.csv_position],
      });
    }
    return obj;
  }, baseObj);
};

export const checkCsvForValidity = (
  results: string[],
  headerIncluded: boolean,
  headerPosition: number,
  fields: IField[]
) => {
  if (headerIncluded && results.length <= headerPosition) {
    return true;
  }
  if (headerIncluded && results[headerPosition].length > fields.length) {
    return true;
  }
  if (!headerIncluded && results[0].length > fields.length) {
    return true;
  }
  return false;
};
