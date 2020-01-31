import React from 'react';
import PersonIcon from '@material-ui/icons/Person';
import InsertDriveFileIcon from '@material-ui/icons/InsertDriveFile';
import styles from './styles.module.scss'

const DashboardMenu = () => (
  <section className={styles.dashboardMenu}>
    <h2 className={styles.itemTitle}>
      <PersonIcon />
      My Dashboard
    </h2>
    <ul className={styles.list}>
      <li className={styles.itemTitle}>
        <InsertDriveFileIcon />
        <a href="#">Library Manager</a>
      </li>
    </ul>
  </section>
)

export default DashboardMenu
