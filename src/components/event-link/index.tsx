import React, { useState } from 'react';
import { HeadingLevelTwo, Button } from 'components/common';
import styles from './styles.module.scss';
import Navigation from './navigation';
import Messaging from './messaging';
import ScheduleReview from './schedule-review';

const EventLink = () => {
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
        <Messaging isSectionExpand={isSectionsExpand} />
        <ScheduleReview isSectionExpand={isSectionsExpand} />
      </ul>
    </section>
  );
};

export default EventLink;
