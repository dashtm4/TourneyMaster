import React from 'react';
import { Link } from 'react-router-dom';
import { getIcon } from 'helpers';
import { Icons, EventMenuTitles } from 'common/enums';
import { IMenuItem } from 'common/models';
import styles from './styles.module.scss';

const STYLES_WARNING_ICON = {
  marginRight: '10px',
  fill: '#FFCB00',
};

const STYLES_MENU_ITEM = {
  width: '24px',
  height: '24px',
  marginRight: '10px',
  fill: '#3a3a3a',
};

const IncompleteItemDesc = {
  [EventMenuTitles.EVENT_DETAILS]: 'It is impossible.',
  [EventMenuTitles.FACILITIES]: 'Descriptions',
  [EventMenuTitles.REGISTRATION]: 'Descriptions',
  [EventMenuTitles.DIVISIONS_AND_POOLS]: 'Descriptions',
  [EventMenuTitles.TEAMS]: 'Descriptions',
};

interface Props {
  incompleteMenuItems: IMenuItem[];
}

const HazardList = ({ incompleteMenuItems }: Props) => {
  return (
    <section className={styles.wrapper}>
      <h3 className={styles.hazardTitle}>
        {getIcon(Icons.WARNING, STYLES_WARNING_ICON)} You need to fill in
        everything to create a schedule.
      </h3>
      <dl className={styles.hazardList}>
        {incompleteMenuItems.map(it => (
          <React.Fragment key={it.title}>
            <dt>
              <Link to={it.link}>{it.title}</Link>
            </dt>
            <dd>
              {getIcon(it.icon, STYLES_MENU_ITEM)}
              {IncompleteItemDesc[it.title]}
            </dd>
          </React.Fragment>
        ))}
      </dl>
    </section>
  );
};

export default HazardList;
