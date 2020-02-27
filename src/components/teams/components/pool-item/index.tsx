import React from 'react';
import { useDrop } from 'react-dnd';
import TeamItem from '../team-item';
import { IPool, ITeam, IDisision } from '../../../../common/models';
import { DndItems } from '../../types';
import styles from './styles.module.scss';

interface Props {
  pool?: IPool;
  teams: ITeam[];
  division: IDisision | null;
  isEdit: boolean;
  isUnassigned?: boolean;
  changePool: (
    team: ITeam,
    divisionId: string | null,
    poolId: string | null
  ) => void;
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
  onDeletePopupOpen,
  onEditPopupOpen,
}: Props) => {
  const [, drop] = useDrop({
    accept: DndItems.TEAM,
    drop: () => ({
      divisionId: division ? division.division_id : null,
      poolId: pool ? pool.pool_id : null,
    }),
  });

  return (
    <li className={styles.pool}>
      {division && (
        <h5 className={styles.poolTitle}>
          {isUnassigned ? 'Unassigned' : pool?.pool_name} ({teams.length})
        </h5>
      )}
      <ul ref={isEdit ? drop : null} className={styles.teamList}>
        {teams.map(it => (
          <TeamItem
            team={it}
            divisionName={division ? division.long_name : ''}
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
