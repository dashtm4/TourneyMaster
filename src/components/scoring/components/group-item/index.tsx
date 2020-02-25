/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from 'react';
import SectionDropdown from '../../../common/section-dropdown';
import TeamItem from '../team-item';
import styles from './styles.module.scss';
import {
  IPool,
  ITeam,
  BindingAction,
  BindingCbWithOne,
} from '../../../../common/models';

interface Props {
  pool: IPool;
  teams: ITeam[];
  loadTeams: BindingAction;
  onOpenTeamDetails: BindingCbWithOne<ITeam>;
}

const GroupItem = ({ pool, teams, loadTeams, onOpenTeamDetails }: Props) => {
  useEffect(() => {
    loadTeams();
  }, []);

  if (teams.length === 0) {
    return null;
  }

  return (
    <li className={styles.groupItem}>
      <SectionDropdown isDefaultExpanded={true} headingColor={'#1C315F'}>
        <span>{pool.pool_desc}</span>
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
