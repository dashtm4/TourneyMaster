import React from 'react';
import moment from 'moment';
import SectionDropdown from '../../../common/section-dropdown';
import GroupItem from '../group-item';
import styles from './styles.module.scss';
import { IDisision, ITeam, BindingCbWithOne } from '../../../../common/models';

interface Props {
  division: IDisision | null;
  teams: ITeam[];
  onOpenTeamDetails: BindingCbWithOne<ITeam>;
}

const ScoringItem = ({ division, teams, onOpenTeamDetails }: Props) => {
  if (!division) {
    return null;
  }

  return (
    <li>
      <SectionDropdown isDefaultExpanded={true} headingColor={'#1C315F'}>
        <span>{division.long_name} (Division: 2020, 2021)</span>
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
              <b>Last Web Publishing: </b>
              <time dateTime={division.latest_web_publish}>
                {division.latest_web_publish
                  ? moment(division.latest_web_publish).format(
                      'YYYY-MM-DD, hh:mm:ss A'
                    )
                  : 'Last Web Publishing: No scores published'}
              </time>
            </li>
          </ul>
          <ul className={styles.groupList}>
            <GroupItem teams={teams} onOpenTeamDetails={onOpenTeamDetails} />
          </ul>
        </div>
      </SectionDropdown>
    </li>
  );
};

export default ScoringItem;
