import React from 'react';
import SectionDropdown from '../../../common/section-dropdown';
import TeamItem from '../team-item';
import styles from './styles.module.scss';
import { BindingCbWithOne } from '../../../../common/models/callback';
import { ITeam } from '../../../../common/models/teams';

interface Props {
  teams: ITeam[];
  onOpenTeamDetails: BindingCbWithOne<ITeam>;
}

const GroupItem = ({ teams, onOpenTeamDetails }: Props) => {
  if (teams.length === 0) return null;

  return (
    <li className={styles.groupItem}>
      <SectionDropdown isDefaultExpanded={true} headingColor={'#1C315F'}>
        <span>2020: East</span>
        <table className={styles.groupTable}>
          <thead>
            <tr>
              <td>Team</td>
              <td>W</td>
              <td>L</td>
              <td>GS</td>
              <td>GA</td>
            </tr>
          </thead>
          <tbody>
            {teams.map(it => (
              <TeamItem
                team={it}
                key={it.team_id}
                onOpenTeamDetails={onOpenTeamDetails}
              />
            ))}
          </tbody>
        </table>
      </SectionDropdown>
    </li>
  );
};
export default GroupItem;
