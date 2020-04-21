import React from 'react';
import { SectionDropdown, Button } from 'components/common';
import DeleteIcon from '@material-ui/icons/Delete';
import styles from '../../styles.module.scss';
import { IMessage } from 'common/models/event-link';
import { capitalize } from 'lodash';
import moment from 'moment';

interface IProps {
  isSectionExpand: boolean;
  message: IMessage;
  sendMessage: any;
}

const MessageItem = ({ isSectionExpand, message }: IProps) => {
  const onMessageSend = (e: React.MouseEvent) => {
    e.stopPropagation();
    // sendMessage(message);
  };
  return (
    <li>
      <SectionDropdown expanded={isSectionExpand}>
        <div className={styles.msTitleContainer}>
          <p className={styles.msTitle}>
            {capitalize(message.message_title) || message.message_type}
          </p>
          <p className={styles.msDeliveryDate}>
            {message.status === 1 || message.send_datetime ? (
              `Sent ${moment(message.send_datetime).format(
                'MM.DD.YYYY, HH:mm'
              )}`
            ) : (
              <Button
                label="Send"
                color="secondary"
                variant="text"
                onClick={onMessageSend}
              />
            )}
          </p>
        </div>
        <div className={styles.msContent}>
          <div>
            <p className={styles.msContentMessage}>
              <span className={styles.msContentTitle}>Message:</span>{' '}
              {message.message_body || message.message_type}
            </p>
            <div className={styles.msInfoWrapper}>
              <div className={styles.msInfoContent}>
                <p>
                  <span className={styles.msContentTitle}>Recipients:</span>{' '}
                  {JSON.parse(message.recipient_details).length}
                </p>
                <p>
                  <span className={styles.msContentTitle}>Type:</span>{' '}
                  {message.message_type}
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
