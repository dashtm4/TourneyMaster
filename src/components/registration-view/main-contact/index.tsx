import React from 'react';
import styles from '../styles.module.scss';

const MainContact = ({ data }: any) => (
  <div className={styles.section}>
    <div className={styles.maSectionFirstRow}>
      <div className={styles.sectionItem}>
        <span className={styles.sectionTitle}>First</span>
        <p>{data.first}</p>
      </div>
      <div className={styles.sectionItem}>
        <span className={styles.sectionTitle}>Last</span>
        <p>{data.last}</p>
      </div>
      <div className={styles.sectionItem}>
        <span className={styles.sectionTitle}>Role</span>
        <p>{data.role}</p>
        <span className={styles.tournamentStatus} />
      </div>
      <div className={styles.sectionItem}>
        <span className={styles.sectionTitle}>Email</span>
        <p>{data.email}</p>
      </div>
    </div>
    <div className={styles.maSectionSecondRow}>
      <div className={styles.sectionItem}>
        <span className={styles.sectionTitle}>Mobile Number</span>
        <p>{data.mobile}</p>
      </div>
      <div className={styles.sectionItem}>
        <span className={styles.sectionTitle}>Permission to Text</span>
        <p>{data.permissionToText}</p>
      </div>
    </div>
  </div>
);

export default MainContact;
