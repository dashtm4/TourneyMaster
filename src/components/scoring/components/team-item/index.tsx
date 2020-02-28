import React from 'react';
import { ITeam } from '../../../../common/models/teams';
import styles from './styles.module.scss';

interface Props {
  team: ITeam;
  divisionName: string;
  poolName: string;
  onOpenTeamDetails: (
    team: ITeam,
    divisionName: string,
    poolName: string
  ) => void;
}

const TeamItem = ({
  team,
  divisionName,
  poolName,
  onOpenTeamDetails,
}: Props) => (
  <tr className={styles.teamItem}>
    <td className={styles.teamItemTitle}>
      <button
        onClick={() => onOpenTeamDetails(team, divisionName, poolName)}
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
