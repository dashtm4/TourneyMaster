import React from 'react';
import Navigation from './components/navigation';
import ItemSchedules from './components/item-schedules';
import { stringToLink } from 'helpers';
import { HeadingLevelTwo } from 'components/common';
import { EventMenuTitles } from 'common/enums';
import styles from './styles.module.scss';

const Reporting = () => (
  <section id={stringToLink(EventMenuTitles.REPORTING)}>
    <Navigation />
    <div className={styles.titleWrapper}>
      <HeadingLevelTwo>{EventMenuTitles.REPORTING}</HeadingLevelTwo>
    </div>
    <ul className={styles.reportingList}>
      <ItemSchedules />
    </ul>
  </section>
);

export default Reporting;
