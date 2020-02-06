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

class Menu extends React.Component<Props> {
  state = { isCollapsible: false, collapsed: false };

  onCollapse = () => {
    if (this.state.isCollapsible) {
      this.setState({ collapsed: !this.state.collapsed });
    }
  };

  onSetCollapsibility = () => {
    this.setState({ isCollapsible: !this.state.isCollapsible });
  };

  renderMenu() {
    return (
      <aside className={styles.dashboardMenu} onMouseLeave={this.onCollapse}>
        <ul className={styles.list}>
          {this.props.list.map(menuItem =>
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
        <button className={styles.pinBtn} onClick={this.onSetCollapsibility}>
          <PinIcon />
          {this.state.isCollapsible ? 'Pin' : 'Unpin'} Menu
        </button>
      </aside>
    );
  }

  renderCollapsedMenu() {
    return (
      <aside className={styles.collapsedMenu} onMouseEnter={this.onCollapse}>
        <ul className={styles.list}>
          {this.props.list.map(menuItem => (
            <li
              className={`${styles.itemTitle} ${styles.itemTitleAlone}`}
              key={menuItem.title}
            >
              {getIcon(menuItem.icon)}
            </li>
          ))}
        </ul>
      </aside>
    );
  }

  render() {
    const { collapsed } = this.state;
    return <>{collapsed ? this.renderCollapsedMenu() : this.renderMenu()}</>;
  }
}

export default Menu;
