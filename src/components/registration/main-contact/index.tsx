import React from 'react';
import styles from '../styles.module.scss';
import { IRegistration } from 'common/models/registration';

const MainContact = ({ data }: { data: Partial<IRegistration> }) => (
  <div className={styles.section}>
    <div className={styles.maSectionFirstRow}>
      <div className={styles.sectionItem}>
        <span className={styles.sectionTitle}>First</span>
        <p>{data.reg_first_name || '—'}</p>
      </div>
      <div className={styles.sectionItem}>
        <span className={styles.sectionTitle}>Last</span>
        <p>{data.reg_last_name || '—'}</p>
      </div>
      <div className={styles.sectionItem}>
        <span className={styles.sectionTitle}>Role</span>
        <p>{data.role || '—'}</p>
        <span className={styles.tournamentStatus} />
      </div>
      <div className={styles.sectionItem}>
        <span className={styles.sectionTitle}>Email</span>
        <p>{data.email_address || '—'}</p>
      </div>
    </div>
    <div className={styles.maSectionSecondRow}>
      <div className={styles.sectionItem}>
        <span className={styles.sectionTitle}>Mobile Number</span>
        <p>{data.mobile_number || '—'}</p>
      </div>
      <div className={styles.sectionItem}>
        <span className={styles.sectionTitle}>Permission to Text</span>
        <p>{data.permission_to_text === 1 ? 'Allowed' : '—'}</p>
      </div>
    </div>
  </div>
);

export default MainContact;
