import React, { useState } from 'react';
import { SectionDropdown, Button } from 'components/common';
import { MenuTitles } from 'common/enums';
import MessageItem from './message-item';
import styles from '../styles.module.scss';

interface Props {
  isSectionExpand: boolean;
}
const Messaging = ({ isSectionExpand }: Props) => {
  const [areMessagesExpand, toggleMessagesExpand] = useState<boolean>(true);

  const onToggleMessagesCollapse = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleMessagesExpand(!areMessagesExpand);
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
            <MessageItem isSectionExpand={areMessagesExpand} />
            <MessageItem isSectionExpand={areMessagesExpand} />
          </ul>
          <div className={styles.msLoadeMoreBtnWrapper}>
            <Button
              onClick={() => {}}
              variant="text"
              color="secondary"
              label="Load More Messages"
            />
          </div>
        </div>
      </SectionDropdown>
    </li>
  );
};

export default Messaging;
