import React from 'react';
import TeamItem from '../team-item';
import { IPool, ITeam, IDivision } from '../../../../common/models';
import styles from './styles.module.scss';
import { sortByField } from 'helpers';
import { SortByFilesTypes } from 'common/enums';

interface Props {
  pool?: IPool;
  teams: ITeam[];
  division: IDivision;
  onEditPopupOpen: (
    team: ITeam,
    divisionName: string,
    poolName: string
  ) => void;
}

const PoolItem = ({ pool, teams, division, onEditPopupOpen }: Props) => {
  const sortedTeams = sortByField(teams, SortByFilesTypes.TEAMS);

  return (
    <li className={styles.pool}>
      <h5 className={styles.poolTitle}>
        Pool:{' '}
        {pool ? (
          <>
            {pool.pool_name} <span>(Team Count: {teams.length})</span>
          </>
        ) : (
          'Unassigned'
        )}
      </h5>
      {teams.length !== 0 && (
        <table className={styles.teamsTable}>
          <thead>
            <tr>
              <th className={styles.teamName}>Team</th>
              <th>Coach Name</th>
              <th>Mobile # (printed on gameday reports)</th>
              <th className={styles.teamActions}>Actions</th>
              <th>Invite to Register</th>
            </tr>
          </thead>
          <tbody>
            {sortedTeams.map(it => (
              <TeamItem
                team={it}
                division={division}
                divisionName={division.long_name}
                poolName={pool?.pool_name}
                onEditPopupOpen={onEditPopupOpen}
                key={it.team_id}
              />
            ))}
          </tbody>
        </table>
      )}
    </li>
  );
};

export default PoolItem;
