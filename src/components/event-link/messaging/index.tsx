import React, { useState } from 'react';
import { SectionDropdown, Button, Loader } from 'components/common';
import { MenuTitles } from 'common/enums';
import MessageItem from './message-item';
import styles from '../styles.module.scss';
import { IMessage } from 'common/models/event-link';
import { BindingCbWithOne } from 'common/models';

interface Props {
  isSectionExpand: boolean;
  data: IMessage[];
  messagesAreLoading: boolean;
  sendMessage: BindingCbWithOne<IMessage>;
}
const Messaging = ({
  isSectionExpand,
  data,
  messagesAreLoading,
  sendMessage,
}: Props) => {
  const [areMessagesExpand, toggleMessagesExpand] = useState<boolean>(true);
  const [currentMessages, setCurrentMessages] = useState<number>(2);

  const onToggleMessagesCollapse = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleMessagesExpand(!areMessagesExpand);
  };

  const onLoadMoreClick = () => {
    setCurrentMessages(currentMessages + 2);
  };

  return (
    <li>
      <SectionDropdown
        id={MenuTitles.MESSAGING}
        type="section"
        panelDetailsType="flat"
        expanded={isSectionExpand}
      >
        <div className={styles.msHeadingContainer}>
          Messaging
          <Button
            onClick={onToggleMessagesCollapse}
            variant="text"
            color="secondary"
            label={areMessagesExpand ? 'Collapse All' : 'Expand All'}
          />
        </div>
        <div className={styles.msContainer}>
          <ul className={styles.msMessageList}>
            {messagesAreLoading && <Loader />}
            {!messagesAreLoading && data.length
              ? data
                  .slice(0, currentMessages)
                  .map(message => (
                    <MessageItem
                      key={message.message_id}
                      isSectionExpand={areMessagesExpand}
                      message={message}
                      sendMessage={sendMessage}
                    />
                  ))
              : !messagesAreLoading && <div>No messages</div>}
          </ul>
          {!messagesAreLoading && data.length > currentMessages && (
            <div className={styles.msLoadeMoreBtnWrapper}>
              <Button
                onClick={onLoadMoreClick}
                variant="text"
                color="secondary"
                label="Load More Messages"
              />
            </div>
          )}
        </div>
      </SectionDropdown>
    </li>
  );
};

export default Messaging;
