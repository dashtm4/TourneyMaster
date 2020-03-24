import { IField } from 'common/models/schedule/fields';
import { IScheduleFacility } from 'common/models/schedule/facilities';
import { IGame } from 'components/common/matrix-table/helper';

const getFieldsByFacilityId = (fields: IField[], facility: IScheduleFacility) =>
  fields.filter(field => field.facilityId === facility.id);

const getGamesByFieldId = (games: IGame[], field: IField) =>
  games.filter(game => game.fieldId === field.id);

export { getFieldsByFacilityId, getGamesByFieldId };
