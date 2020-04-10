import { IEntity } from 'common/types';
import { EntryPoints } from 'common/enums';
import { IFacility, IDivision, ISchedule } from 'common/models';

const getSelectOptions = (entities: IEntity[], entryPoint: EntryPoints) => {
  switch (entryPoint) {
    case EntryPoints.FACILITIES: {
      const facilities = entities as IFacility[];

      return facilities.map(it => ({
        label: it.facilities_description,
        value: it.facilities_id,
      }));
    }
    case EntryPoints.DIVISIONS: {
      const divisions = entities as IDivision[];

      return divisions.map(it => ({
        label: it.long_name,
        value: it.division_id,
      }));
    }
    case EntryPoints.SCHEDULES: {
      const schedules = entities as ISchedule[];

      return schedules.map(it => ({
        label: it.schedule_name,
        value: it.schedule_id,
      }));
    }
  }
};

const getEntityByOption = (
  entities: IEntity[],
  activeOptionId: string,
  entryPoint: EntryPoints
) => {
  switch (entryPoint) {
    case EntryPoints.FACILITIES: {
      const facilities = entities as IFacility[];

      return facilities.find(it => it.facilities_id === activeOptionId);
    }
    case EntryPoints.DIVISIONS: {
      const divisions = entities as IDivision[];

      return divisions.find(it => it.division_id === activeOptionId);
    }
    case EntryPoints.SCHEDULES: {
      const schedules = entities as ISchedule[];

      return schedules.find(it => it.schedule_id === activeOptionId);
    }
  }
};

export { getSelectOptions, getEntityByOption };
