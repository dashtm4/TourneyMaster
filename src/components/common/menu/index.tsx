import React from 'react';
import { Link } from 'react-router-dom';
import { HashLink } from 'react-router-hash-link';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import {
  ExpansionPanelWrapped,
  ExpansionPanelSummaryWrapped,
  ExpansionPanelDetailsWrapper,
} from './expansion-panel-material';
import { ProgressBar, Button } from 'components/common';
import { getIcon, stringToLink, countCompletedPercent } from 'helpers';
import { Icons } from 'common/constants/icons';
import { ButtonColors, ButtonVarian } from 'common/enums';
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
  publishTournament?: (eventId: string) => void;
}

const Menu = ({
  isAllowEdit,
  isDraft,
  list,
  eventId,
  publishTournament,
}: Props) => {
  const [isCollapsed, onCollapse] = React.useState(false);
  const [isCollapsible, onSetCollapsibility] = React.useState(false);
  const [activeItem, setActiveItem] = React.useState(list[0].title);
  const percentOfCompleted = isDraft
    ? countCompletedPercent(list, COMPLETED_ITEM_FILED)
    : null;

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
          {percentOfCompleted === 100 ? (
            <span className={styles.doneBtnWrapper}>
              <Button
                onClick={() => {
                  if (eventId) {
                    publishTournament(eventId);
                  }
                }}
                icon={getIcon(Icons.DONE)}
                label="Publish Tournament"
                color={ButtonColors.INHERIT}
                variant={ButtonVarian.CONTAINED}
              />
            </span>
          ) : (
            <>
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
            </>
          )}
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
