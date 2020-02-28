/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import { SectionDropdown, Loader } from '../../../common';
import TeamItem from '../team-item';
import styles from './styles.module.scss';
import { IPool, ITeam, BindingCbWithOne } from '../../../../common/models';

interface Props {
  pool: IPool;
  teams: ITeam[];
  loadTeams: (poolId: string) => void;
  onOpenTeamDetails: BindingCbWithOne<ITeam>;
}

const GroupItem = ({ pool, teams, loadTeams, onOpenTeamDetails }: Props) => {
  if (!pool.isTeamsLoading && !pool.isTeamsLoaded) {
    loadTeams(pool.pool_id);
  }

  if (pool.isTeamsLoading) {
    return <Loader />;
  }

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
              <td>GS</td>
              <td>GA</td>
            </tr>
          </thead>
          <tbody>
            {teams.map(it => (
              <TeamItem
                team={it}
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
