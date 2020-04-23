import React from 'react';
import { Checkbox } from 'components/common';
import styles from '../styles.module.scss';
import moment from 'moment';
import { HashLink } from 'react-router-hash-link';
import { IRegistration } from 'common/models/registration';
import { stringToLink } from 'helpers';

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
          {divisions.map((division, index: number) => (
            <HashLink
              key={division.id}
              className={styles.link}
              to={`/event/divisions-and-pools/${eventId}#${stringToLink(
                division.name
              )}`}
            >
              <span>{`${division.name}${
                index === divisions.length - 1 ? '' : ', '
              }`}</span>
            </HashLink>
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
        <p>{data.entry_fee ? `$${data.entry_fee}` : '—'}</p>
      </div>
      <div className={styles.sectionItem}>
        <span className={styles.sectionTitle}>Deposit Fee</span>
        <p>{data.entry_deposit ? `$${data.entry_deposit}` : '—'}</p>
      </div>
      <div className={styles.sectionItem}>
        <span className={styles.sectionTitle}>Early Bird Discount</span>
        <p>{data.early_bird_discount ? `$${data.early_bird_discount}` : '—'}</p>
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
    <div className={styles.piSectionThirddRow}>
      <div>
        <Checkbox
          options={[
            {
              label: 'Upcharge Processing Fees',
              checked: Boolean(
                data ? data.upcharge_fees_on_registrations : false
              ),
              disabled: true,
            },
          ]}
        />
        <Checkbox
          options={[
            {
              label: 'Division Fees Vary',
              checked: Boolean(data ? data.fees_vary_by_division_YN : false),
              disabled: true,
            },
          ]}
        />
      </div>
    </div>
  </div>
);

export default PrimaryInformation;
