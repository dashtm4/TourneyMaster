import React from 'react';
import { SectionDropdown, Button } from 'components/common';
import DeleteIcon from '@material-ui/icons/Delete';
import styles from '../../styles.module.scss';

interface Props {
  isSectionExpand: boolean;
}

const messageData = {
  title: "Men's Spring Thaw: Weather Update",
  deliveryDate: '04/15/2020, 12:00PM',
  message:
    'The expected storms have been cleared and we plan to proceed as originally scheduled',
  recipients: 304,
  type: 'Push Notification',
};

const MessageItem = ({ isSectionExpand }: Props) => {
  return (
    <li>
      <SectionDropdown expanded={isSectionExpand}>
        <div className={styles.msTitleContainer}>
          <p className={styles.msTitle}>{messageData.title}</p>
          <p className={styles.msDeliveryDate}>
            Delivered {messageData.deliveryDate}
          </p>
        </div>
        <div className={styles.msContent}>
          <div>
            <p className={styles.msContentMessage}>
              <span className={styles.msContentTitle}>Message:</span>{' '}
              {messageData.message}
            </p>
            <div className={styles.msInfoWrapper}>
              <div className={styles.msInfoContent}>
                <p>
                  <span className={styles.msContentTitle}>Recipients:</span>{' '}
                  {messageData.recipients}
                </p>
                <p>
                  <span className={styles.msContentTitle}>Type:</span>{' '}
                  {messageData.type}
                </p>
              </div>
              <div>
                <Button
                  label="Delete"
                  variant="text"
                  color="secondary"
                  type="dangerLink"
                  icon={<DeleteIcon style={{ fill: '#FF0F19' }} />}
                  onClick={() => {}}
                />
                <Button
                  label="+ Add to Library"
                  variant="text"
                  color="secondary"
                  onClick={() => {}}
                />
              </div>
            </div>
          </div>
        </div>
      </SectionDropdown>
    </li>
  );
};

export default MessageItem;
