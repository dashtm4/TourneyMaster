import React from 'react';
import { BindingCbWithOne } from '../../../../common/models/callback';
import { ITeam } from '../../../../common/models/teams';
import styles from './styles.module.scss';

interface Props {
  team: ITeam;
  onOpenTeamDetails: BindingCbWithOne<ITeam>;
}

const TeamItem = ({ team, onOpenTeamDetails }: Props) => (
  <tr className={styles.teamItem}>
    <td className={styles.teamItemTitle}>
      <button
        onClick={() => onOpenTeamDetails(team)}
        aria-label={`Press to show more about ${team.long_name} team"`}
      >
        {team.short_name}
      </button>
    </td>
    <td></td>
    <td>1</td>
    <td>1</td>
    <td>1</td>
  </tr>
);

export default TeamItem;
