import React from 'react';
import styles from './style.module.scss';

const InfoCard = ({ icon, info }: any) => (
  <div className={styles['dashboard-card']}>
    {icon}
    <p className={styles['card-content']}>{info}</p>
  </div>
);

export default InfoCard;
