import React from 'react';
import { HeadingLevelThree, SectionDropdown } from 'components/common';
import { MenuTitles } from 'common/enums';
import HistoryTable from './history-table';
import styles from './styles.module.scss';
import Api from 'api/api';

const History = () => {
  const [histories, setHistories] = React.useState<any[]>([]);

  React.useEffect(() => {
    getHistory();
  }, []);

  function getHistory() {
    Api.get('/ext_load_summary')
      .then(res => {
        setHistories(res);
      })
  }

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

      <HistoryTable histories={histories} />
    </SectionDropdown>
  )
};

export default History;