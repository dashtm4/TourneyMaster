import React from 'react';
import moment from 'moment';
import { SectionDropdown, Loader } from 'components/common';
import GroupItem from '../group-item';
import styles from './styles.module.scss';
import {
  IDivision,
  IPool,
  ITeamWithResults,
  IEventDetails,
  ISchedulesGameWithNames,
} from 'common/models';

interface Props {
  event: IEventDetails | null;
  division: IDivision;
  pools: IPool[];
  teams: ITeamWithResults[];
  games: ISchedulesGameWithNames[];
  loadPools: (divisionId: string) => void;
  onOpenTeamDetails: (
    team: ITeamWithResults,
    divisionName: string,
    poolName: string
  ) => void;
  isSectionExpand: boolean;
}

const ScoringItem = ({
  division,
  pools,
  teams,
  event,
  games,
  loadPools,
  onOpenTeamDetails,
  isSectionExpand,
}: Props) => {
  if (!division.isPoolsLoading && !division.isPoolsLoaded) {
    loadPools(division.division_id);
  }

  if (division.isPoolsLoading) {
    return <Loader />;
  }

  const completedGames = games.filter(
    it => it.awayTeamScore !== null || it.homeTeamScore !== null
  );

  const lastUpd = Math.max(
    ...games.map(it =>
      it.updatedTime ? +new Date(it.updatedTime) : +new Date(it.createTime)
    )
  );

  return (
    <li>
      <SectionDropdown headingColor={'#1C315F'} expanded={isSectionExpand}>
        <span>{division.long_name}</span>
        <div>
          <ul className={styles.statisticList}>
            <li>
              <b>Games Complete:</b> {completedGames.length}/{games.length}
            </li>
            <li>
              <b>Last Web Publishing: </b>
              <time dateTime={new Date(lastUpd).toString()}>
                {lastUpd
                  ? moment(lastUpd).format('LLLL')
                  : 'No scores published'}
              </time>
            </li>
          </ul>
          <ul className={styles.groupList}>
            {pools.map(pool => (
              <GroupItem
                event={event}
                division={division}
                pool={pool}
                teams={teams.filter(it => it.pool_id === pool.pool_id)}
                games={games}
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
