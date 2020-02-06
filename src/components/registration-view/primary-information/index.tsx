import React from 'react';
import styles from '../styles.module.scss';

const PrimaryInformation = ({ data }: any) => (
  <div className={styles.section}>
    <div className={styles['section-first-row']}>
      <div className={styles['section-item']}>
        <span className={styles['section-title']}>Division</span>
        <p>{data.division}</p>
      </div>
      <div className={styles['section-item']}>
        <span className={styles['section-title']}>Open Date</span>
        <p>{data.openDate}</p>
      </div>
      <div className={styles['section-item']}>
        <span className={styles['section-title']}>Close Date</span>
        <p>{data.closeDate}</p>
      </div>
    </div>
    <div className={styles['section-second-row']}>
      <div className={styles['section-item']}>
        <span className={styles['section-title']}>Entry Fee</span>
        <p>{data.entryFee}</p>
      </div>
      <div className={styles['section-item']}>
        <span className={styles['section-title']}>Deposit Fee</span>
        <p>{data.depositFee}</p>
      </div>
      <div className={styles['section-item']}>
        <span className={styles['section-title']}>Early Bird Discount</span>
        <p>{data.earlyBirdDiscount}</p>
      </div>
      <div className={styles['section-item']}>
        <span className={styles['section-title']}>Discount End Date</span>
        <p>{data.discountEndDate || '—'}</p>
      </div>
    </div>
  </div>
);

export default PrimaryInformation;
