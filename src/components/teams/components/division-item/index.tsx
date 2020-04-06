import React from 'react';
import PoolItem from '../pool-item';
import { SectionDropdown, Loader } from 'components/common';
import { IDivision, IPool, ITeam, BindingCbWithOne } from 'common/models';
import styles from './styles.module.scss';

interface Props {
  division: IDivision;
  pools: IPool[];
  teams: ITeam[];
  loadPools: (divisionId: string) => void;
  onEditPopupOpen: (
    team: ITeam,
    divisionName: string,
    poolName: string
  ) => void;
  expanded?: boolean;
  onToggleOne?: BindingCbWithOne<number>;
  index?: number;
}

const DivisionItem = ({
  division,
  pools,
  teams,
  loadPools,
  onEditPopupOpen,
  expanded,
  index,
  onToggleOne,
}: Props) => {
  if (!division.isPoolsLoading && !division.isPoolsLoaded) {
    loadPools(division.division_id);
  }

  if (division.isPoolsLoading) {
    return <Loader />;
  }

  const onSectionToggle = () => {
    onToggleOne && onToggleOne(index!);
  };

  const teamsWithoutPool = teams.filter(
    team => team.division_id === division.division_id && !team.pool_id
  );

  return (
    <li className={styles.divisionItem}>
      <SectionDropdown
        isDefaultExpanded={true}
        type="section"
        panelDetailsType="flat"
        headingColor="#1C315F"
        expanded={expanded !== undefined && expanded}
        onToggle={onSectionToggle}
      >
        <span>Division: {division.long_name}</span>
        <ul className={styles.poolList}>
          {pools.map(pool => {
            const filtredTeams = teams.filter(
              it => it.pool_id === pool.pool_id
            );

            return (
              <PoolItem
                pool={pool}
                teams={filtredTeams}
                division={division}
                onEditPopupOpen={onEditPopupOpen}
                key={pool.pool_id}
              />
            );
          })}
          {teamsWithoutPool.length ? (
            <PoolItem
              teams={teamsWithoutPool}
              division={division}
              onEditPopupOpen={onEditPopupOpen}
              key={pools.length}
            />
          ) : null}
        </ul>
      </SectionDropdown>
    </li>
  );
};

export default DivisionItem;
