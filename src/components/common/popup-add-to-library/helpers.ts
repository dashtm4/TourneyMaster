import { IEntity } from 'common/types';
import { EntryPoints } from 'common/enums';
import { IFacility } from 'common/models';

const getSelectOptions = (entities: IEntity[], entryPoint: EntryPoints) => {
  switch (entryPoint) {
    case EntryPoints.FACILITIES: {
      const facilities = entities as IFacility[];

      return facilities.map(it => ({
        label: it.facilities_description,
        value: it.facilities_id,
      }));
    }
  }
};

export { getSelectOptions };
