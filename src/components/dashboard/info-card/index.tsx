import React from 'react';
import styles from './style.module.scss';

const InfoCard = ({ icon, info }: any) => (
  <div className={styles.dashboardCard}>
    {icon}
    <p className={styles.cardContent}>{info}</p>
  </div>
);

export default InfoCard;
