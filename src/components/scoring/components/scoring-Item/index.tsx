/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from 'react';
import moment from 'moment';
import SectionDropdown from '../../../common/section-dropdown';
import GroupItem from '../group-item';
import styles from './styles.module.scss';
import {
  IDisision,
  IPool,
  ITeam,
  BindingAction,
  BindingCbWithOne,
} from '../../../../common/models';

interface Props {
  division: IDisision;
  pools: IPool[];
  teams: ITeam[];
  loadPools: (divisionId: string) => void;
  loadTeams: BindingAction;
  onOpenTeamDetails: BindingCbWithOne<ITeam>;
}

const ScoringItem = ({
  division,
  pools,
  teams,
  loadPools,
  loadTeams,
  onOpenTeamDetails,
}: Props) => {
  useEffect(() => {
    loadPools(division.division_id);
  }, []);

  if (!division) {
    return null;
  }

  return (
    <li>
      <SectionDropdown isDefaultExpanded={true} headingColor={'#1C315F'}>
        <span>
          {division.short_name} ({division.long_name})
        </span>
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
            {pools.map(it => (
              <GroupItem
                pool={it}
                teams={teams}
                loadTeams={loadTeams}
                onOpenTeamDetails={onOpenTeamDetails}
                key={it.pool_id}
              />
            ))}
          </ul>
        </div>
      </SectionDropdown>
    </li>
  );
};

export default ScoringItem;