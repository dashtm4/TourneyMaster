import React from 'react';
import { Link } from 'react-router-dom';
import { HashLink } from 'react-router-hash-link';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import {
  ExpansionPanelWrapped,
  ExpansionPanelSummaryWrapped,
  ExpansionPanelDetailsWrapper,
} from './expansion-panel-material';
import { ProgressBar } from 'components/common';
import { getIcon, stringToLink } from '../../../helpers';
import { Icons } from '../../../common/constants/icons';
import { IMenuItem } from 'common/models/menu-list';
import styles from './styles.module.scss';

const COMPLETED_ITEM_FILED = 'isCompleted';

const STYLES_MENUITEM_ICON = {
  marginRight: '10px',
};

const STYLES_MENUITEM_ICON_COLLAPSED = {
  marginRight: 0,
};

const STYLES_CHECK_CIRCLE_ICON = {
  width: '20px',
  height: '20px',
  fill: '#00CC47',
  marginLeft: '10px',
};

interface Props {
  list: IMenuItem[];
  eventId?: string;
  isAllowEdit: boolean;
  isDraft?: boolean;
}

const Menu = ({ isAllowEdit, isDraft, list, eventId }: Props) => {
  const [isCollapsed, onCollapse] = React.useState(false);
  const [isCollapsible, onSetCollapsibility] = React.useState(false);
  const [activeItem, setActiveItem] = React.useState(list[0].title);
  const [percentOfCompleted] = React.useState(() => {
    if (!isDraft) {
      return;
    }

    const completedItems = list.reduce(
      (acc, it) => ({
        shouldCompleted: it.hasOwnProperty(COMPLETED_ITEM_FILED)
          ? acc.shouldCompleted + 1
          : acc.shouldCompleted,
        completed:
          it.hasOwnProperty(COMPLETED_ITEM_FILED) && it.isCompleted
            ? acc.completed + 1
            : acc.completed,
      }),
      { shouldCompleted: 0, completed: 0 }
    );

    return Math.ceil(
      (completedItems.completed / completedItems.shouldCompleted) * 100
    );
  });

  return (
    <aside
      className={`${styles.dashboardMenu} ${
        isCollapsed ? styles.dashboardMenuCollapsed : ''
      } `}
      onMouseOver={() => {
        if (isCollapsible) {
          onCollapse(false);
        }
      }}
      onMouseOut={() => {
        if (isCollapsible) {
          onCollapse(true);
        }
      }}
    >
      <ul className={styles.list}>
        {list.map(menuItem => (
          <li className={styles.listItem} key={menuItem.title}>
            <ExpansionPanelWrapped
              disabled={!menuItem.isAllowEdit && !isAllowEdit}
            >
              <ExpansionPanelSummaryWrapped
                expandIcon={
                  menuItem.children.length !== 0 && !isCollapsed ? (
                    <ExpandMoreIcon />
                  ) : null
                }
              >
                {getIcon(
                  menuItem.icon,
                  isCollapsed
                    ? STYLES_MENUITEM_ICON_COLLAPSED
                    : STYLES_MENUITEM_ICON
                )}
                {!isCollapsed && (
                  <Link
                    className={`${styles.itemTitle} ${
                      activeItem === menuItem.title
                        ? styles.itemTitleActive
                        : ''
                    }`}
                    onClick={() => setActiveItem(menuItem.title)}
                    to={`${menuItem.link}/${eventId || ''}`}
                  >
                    {menuItem.title}
                    {!isCollapsed &&
                      isDraft &&
                      menuItem.isCompleted &&
                      getIcon(Icons.CHECK_CIRCLE, STYLES_CHECK_CIRCLE_ICON)}
                  </Link>
                )}
              </ExpansionPanelSummaryWrapped>
              {menuItem.children.length !== 0 && (
                <ExpansionPanelDetailsWrapper>
                  <ul className={styles.subList}>
                    {menuItem.children.map((menuSubItem: string) => (
                      <li className={styles.subListItem} key={menuSubItem}>
                        <HashLink
                          onClick={() => setActiveItem(menuItem.title)}
                          to={`${menuItem.link}/${eventId || ''}#${stringToLink(
                            menuSubItem
                          )}`}
                        >
                          {menuSubItem}
                        </HashLink>
                      </li>
                    ))}
                  </ul>
                </ExpansionPanelDetailsWrapper>
              )}
            </ExpansionPanelWrapped>
          </li>
        ))}
      </ul>
      {!isCollapsed && isDraft && (
        <div className={styles.progressBarWrapper}>
          <ProgressBar completed={percentOfCompleted} />
          <div className={styles.progressBarStatusWrapper}>
            <p className={styles.progressBarStatus}>
              <span>Status:</span> Draft
            </p>
            <p className={styles.progressBarComplete}>
              <output>{`${percentOfCompleted}%`}</output>
              Complete
            </p>
          </div>
        </div>
      )}
      <button
        className={styles.pinBtn}
        onClick={() => onSetCollapsibility(!isCollapsible)}
      >
        {getIcon(Icons.PIN)}
        {!isCollapsed && `${isCollapsible ? 'Pin' : 'Unpin'}  Menu`}
      </button>
    </aside>
  );
};

export default Menu;
