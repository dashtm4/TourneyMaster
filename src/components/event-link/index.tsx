import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { HeadingLevelTwo, Button } from 'components/common';
import styles from './styles.module.scss';
import Navigation from './navigation';
import Messaging from './messaging';
import ScheduleReview from './schedule-review';
import { getMessages, sendSavedMessage } from './logic/actions';
import { BindingAction, BindingCbWithOne } from 'common/models';
import { IMessage } from 'common/models/event-link';

interface IProps {
  getMessages: BindingAction;
  sendSavedMessage: BindingCbWithOne<any>;
  messages: IMessage[];
  messagesAreLoading: boolean;
}

const EventLink = ({
  getMessages,
  messages,
  messagesAreLoading,
  sendSavedMessage,
}: IProps) => {
  useEffect(() => {
    getMessages();
  }, []);

  const [isSectionsExpand, toggleSectionCollapse] = useState<boolean>(true);

  const onToggleSectionCollapse = () => {
    toggleSectionCollapse(!isSectionsExpand);
  };

  return (
    <section className={styles.container}>
      <Navigation onAddToLibraryManager={() => {}} />
      <div className={styles.headingContainer}>
        <HeadingLevelTwo margin="24px 0">Event Link</HeadingLevelTwo>
        <Button
          onClick={onToggleSectionCollapse}
          variant="text"
          color="secondary"
          label={isSectionsExpand ? 'Collapse All' : 'Expand All'}
        />
      </div>
      <ul className={styles.libraryList}>
        <Messaging
          isSectionExpand={isSectionsExpand}
          data={messages}
          messagesAreLoading={messagesAreLoading}
          sendMessage={sendSavedMessage}
        />
        <ScheduleReview isSectionExpand={isSectionsExpand} />
      </ul>
    </section>
  );
};

const mapStateToProps = (state: any) => {
  return {
    messages: state.eventLink.messages,
    messagesAreLoading: state.eventLink.messagesAreLoading,
  };
};

const mapDispatchToProps = {
  getMessages,
  sendSavedMessage,
};

export default connect(mapStateToProps, mapDispatchToProps)(EventLink);
