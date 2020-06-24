import React, { useState } from 'react';
import DivisionItem from '../division-item';
import { SectionDropdown, CardMessage } from '../../../common';
import { IDivision, IPool, ITeam } from '../../../../common/models';
import { EventMenuTitles, SortByFilesTypes } from 'common/enums';
import styles from './styles.module.scss';
import Button from 'components/common/buttons/button';
import { sortByField } from 'helpers';
import { CardMessageTypes } from 'components/common/card-message/types';

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
  onDeleteAllTeams: (divisionId: string) => void;
}

const TeamManagement = ({
  divisions,
  teams,
  pools,
  loadPools,
  onEditPopupOpen,
  onDeleteAllTeams,
}: Props) => {
  const [isSectionsExpand, toggleSectionCollapse] = useState<boolean>(true);

  const onToggleSectionCollapse = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleSectionCollapse(!isSectionsExpand);
  };

  const sortedDivisions = sortByField(divisions, SortByFilesTypes.DIVISIONS);

  return (
    <li>
      <SectionDropdown
        id={EventMenuTitles.TEAM_MANAGEMENT}
        type="section"
        isDefaultExpanded={true}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <div>Team Management</div>
          <div className={styles.sectionRow}>
            <CardMessage type={CardMessageTypes.EMODJI_OBJECTS}>
              Expert Tip: Only include Division Year in the Team Name if the team is "playing up"! Otherwise, please leave it out, as it is embedded in the Division Name.
              </CardMessage>
            <div className={styles.sectionItem} />
          </div>
          {divisions.length ? (
            <div className={styles.buttonContainer}>
              <Button
                label={isSectionsExpand ? 'Collapse All' : 'Expand All'}
                variant="text"
                color="secondary"
                onClick={onToggleSectionCollapse}
              />
            </div>
          ) : null}
        </div>
        <ul className={styles.divisionList}>
          {sortedDivisions.map(division => (
            <DivisionItem
              division={division}
              pools={pools.filter(
                pool => pool.division_id === division.division_id
              )}
              teams={teams}
              loadPools={loadPools}
              onEditPopupOpen={onEditPopupOpen}
              onDeleteAllTeams={onDeleteAllTeams}
              key={division.division_id}
              isSectionExpand={isSectionsExpand}
            />
          ))}
        </ul>
      </SectionDropdown>
    </li>
  );
};

export default TeamManagement;
