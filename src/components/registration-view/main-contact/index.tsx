import React from 'react';
import styles from '../styles.module.scss';

const MainContact = ({ data }: any) => (
  <div className={styles.section}>
    <div className={styles['section-first-row']}>
      <div className={styles['section-item']}>
        <span className={styles['section-title']}>First</span>
        <p>{data.first}</p>
      </div>
      <div className={styles['section-item']}>
        <span className={styles['section-title']}>Last</span>
        <p>{data.last}</p>
      </div>
      <div className={styles['section-item']}>
        <span className={styles['section-title']}>Role</span>
        <p>{data.role}</p>
        <span className={styles['tournament-status']} />
      </div>
      <div className={styles['section-item']}>
        <span className={styles['section-title']}>Email</span>
        <p>{data.email}</p>
      </div>
    </div>
    <div className={styles['section-second-row']}>
      <div className={styles['section-item']}>
        <span className={styles['section-title']}>Mobile Number</span>
        <p>{data.mobile}</p>
      </div>
      <div className={styles['section-item']}>
        <span className={styles['section-title']}>Permission to Text</span>
        <p>{data.permissionToText}</p>
      </div>
    </div>
  </div>
);

export default MainContact;
