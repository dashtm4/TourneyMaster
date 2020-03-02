import React from 'react';
import { Link } from 'react-router-dom';
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

interface Props {
  list: MenuItem[];
  eventId?: string;
  isAllowEdit: boolean;
}

interface State {
  isCollapsible: boolean;
  collapsed: boolean;
}

class Menu extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      isCollapsible: false,
      collapsed: false,
    };
  }

  onCollapse = () => {
    if (this.state.isCollapsible) {
      this.setState({ collapsed: !this.state.collapsed });
    }
  };

  onSetCollapsibility = () => {
    this.setState({ isCollapsible: !this.state.isCollapsible });
  };

  renderMenu() {
    const { isAllowEdit, list, eventId } = this.props;

    return (
      <aside className={styles.dashboardMenu} onMouseLeave={this.onCollapse}>
        <ul className={styles.list}>
          {list.map(menuItem => (
            <li className={styles.itemTitle} key={menuItem.title}>
              <ExpansionPanelWrapped
                disabled={!menuItem.isAllow && !isAllowEdit}
              >
                <ExpansionPanelSummaryWrapped
                  expandIcon={
                    menuItem.children.length !== 0 ? <ExpandMoreIcon /> : null
                  }
                >
                  {getIcon(menuItem.icon)}
                  <Link to={`${menuItem.link}/${eventId || ''}`}>
                    {menuItem.title}
                  </Link>
                </ExpansionPanelSummaryWrapped>
                {menuItem.children.length !== 0 && (
                  <ExpansionPanelDetailsWrapper>
                    <ul className={styles.subList}>
                      {menuItem.children.map((menuSubItem: string) => (
                        <li className={styles.subListItem} key={menuSubItem}>
                          <a href={`#${stringToLink(menuSubItem)}`}>
                            {menuSubItem}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </ExpansionPanelDetailsWrapper>
                )}
              </ExpansionPanelWrapped>
            </li>
          ))}
        </ul>
        <button className={styles.pinBtn} onClick={this.onSetCollapsibility}>
          {getIcon(Icons.PIN)}
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
