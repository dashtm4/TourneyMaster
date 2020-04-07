import React from 'react';
import moment from 'moment';
import { SectionDropdown, Loader } from 'components/common';
import GroupItem from '../group-item';
import styles from './styles.module.scss';
import {
  IDivision,
  IPool,
  ITeamWithResults,
  BindingCbWithOne,
} from 'common/models';

interface Props {
  division: IDivision;
  pools: IPool[];
  teams: ITeamWithResults[];
  loadPools: (divisionId: string) => void;
  onOpenTeamDetails: (
    team: ITeamWithResults,
    divisionName: string,
    poolName: string
  ) => void;
  expanded: boolean;
  onToggleOne: BindingCbWithOne<number>;
  index: number;
}

const ScoringItem = ({
  division,
  pools,
  teams,
  loadPools,
  onOpenTeamDetails,
  expanded,
  index,
  onToggleOne,
}: Props) => {
  if (!division.isPoolsLoading && !division.isPoolsLoaded) {
    loadPools(division.division_id);
  }

  if (division.isPoolsLoading) {
    return <Loader />;
  }

  const onSectionToggle = () => {
    onToggleOne(index);
  };

  return (
    <li>
      <SectionDropdown
        isDefaultExpanded={true}
        headingColor={'#1C315F'}
        expanded={expanded !== undefined && expanded}
        onToggle={onSectionToggle}
      >
        <span>{division.long_name}</span>
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
            {pools.map(pool => (
              <GroupItem
                division={division}
                pool={pool}
                teams={teams.filter(it => it.pool_id === pool.pool_id)}
                onOpenTeamDetails={onOpenTeamDetails}
                key={pool.pool_id}
              />
            ))}
          </ul>
        </div>
      </SectionDropdown>
    </li>
  );
};

export default ScoringItem;
