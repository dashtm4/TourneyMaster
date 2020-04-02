import { IMenuItem } from 'common/models';
import { RequiredMenuKeys, EventMenuTitles } from 'common/enums';

const getIncompleteMenuItems = (
  menuList: IMenuItem[],
  ignorList: EventMenuTitles[]
) => {
  const incompleteMenuItems = menuList.filter(
    item =>
      item.hasOwnProperty(RequiredMenuKeys.IS_COMPLETED) &&
      !item.isCompleted &&
      ignorList.every(ignore => item.title !== ignore)
  );

  return incompleteMenuItems;
};

export { getIncompleteMenuItems };
