import React from 'react';
import { IEventDetails, IRegistration } from 'common/models';
import { HeadingLevelTwo, Paper } from 'components/common';
import moment from 'moment';
import styles from '../styles.module.scss';

interface IProps {
  event: IEventDetails;
  eventRegistration: IRegistration;
}

const SideBar = ({ event, eventRegistration }: IProps) => {
  return (
    <div style={{ width: '90%' }}>
      <Paper>
        <div className={styles.headingWrapper}>
          <HeadingLevelTwo>
            {event.event_name || 'Event Registration'}
          </HeadingLevelTwo>
        </div>
        <span className={styles.sectionTitle}>Event Type:</span>
        <div className={styles.sideContentItem}>{event.event_type}</div>
        {event.primary_location_desc && (
          <>
            <span className={styles.sectionTitle}>Event Primary Location:</span>
            <div className={styles.sideContentItem}>
              {event.primary_location_desc}
            </div>
          </>
        )}
        <span className={styles.sectionTitle}>Event Dates:</span>
        <div className={styles.sideContentItem}>{`${moment(
          event.event_startdate
        ).format('LL')} - ${moment(event.event_enddate).format('LL')}`}</div>
        <span className={styles.sectionTitle}>Registration Dates:</span>
        <div className={styles.sideContentItem}>{`${moment(
          eventRegistration.registration_start
        ).format('LL')} - ${moment(eventRegistration.registration_end).format(
          'LL'
        )}`}</div>
        {eventRegistration.entry_fee && (
          <>
            <span className={styles.sectionTitle}>Entry Fee:</span>
            <div className={styles.sideContentItem}>
              {`${eventRegistration.entry_fee} ${eventRegistration.currency ||
                ''}`}
            </div>
          </>
        )}
                {eventRegistration.entry_fee && (
          <>
            <span className={styles.sectionTitle}>Sales Tax:</span>
            <div className={styles.sideContentItem}>
              {`${eventRegistration. sales_tax_rate}%`}
            </div>
          </>
        )}
        {eventRegistration.upcharge_fee && (
          <>
            <span className={styles.sectionTitle}>Upcharge Fee:</span>
            <div className={styles.sideContentItem}>
              {`${eventRegistration.upcharge_fee}%`}
            </div>
          </>
        )}
      </Paper>
    </div>
  );
};

export default SideBar;
