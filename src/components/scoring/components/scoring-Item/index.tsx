import React from 'react';
import SectionDropdown from '../../../common/section-dropdown';
import GroupItem from '../group-item';
import styles from './styles.module.scss';
import { BindingCbWithOne } from '../../../../common/models/callback';
import { ITeam } from '../../../../common/models/teams';

import { teams } from '../../mocks/teams';

interface Props {
  onOpenTeamDetails: BindingCbWithOne<ITeam>;
}

const ScoringItem = ({ onOpenTeamDetails }: Props) => (
  <li>
    <SectionDropdown isDefaultExpanded={true} headingColor={'#1C315F'}>
      <span>Men’s Spring Thaw (Division: 2020, 2021)</span>
      <div>
        <ul className={styles.statisticList}>
          <li>
            <b>Games Complete:</b> {`1`}/{`72`}
          </li>
          <li>
            <b>Dates: </b>
            {`02/08/20`} - {`02/09/20`}
          </li>
          <li>
            <b>Scores Recorded:</b> {`1`}
          </li>
          <li>
            <b>Last Web Publishing:</b> {`01/22/20`}, {`12:30:07 PM`}
          </li>
        </ul>
        <ul className={styles.groupList}>
          <GroupItem teams={teams} onOpenTeamDetails={onOpenTeamDetails} />
        </ul>
      </div>
    </SectionDropdown>
  </li>
);

export default ScoringItem;
