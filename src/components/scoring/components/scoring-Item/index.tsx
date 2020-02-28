import React from 'react';
import moment from 'moment';
import { SectionDropdown, Loader } from '../../../common';
import GroupItem from '../group-item';
import styles from './styles.module.scss';
import {
  IDivision,
  IPool,
  ITeam,
  BindingCbWithOne,
} from '../../../../common/models';

interface Props {
  division: IDivision;
  pools: IPool[];
  teams: ITeam[];
  loadPools: (divisionId: string) => void;
  loadTeams: (poolId: string) => void;
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
  if (!division.isPoolsLoading && !division.isPoolsLoaded) {
    loadPools(division.division_id);
  }

  if (division.isPoolsLoading) {
    return <Loader />;
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
