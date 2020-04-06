import { IColumnDetails, IField } from 'common/models/table-columns';
import { getVarcharEight } from 'helpers';

export const parseTableDetails = (tableDetails: string): IColumnDetails[] => {
  return JSON.parse(`[${tableDetails}]`).flat();
};

export const getPreview = (
  data: string[][],
  isHeaderIncluded: boolean,
  headerPosition: number
) => {
  if (isHeaderIncluded) {
    return {
      header: data[headerPosition - 1],
      row: data[headerPosition],
    };
  } else {
    return { header: data[0].map((_f: string) => '—'), row: data[0] };
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
      return field.mapId;
    } else {
      return '';
    }
  });
};

export const parseMapping = (mapping: string, tableDetails: string) => {
  const parsedTableDetails = parseTableDetails(tableDetails);
  const fields = parsedTableDetails.map((column, index: number) => ({
    value: column.column_name,
    csvPosition: index,
    dataType: column.data_type,
    included: true,
    mapId: column.map_id,
  }));

  const parsedMapping = JSON.parse(mapping);
  const newFields = fields.map((field, index) => {
    if (parsedMapping[index]) {
      const obj = fields.find(f => f.mapId === parsedMapping[index]);
      return { ...field, value: obj!.value, mapId: obj!.mapId };
    } else {
      return { ...field, value: '', mapId: '', dataType: '', included: false };
    }
  });

  return newFields;
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
      return {
        event_id: getVarcharEight(),
      };
    case 'divisions':
      return {
        division_id: getVarcharEight(),
        event_id: eventId,
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
    if (data[item.csvPosition] && item.included) {
      Object.assign(obj, {
        [item.value]: data[item.csvPosition],
      });
    }
    return obj;
  }, baseObj);
};

export const checkCsvForValidity = (
  data: string[],
  headerIncluded: boolean,
  headerPosition: number,
  fields: IField[]
) => {
  if (headerIncluded && data.length <= headerPosition) {
    return false;
  }
  if (headerIncluded && data[headerPosition].length > fields.length) {
    return false;
  }
  if (!headerIncluded && data[0].length > fields.length) {
    return false;
  }
  return true;
};

export const getRequiredFields = (type: string) => {
  switch (type) {
    case 'event_master':
      return [
        'Sport ID',
        'Event Name',
        'Event Description',
        'Start Day',
        'End Day',
        'UTC Time Zone (+/-)',
        'Period Duration',
        'Time between Periods',
        'Periods/Game',
      ];
    case 'divisions':
      return ['Long Name', 'Short Name'];
    case 'facilities':
      return ['Facility Description'];
    default:
      return [];
  }
};
