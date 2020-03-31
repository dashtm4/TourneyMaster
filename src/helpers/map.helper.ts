import { removeObjectFields } from 'helpers';
import { IEventDetails } from 'common/models';
import { EntryPoints, IRegistrationFields } from 'common/enums';
import { IEntity } from 'common/types';

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

const removeAuxiliaryFields = (entity: IEntity, entryPoint: EntryPoints) => {
  switch (entryPoint) {
    case EntryPoints.REGISTRATIONS: {
      return removeObjectFields(entity, Object.values(IRegistrationFields));
    }
  }
};

export { arrToMap, mapToArr, mapArrWithEventName, removeAuxiliaryFields };
