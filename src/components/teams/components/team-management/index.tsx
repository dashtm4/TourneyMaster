import React from 'react';
import DivisionItem from '../division-item';
import { SectionDropdown } from '../../../common';
import { IDivision, IPool, ITeam } from '../../../../common/models';
import styles from './styles.module.scss';

interface Props {
  divisions: IDivision[];
  pools: IPool[];
  teams: ITeam[];
  isEdit: boolean;
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
}

const TeamManagement = ({
  divisions,
  teams,
  pools,
  isEdit,
  changePool,
  loadPools,
  onDeletePopupOpen,
  onEditPopupOpen,
}: Props) => (
  <li>
    <SectionDropdown type="section" isDefaultExpanded={true}>
      <span>Team Management</span>
      <ul className={styles.divisionList}>
        {divisions.map(division => (
          <DivisionItem
            division={division}
            pools={pools.filter(
              pool => pool.division_id === division.division_id
            )}
            teams={teams}
            isEdit={isEdit}
            isUnassigned={false}
            changePool={changePool}
            loadPools={loadPools}
            onDeletePopupOpen={onDeletePopupOpen}
            onEditPopupOpen={onEditPopupOpen}
            key={division.division_id}
          />
        ))}
        <DivisionItem
          teams={teams}
          pools={[]}
          isEdit={isEdit}
          isUnassigned={true}
          changePool={changePool}
          loadPools={loadPools}
          onDeletePopupOpen={onDeletePopupOpen}
          onEditPopupOpen={onEditPopupOpen}
        />
      </ul>
    </SectionDropdown>
  </li>
);

export default TeamManagement;
