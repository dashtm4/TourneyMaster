/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import { SectionDropdown } from 'components/common';
import TeamItem from '../team-item';
import { sortTeamByScored } from 'helpers';
import {
  IPool,
  ITeamWithResults,
  IDivision,
  IEventDetails,
  ISchedulesGameWithNames,
} from 'common/models';
import styles from './styles.module.scss';

interface Props {
  event: IEventDetails | null;
  division: IDivision;
  pool: IPool;
  teams: ITeamWithResults[];
  games: ISchedulesGameWithNames[];
  onOpenTeamDetails: (
    team: ITeamWithResults,
    divisionName: string,
    poolName: string
  ) => void;
}

const GroupItem = ({
  event,
  division,
  pool,
  teams,
  games,
  onOpenTeamDetails,
}: Props) => {
  const sortedTeams = event?.ranking_factor_pools
    ? sortTeamByScored(teams, games, event.ranking_factor_pools)
    : teams;

  return (
    <li className={styles.groupItem}>
      <SectionDropdown isDefaultExpanded={true} headingColor={'#1C315F'}>
        <span>{pool.pool_name}</span>
        <table className={styles.groupTable}>
          <thead>
            <tr>
              <td>Team</td>
              <td>W</td>
              <td>L</td>
              <td>T</td>
              <td>GS</td>
              <td>GA</td>
              <td>GD</td>
            </tr>
          </thead>
          <tbody>
            {sortedTeams.map(it => (
              <TeamItem
                team={it}
                divisionName={division.long_name}
                poolName={pool.pool_name}
                key={it.team_id}
                onOpenTeamDetails={onOpenTeamDetails}
              />
            ))}
          </tbody>
        </table>
      </SectionDropdown>
    </li>
  );
};

export default GroupItem;
