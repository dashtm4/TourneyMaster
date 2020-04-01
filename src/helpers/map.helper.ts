import { removeObjectFields } from 'helpers';
import { IEventDetails } from 'common/models';
import { EntryPoints, IRegistrationFields } from 'common/enums';
import { IEntity } from 'common/types';
import { IGame } from 'components/common/matrix-table/helper';
import { IField } from 'common/models/schedule/fields';

const arrToMap = <T>(arr: T[], field: string): Object => {
  return arr.reduce((acc, item) => {
    acc[item[field]] = item;

    return acc;
  }, {});
};

const mapToArr = <T>(obj: Object, field: string): Array<T> => {
  return Object.keys(obj).map(obj => obj[field]);
};

const mapArrWithEventName = <T extends IEntity>(
  arr: T[],
  events: IEventDetails[]
): T[] =>
  arr.map(it => {
    const currentEvent = events.find(event => event.event_id === it.event_id);

    return { ...it, eventName: currentEvent?.event_name };
  });

const mapGamesByField = (games: IGame[], fields: IField[]) =>
  games.map(game => {
    const currentField = fields.find(field => field.id === game.fieldId);

    return { ...game, facilityId: currentField?.facilityId };
  });

const removeAuxiliaryFields = (entity: IEntity, entryPoint: EntryPoints) => {
  switch (entryPoint) {
    case EntryPoints.REGISTRATIONS: {
      return removeObjectFields(entity, Object.values(IRegistrationFields));
    }
  }
};

export {
  arrToMap,
  mapToArr,
  mapArrWithEventName,
  removeAuxiliaryFields,
  mapGamesByField,
};
