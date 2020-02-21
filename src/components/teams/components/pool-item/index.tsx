import React from 'react';
import { useDrop } from 'react-dnd';
import TeamItem from '../team-item';
import { IPool, ITeam } from '../../../../common/models';
import { DndItems } from '../../types';
import styles from './styles.module.scss';

interface Props {
  pool?: IPool;
  teams: ITeam[];
  divisionId: string;
  isEdit: boolean;
  isUnassigned?: boolean;
  changePool: (team: ITeam, poolId: string | null) => void;
}

const PoolItem = ({
  pool,
  teams,
  divisionId,
  isUnassigned,
  isEdit,
  changePool,
}: Props) => {
  const [{}, drop] = useDrop({
    accept: DndItems.TEAM,
    drop: () => ({
      divisionId: divisionId,
      poolId: pool ? pool.pool_id : null,
    }),
  });

  return (
    <li className={styles.pool}>
      <h5 className={styles.poolTitle}>
        {isUnassigned ? 'Unassigned' : pool?.pool_desc} ({teams.length})
      </h5>
      <ul ref={drop} className={styles.teamList}>
        {teams.map(it => (
          <TeamItem
            team={it}
            isEdit={isEdit}
            changePool={changePool}
            key={it.team_id}
          />
        ))}
      </ul>
    </li>
  );
};

export default PoolItem;
