import React from 'react';
import DashboardMenu from '../common/dashboard-menu';
import styles from './styles.module.scss';

const DashboardPage = () => (
  <div className={styles.wrapper}>
    <DashboardMenu />
  </div>
);

export default DashboardPage;
