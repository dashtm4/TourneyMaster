import React from 'react';
import { Link } from 'react-router-dom';
import {
  ExpansionPanelWrapped,
  ExpansionPanelSummaryWrapped,
  ExpansionPanelDetailsWrapper,
} from './expansion-panel-material';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import PinIcon from './icons/icon-pin-material';
import { getIcon } from './icons';
import styles from './styles.module.scss';

interface MenuItem {
  title: string;
  icon: string;
  link: string;
  children: string[] | null;
}

interface Props {
  list: MenuItem[];
}

const Menu = ({ list }: Props) => (
  <aside className={styles.dashboardMenu}>
    <ul className={styles.list}>
      {list.map(menuItem =>
        menuItem.children ? (
          <li className={styles.itemTitle} key={menuItem.title}>
            <ExpansionPanelWrapped>
              <ExpansionPanelSummaryWrapped expandIcon={<ExpandMoreIcon />}>
                {getIcon(menuItem.icon)}
                <Link to={menuItem.link} className={styles.itemTitle}>
                  {menuItem.title}
                </Link>
              </ExpansionPanelSummaryWrapped>
              <ExpansionPanelDetailsWrapper>
                <ul className={styles.list}>
                  {menuItem.children.map(menuSubItem => (
                    <li className={styles.itemSubTitle} key={menuSubItem}>
                      <Link to={menuSubItem} className={styles.itemTitle}>
                        {menuSubItem}
                      </Link>
                    </li>
                  ))}
                </ul>
              </ExpansionPanelDetailsWrapper>
            </ExpansionPanelWrapped>
          </li>
        ) : (
          <li
            className={`${styles.itemTitle} ${styles.itemTitleAlone}`}
            key={menuItem.title}
          >
            {getIcon(menuItem.icon)}
            <Link to={menuItem.link}>{menuItem.title}</Link>
          </li>
        )
      )}
    </ul>
    <button className={styles.pinBtn}>
      <PinIcon />
      Unpin Menu
    </button>
  </aside>
);

export default Menu;
