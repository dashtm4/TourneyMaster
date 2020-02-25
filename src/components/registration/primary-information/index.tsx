import React from 'react';
import styles from '../styles.module.scss';
import moment from 'moment';
import { Link } from 'react-router-dom';
import { IRegistration } from 'common/models/registration';

interface IPrimaryInformationProps {
  data: Partial<IRegistration>;
  divisions: { name: string; id: string }[];
  eventId: string;
}

const PrimaryInformation = ({
  data,
  divisions,
  eventId,
}: IPrimaryInformationProps) => (
  <div className={styles.section}>
    <div className={styles.piSectionFirstRow}>
      <div className={styles.sectionItem}>
        <span className={styles.sectionTitle}>Division</span>
        <div>
          {divisions.map(division => (
            <Link
              to={`/event/divisions-and-pools/${eventId}`}
              key={division.id}
              className={styles.link}
            >
              <span className={styles.divisionLink}>{division.name}</span>
            </Link>
          ))}
        </div>
      </div>
      <div className={styles.sectionItem}>
        <span className={styles.sectionTitle}>Open Date</span>
        <p>
          {(data.registration_start &&
            moment(data.registration_start).format('MM-DD-YYYY')) ||
            '—'}
        </p>
      </div>
      <div className={styles.sectionItem}>
        <span className={styles.sectionTitle}>Close Date</span>
        <p>
          {(data.registration_end &&
            moment(data.registration_end).format('MM-DD-YYYY')) ||
            '—'}
        </p>
      </div>
    </div>
    <div className={styles.piSectionSecondRow}>
      <div className={styles.sectionItem}>
        <span className={styles.sectionTitle}>Entry Fee</span>
        <p>{data.entry_fee || '—'}</p>
      </div>
      <div className={styles.sectionItem}>
        <span className={styles.sectionTitle}>Deposit Fee</span>
        <p>{data.entry_deposit || '—'}</p>
      </div>
      <div className={styles.sectionItem}>
        <span className={styles.sectionTitle}>Early Bird Discount</span>
        <p>{data.early_bird_discount || '—'}</p>
      </div>
      <div className={styles.sectionItem}>
        <span className={styles.sectionTitle}>Discount End Date</span>
        <p>
          {(data.discount_enddate &&
            moment(data.discount_enddate).format('MM-DD-YYYY')) ||
            '—'}
        </p>
      </div>
    </div>
  </div>
);

export default PrimaryInformation;
