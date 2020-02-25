import React from 'react';
import { useDrop } from 'react-dnd';
import TeamItem from '../team-item';
import { IPool, ITeam, IDisision } from '../../../../common/models';
import { DndItems } from '../../types';
import styles from './styles.module.scss';

interface Props {
  pool?: IPool;
  teams: ITeam[];
  division: IDisision;
  isEdit: boolean;
  isUnassigned?: boolean;
  changePool: (team: ITeam, poolId: string | null) => void;
  loadTeams: (poolId: string) => void;
  onDeletePopupOpen: (team: ITeam) => void;
  onEditPopupOpen: (
    team: ITeam,
    divisionName: string,
    poolName: string
  ) => void;
}

const PoolItem = ({
  pool,
  teams,
  division,
  isUnassigned,
  isEdit,
  changePool,
  loadTeams,
  onDeletePopupOpen,
  onEditPopupOpen,
}: Props) => {
  if (pool && !pool.isTeamsLoading && !pool.isTeamsLoaded) {
    loadTeams(pool.pool_id);
  }

  const [, drop] = useDrop({
    accept: DndItems.TEAM,
    drop: () => ({
      divisionId: division.division_id,
      poolId: pool ? pool.pool_id : null,
    }),
  });

  // if (pool && pool.isTeamsLoading) {
  //   return <p>'Loading...'</p>;
  // }

  return (
    <li className={styles.pool}>
      <h5 className={styles.poolTitle}>
        {isUnassigned ? 'Unassigned' : pool?.pool_desc} ({teams.length})
      </h5>
      <ul ref={isEdit ? drop : null} className={styles.teamList}>
        {teams.map(it => (
          <TeamItem
            team={it}
            divisionName={division.long_name}
            poolName={pool?.pool_desc}
            isEdit={isEdit}
            changePool={changePool}
            onDeletePopupOpen={onDeletePopupOpen}
            onEditPopupOpen={onEditPopupOpen}
            key={it.team_id}
          />
        ))}
      </ul>
    </li>
  );
};

export default PoolItem;
