import React from 'react';
import DivisionItem from '../division-item';
import { SectionDropdown } from '../../../common';
import { IDisision, IPool, ITeam } from '../../../../common/models';
import styles from './styles.module.scss';

interface Props {
  divisions: IDisision[];
  pools: IPool[];
  teams: ITeam[];
  loadPools: (divisionId: string) => void;
  loadTeams: (poolId: string) => void;
}

const TeamManagement = ({
  divisions,
  teams,
  pools,
  loadPools,
  loadTeams,
}: Props) => (
  <li>
    <SectionDropdown type="section" isDefaultExpanded={true}>
      <span>Team Management</span>
      <ul className={styles.divisionList}>
        {divisions.map(division => (
          <DivisionItem
            division={division}
            pools={pools.filter(it => it.division_id === division.division_id)}
            teams={teams}
            loadPools={loadPools}
            loadTeams={loadTeams}
            key={division.division_id}
          />
        ))}
      </ul>
    </SectionDropdown>
  </li>
);

export default TeamManagement;
