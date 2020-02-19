import React, { useEffect } from 'react';
import PoolItem from '../pool-item';
import { SectionDropdown } from '../../../common';
import { IDisision, IPool, ITeam } from '../../../../common/models';
import styles from './styles.module.scss';

interface Props {
  division: IDisision;
  pools: IPool[];
  teams: ITeam[];
  loadPools: (divisionId: string) => void;
  loadTeams: (poolId: string) => void;
}

const DivisionItem = ({
  division,
  pools,
  teams,
  loadPools,
  loadTeams,
}: Props) => {
  useEffect(() => {
    loadPools(division.division_id);
  }, []);

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
        <ul className={styles.poolList}>
          {pools.map(pool => (
            <PoolItem
              pool={pool}
              teams={teams.filter(it => it.pool_id === pool.pool_id)}
              loadTeams={loadTeams}
              key={pool.pool_id}
            />
          ))}
        </ul>
      </SectionDropdown>
    </li>
  );
};

export default DivisionItem;
