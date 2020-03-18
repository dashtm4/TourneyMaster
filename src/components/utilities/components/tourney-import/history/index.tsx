import React from 'react';
import { HeadingLevelThree, SectionDropdown } from 'components/common';
import { MenuTitles } from 'common/enums';
import styles from './styles.module.scss';

const History = () => {
  return (
    <SectionDropdown
      id={MenuTitles.TOURNEY_HISTORY_TITLE}
      type="section"
      panelDetailsType="flat"
      isDefaultExpanded={true}
    >
      <HeadingLevelThree>
        <span className={styles.detailsSubtitle}>{MenuTitles.TOURNEY_HISTORY_TITLE}</span>
      </HeadingLevelThree>
      <div>Historical Imorts Table</div>
    </SectionDropdown>
  )
};

export default History;