import React, { useState } from 'react';
import DivisionItem from '../division-item';
import { SectionDropdown } from '../../../common';
import { IDivision, IPool, ITeam } from '../../../../common/models';
import { EventMenuTitles } from 'common/enums';
import styles from './styles.module.scss';
import Button from 'components/common/buttons/button';

interface Props {
  divisions: IDivision[];
  pools: IPool[];
  teams: ITeam[];
  loadPools: (divisionId: string) => void;
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
  loadPools,
  onEditPopupOpen,
}: Props) => {
  const [expanded, setExpanded] = useState([
    ...divisions.map(_division => true),
    true,
  ]);
  const [expandAll, setExpandAll] = useState(false);

  const onToggleAll = (e: React.MouseEvent) => {
    e.stopPropagation();

    setExpanded(expanded.map(_e => expandAll));
    setExpandAll(!expandAll);
  };

  const onToggleOne = (indexPanel: number) => {
    setExpanded(
      expanded.map((e: boolean, index: number) =>
        index === indexPanel ? !e : e
      )
    );
  };

  return (
    <li>
      <SectionDropdown
        id={EventMenuTitles.TEAM_MANAGEMENT}
        type="section"
        isDefaultExpanded={true}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <div>Team Management</div>
          {divisions.length ? (
            <div className={styles.buttonContainer}>
              <Button
                label={expandAll ? 'Expand All' : 'Collapse All'}
                variant="text"
                color="secondary"
                onClick={onToggleAll}
              />
            </div>
          ) : null}
        </div>
        <ul className={styles.divisionList}>
          {divisions.map((division, index) => (
            <DivisionItem
              division={division}
              pools={pools.filter(
                pool => pool.division_id === division.division_id
              )}
              teams={teams}
              loadPools={loadPools}
              onEditPopupOpen={onEditPopupOpen}
              key={division.division_id}
              expanded={expanded[index]}
              index={index}
              onToggleOne={onToggleOne}
            />
          ))}
        </ul>
      </SectionDropdown>
    </li>
  );
};

export default TeamManagement;
