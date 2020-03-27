import React, { useEffect } from 'react';
import TournamentStatus from './components/tournament-status';
import MenuItem from './components/menu-item';
import { getIcon, countCompletedPercent } from 'helpers';
import { Icons } from 'common/enums/icons';
import { RequiredMenuKeys, EventStatuses, Routes } from 'common/enums';
import { IMenuItem } from 'common/models/menu-list';
import styles from './styles.module.scss';
import { useLocation } from 'react-router-dom';

enum MenuCollapsedTypes {
  PIN = 'Pin',
  UNPIN = 'Unpin',
}

interface Props {
  list: IMenuItem[];
  isAllowEdit: boolean;
  eventId?: string;
  tournamentStatus?: EventStatuses;
  changeTournamentStatus?: (status: EventStatuses) => void;
  eventName?: string;
  hideOnList?: Routes[];
}

const Menu = ({
  list,
  eventId,
  eventName,
  isAllowEdit,
  tournamentStatus,
  changeTournamentStatus,
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
      {!isCollapsed && eventName && (
        <b className={styles.eventTitle}>{eventName}</b>
      )}
      <ul className={styles.list}>
        {list.map(menuItem => (
          <MenuItem
            eventId={eventId}
            menuItem={menuItem}
            tournamentStatus={tournamentStatus}
            isAllowEdit={isAllowEdit}
            isCollapsed={isCollapsed}
            isActiveItem={activeItem === menuItem.title}
            setActiveItem={setActiveItem}
            key={menuItem.title}
          />
        ))}
      </ul>
      {!isCollapsed && tournamentStatus && (
        <TournamentStatus
          tournamentStatus={tournamentStatus}
          percentOfCompleted={percentOfCompleted}
          changeTournamentStatus={changeTournamentStatus}
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
