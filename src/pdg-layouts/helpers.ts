import { IField } from 'common/models/schedule/fields';
import { IScheduleFacility } from 'common/models/schedule/facilities';
import { IGame } from 'components/common/matrix-table/helper';

const getFieldsByFacilityId = (fields: IField[], facility: IScheduleFacility) =>
  fields.filter(field => field.facilityId === facility.id);

const getGamesByFieldId = (games: IGame[], field: IField) =>
  games.filter(game => game.fieldId === field.id);

const getGamesByDays = (games: IGame[]) => {
  const gamesByDays = games.reduce((acc, game) => {
    const day = game.gameDate;

    acc[day!] = acc[day!] ? [...acc[day!], game] : [game];

    return acc;
  }, {});

  return gamesByDays;
};

export { getFieldsByFacilityId, getGamesByFieldId, getGamesByDays };
