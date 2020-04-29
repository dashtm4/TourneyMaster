/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from 'react';
import TournamentStatus from './components/tournament-status';
import MenuItem from './components/menu-item';
import { getIcon, countCompletedPercent } from 'helpers';
import { Icons } from 'common/enums/icons';
import { RequiredMenuKeys, Routes } from 'common/enums';
import { IMenuItem } from 'common/models/menu-list';
import styles from './styles.module.scss';
import { useLocation } from 'react-router-dom';
import { BindingAction, IEventDetails } from 'common/models';

enum MenuCollapsedTypes {
  PIN = 'Pin',
  UNPIN = 'Unpin',
}

interface Props {
  list: IMenuItem[];
  event?: IEventDetails;
  isAllowEdit: boolean;
  togglePublishPopup?: BindingAction;
  hideOnList?: Routes[];
}

const Menu = ({
  list,
  event,
  isAllowEdit,
  togglePublishPopup,
  hideOnList,
}: Props) => {
  const location = useLocation();
  const [hideDashboard, hideDashboardChange] = React.useState(false);
  const [isCollapsed, onCollapse] = React.useState(false);
  const [isCollapsible, onSetCollapsibility] = React.useState(false);
  const [activeItem, setActiveItem] = React.useState(list[0].title);
  const percentOfCompleted = countCompletedPercent(
    list,
    RequiredMenuKeys.IS_COMPLETED
  );

  useEffect(() => {
    const value = !!hideOnList?.filter(el => location?.pathname.includes(el))
      ?.length;
    hideDashboardChange(value);
  }, [location]);

  return (
    <aside
      className={`${styles.dashboardMenu} ${
        hideDashboard ? styles.dashboardHidden : ''
      } ${isCollapsed ? styles.dashboardMenuCollapsed : ''} `}
      onMouseEnter={() => isCollapsible && onCollapse(false)}
      onMouseLeave={() => isCollapsible && onCollapse(true)}
    >
      {!isCollapsed && event && (
        <b className={styles.eventTitle}>{event.event_name}</b>
      )}
      <ul className={styles.list}>
        {list.map(menuItem => (
          <MenuItem
            eventId={event?.event_id}
            menuItem={menuItem}
            isAllowEdit={isAllowEdit}
            isCollapsed={isCollapsed}
            isActiveItem={activeItem === menuItem.title}
            setActiveItem={setActiveItem}
            key={menuItem.title}
          />
        ))}
      </ul>
      {!isCollapsed && event && togglePublishPopup && (
        <TournamentStatus
          tournamentStatus={event.is_published_YN}
          percentOfCompleted={percentOfCompleted}
          togglePublishPopup={togglePublishPopup}
        />
      )}
      <button
        className={styles.pinBtn}
        onClick={() => onSetCollapsibility(!isCollapsible)}
      >
        {getIcon(Icons.PIN)}
        {!isCollapsed &&
          `${
            isCollapsible ? MenuCollapsedTypes.PIN : MenuCollapsedTypes.UNPIN
          }  Menu`}
      </button>
    </aside>
  );
};

export default Menu;
