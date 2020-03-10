import React from 'react';
import styles from './styles.module.scss';
import { format } from 'date-fns';
import { capitalize } from 'lodash-es';

interface IConfirmModalProps {
  clickedEvent: any;
}
const InfoModal = ({ clickedEvent }: IConfirmModalProps) => {
  console.log(clickedEvent);

  return (
    <div className={styles.container}>
      <div className={styles.sectionTitle}>{`${capitalize(
        clickedEvent.type
      )} Details`}</div>

      <div className={styles.sectionItem}>
        <span className={styles.title}>Title:</span> {clickedEvent.title || '—'}
      </div>
      <div className={styles.sectionItem}>
        <span className={styles.title}>Type:</span> {clickedEvent.type || '—'}
      </div>
      {clickedEvent.type === 'event' ? (
        <div className={styles.sectionItem}>
          <span className={styles.title}>Date:</span>{' '}
          {`${format(clickedEvent.start, 'MM-dd-yyyy')} - ${format(
            clickedEvent.end ? clickedEvent.end : clickedEvent.start,
            'MM-dd-yyyy'
          )}`}
        </div>
      ) : (
        <div className={styles.sectionItem}>
          <span className={styles.title}>Due date:</span>{' '}
          {format(clickedEvent.start, 'MM-dd-yyyy')}
        </div>
      )}
      <div className={styles.sectionItem}>
        <span className={styles.title}>Tag:</span> {clickedEvent.tag || '—'}
      </div>
      <div className={styles.sectionItem}>
        <span className={styles.title}>Description:</span>{' '}
        {clickedEvent.description || '—'}
      </div>
    </div>
  );
};

export default InfoModal;
