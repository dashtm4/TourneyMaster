import { IEventDetails, IRegistration } from 'common/models';

const arrToMap = <T>(arr: T[], field: string): Object => {
  return arr.reduce((acc, item) => {
    acc[item[field]] = item;

    return acc;
  }, {});
};

const mapToArr = <T>(obj: Object, field: string): Array<T> => {
  return Object.keys(obj).map(obj => obj[field]);
};

const mapArrWithEventName = <T extends IRegistration>(
  arr: T[],
  events: IEventDetails[]
): T[] =>
  arr.map(it => {
    const currentEvent = events.find(event => event.event_id === it.event_id);

    return { ...it, eventName: currentEvent?.event_name };
  });

export { arrToMap, mapToArr, mapArrWithEventName };
