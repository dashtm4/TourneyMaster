import React from 'react';
import { DndProvider } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import PoolItem from '../pool-item';
import { SectionDropdown, Loader } from '../../../common';
import {
  IDivision,
  IPool,
  ITeam,
  BindingCbWithOne,
} from '../../../../common/models';
import styles from './styles.module.scss';

interface Props {
  division?: IDivision;
  pools: IPool[];
  teams: ITeam[];
  isEdit: boolean;
  isUnassigned: boolean;
  changePool: (
    team: ITeam,
    divisionId: string | null,
    poolId: string | null
  ) => void;
  loadPools: (divisionId: string) => void;
  onDeletePopupOpen: (team: ITeam) => void;
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
  isEdit,
  isUnassigned,
  changePool,
  loadPools,
  onDeletePopupOpen,
  onEditPopupOpen,
  expanded,
  index,
  onToggleOne,
}: Props) => {
  if (division && !division.isPoolsLoading && !division.isPoolsLoaded) {
    loadPools(division.division_id);
  }

  if (division && division.isPoolsLoading) {
    return <Loader />;
  }

  const onSectionToggle = () => {
    onToggleOne && onToggleOne(index!);
  };

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
        <span>
          {isUnassigned ? 'Unassigned' : `Division: ${division?.long_name}`}{' '}
        </span>
        <DndProvider backend={HTML5Backend}>
          <ul className={styles.poolList}>
            {division &&
              pools.map(pool => (
                <PoolItem
                  pool={pool}
                  teams={teams.filter(it => it.pool_id === pool.pool_id)}
                  division={division}
                  isEdit={isEdit}
                  changePool={changePool}
                  onDeletePopupOpen={onDeletePopupOpen}
                  onEditPopupOpen={onEditPopupOpen}
                  key={pool.pool_id}
                />
              ))}
            <PoolItem
              teams={teams.filter(
                it =>
                  (!division && it.division_id === null) ||
                  (division &&
                    !it.pool_id &&
                    it.division_id === division.division_id)
              )}
              division={division || null}
              isEdit={isEdit}
              isUnassigned={true}
              changePool={changePool}
              onDeletePopupOpen={onDeletePopupOpen}
              onEditPopupOpen={onEditPopupOpen}
            />
          </ul>
        </DndProvider>
      </SectionDropdown>
    </li>
  );
};

export default DivisionItem;
