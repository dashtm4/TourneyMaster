import React from 'react';
import { ITeamWithResults } from 'common/models/teams';
import styles from './styles.module.scss';

interface Props {
  team: ITeamWithResults;
  divisionName: string;
  poolName: string;
  onOpenTeamDetails: (
    team: ITeamWithResults,
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
    <td>{team.wins}</td>
    <td>{team.losses}</td>
    <td>{team.tie}</td>
    <td>{team.goalsScored}</td>
    <td>{team.goalsAllowed}</td>
  </tr>
);

export default TeamItem;
