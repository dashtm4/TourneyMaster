import React from 'react';
import { IPool, ITeam } from '../../../../common/models';

interface Props {
  pool: IPool;
  teams: ITeam[];
  loadTeams: (poolId: string) => void;
}

const PoolItem = ({ pool, teams, loadTeams }: Props) => {
  if (false) {
    loadTeams(pool.pool_id);
  }

  return (
    <li>
      <h5>{pool.pool_desc}</h5>
      <ul>
        {teams.map(it => (
          <li>{it.short_name}</li>
        ))}
      </ul>
    </li>
  );
};

export default PoolItem;
