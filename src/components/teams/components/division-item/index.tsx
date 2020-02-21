import React from 'react';
import { DndProvider } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import PoolItem from '../pool-item';
import { SectionDropdown } from '../../../common';
import { IDisision, IPool, ITeam } from '../../../../common/models';
import styles from './styles.module.scss';

interface Props {
  division: IDisision;
  pools: IPool[];
  teams: ITeam[];
  isEdit: boolean;
  changePool: (team: ITeam, poolId: string | null) => void;
}

const DivisionItem = ({
  division,
  pools,
  teams,
  isEdit,
  changePool,
}: Props) => {
  if (!division) {
    return null;
  }

  return (
    <li className={styles.divisionItem}>
      <SectionDropdown
        isDefaultExpanded={true}
        type="section"
        panelDetailsType="flat"
        headingColor="#1C315F"
      >
        <span>{division.long_name}</span>
        <DndProvider backend={HTML5Backend}>
          <ul className={styles.poolList}>
            {pools.map(pool => (
              <PoolItem
                pool={pool}
                teams={teams.filter(it => it.pool_id === pool.pool_id)}
                divisionId={division.division_id}
                isEdit={isEdit}
                changePool={changePool}
                key={pool.pool_id}
              />
            ))}
            <PoolItem
              teams={teams.filter(
                it => !it.pool_id && it.division_id === division.division_id
              )}
              divisionId={division.division_id}
              isEdit={isEdit}
              isUnassigned={true}
              changePool={changePool}
            />
          </ul>
        </DndProvider>
      </SectionDropdown>
    </li>
  );
};

export default DivisionItem;
