import React from 'react';
import styles from '../styles.module.scss';

const PrimaryInformation = ({ data }: any) => (
  <div className={styles.section}>
    <div className={styles.sectionFirstRow}>
      <div className={styles.sectionItem}>
        <span className={styles.sectionTitle}>Division</span>
        <p>{data.division}</p>
      </div>
      <div className={styles.sectionItem}>
        <span className={styles.sectionTitle}>Open Date</span>
        <p>{data.openDate}</p>
      </div>
      <div className={styles.sectionItem}>
        <span className={styles.sectionTitle}>Close Date</span>
        <p>{data.closeDate}</p>
      </div>
    </div>
    <div className={styles.sectionSecondRow}>
      <div className={styles.sectionItem}>
        <span className={styles.sectionTitle}>Entry Fee</span>
        <p>{data.entryFee}</p>
      </div>
      <div className={styles.sectionItem}>
        <span className={styles.sectionTitle}>Deposit Fee</span>
        <p>{data.depositFee}</p>
      </div>
      <div className={styles.sectionItem}>
        <span className={styles.sectionTitle}>Early Bird Discount</span>
        <p>{data.earlyBirdDiscount}</p>
      </div>
      <div className={styles.sectionItem}>
        <span className={styles.sectionTitle}>Discount End Date</span>
        <p>{data.discountEndDate || '—'}</p>
      </div>
    </div>
  </div>
);

export default PrimaryInformation;
