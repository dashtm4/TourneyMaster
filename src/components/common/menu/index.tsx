import React from 'react';
import { Link } from 'react-router-dom';
import { HashLink } from 'react-router-hash-link';
import {
  ExpansionPanelWrapped,
  ExpansionPanelSummaryWrapped,
  ExpansionPanelDetailsWrapper,
} from './expansion-panel-material';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { getIcon, stringToLink } from '../../../helpers';
import { Icons } from '../../../common/constants/icons';
import { MenuItem } from 'common/models/menu-list';
import styles from './styles.module.scss';

const STYLES_MENUITEM_ICON = {
  marginRight: 0,
};

interface Props {
  list: MenuItem[];
  eventId?: string;
  isAllowEdit: boolean;
}

const Menu = ({ isAllowEdit, list, eventId }: Props) => {
  const [isCollapsed, onCollapse] = React.useState(false);
  const [isCollapsible, onSetCollapsibility] = React.useState(false);
  const [activeItem, setActiveItem] = React.useState(list[0].title);

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
          <li className={styles.itemTitle} key={menuItem.title}>
            <ExpansionPanelWrapped disabled={!menuItem.isAllow && !isAllowEdit}>
              <ExpansionPanelSummaryWrapped
                expandIcon={
                  menuItem.children.length !== 0 && !isCollapsed ? (
                    <ExpandMoreIcon />
                  ) : null
                }
              >
                {getIcon(
                  menuItem.icon,
                  isCollapsed ? STYLES_MENUITEM_ICON : undefined
                )}
                {!isCollapsed && (
                  <Link
                    className={
                      activeItem === menuItem.title
                        ? styles.activeItemTitle
                        : ''
                    }
                    onClick={() => setActiveItem(menuItem.title)}
                    to={`${menuItem.link}/${eventId || ''}`}
                  >
                    {menuItem.title}
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
