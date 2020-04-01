import { IMenuItem } from 'common/models';
import { RequiredMenuKeys, EventMenuTitles } from 'common/enums';

const getIncompleteMenuItems = (
  menuList: IMenuItem[],
  ignore: EventMenuTitles
) => {
  const incompleteMenuItems = menuList.filter(
    it =>
      it.hasOwnProperty(RequiredMenuKeys.IS_COMPLETED) &&
      !it.isCompleted &&
      it.title !== ignore
  );

  return incompleteMenuItems;
};

export { getIncompleteMenuItems };
