import React, { useEffect } from 'react';
import { IPool, ITeam } from '../../../../common/models';

interface Props {
  pool: IPool;
  teams: ITeam[];
  loadTeams: (poolId: string) => void;
}

const PoolItem = ({ pool, teams, loadTeams }: Props) => {
  useEffect(() => {
    loadTeams(pool.pool_id);
  }, []);

  if (!pool) {
    return null;
  }

  return (
    <li>
      <h5>{pool.pool_desc}</h5>
      <ul>
        {teams.map(it => (
          <li key={it.team_id}>{it.short_name}</li>
        ))}
      </ul>
    </li>
  );
};

export default PoolItem;
