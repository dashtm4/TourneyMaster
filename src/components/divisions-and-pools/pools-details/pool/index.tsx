import React from 'react';
import styles from '../styles.module.scss';
import { IPool, ITeam } from 'common/models';

interface IPoolProps {
  pool?: Partial<IPool>;
  teams: Partial<ITeam>[];
}

class Pool extends React.Component<IPoolProps> {
  render() {
    const { pool, teams } = this.props;
    return (
      <div className={styles.pool}>
        <p className={styles.poolTitle}>
          {pool ? pool.pool_name : 'Unassigned'}
        </p>
        <ul>
          {teams.length
            ? teams.map(team => <li key={team.team_id}>{team.long_name}</li>)
            : '—'}
        </ul>
      </div>
    );
  }
}

export default Pool;
