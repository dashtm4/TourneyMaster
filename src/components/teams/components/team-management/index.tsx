import React from 'react';
import DivisionItem from '../division-item';
import { SectionDropdown } from '../../../common';
import { IDisision, IPool, ITeam } from '../../../../common/models';
import styles from './styles.module.scss';

interface Props {
  divisions: IDisision[];
  pools: IPool[];
  teams: ITeam[];
  isEdit: boolean;
  changePool: (team: ITeam, poolId: string | null) => void;
  loadPools: (divisionId: string) => void;
  loadTeams: (poolId: string) => void;
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
  loadTeams,
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
            changePool={changePool}
            loadPools={loadPools}
            loadTeams={loadTeams}
            onDeletePopupOpen={onDeletePopupOpen}
            onEditPopupOpen={onEditPopupOpen}
            key={division.division_id}
          />
        ))}
      </ul>
    </SectionDropdown>
  </li>
);

export default TeamManagement;
