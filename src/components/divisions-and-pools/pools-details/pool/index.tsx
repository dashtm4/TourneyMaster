import React from 'react';
import styles from '../styles.module.scss';

class Pool extends React.Component<any> {
  render() {
    const { pool, teams } = this.props;
    return (
      <div className={styles.pool}>
        <p className={styles.poolTitle}>
          {pool ? pool.pool_desc : 'Unassigned'}
        </p>
        <ul>
          {teams.map((team: any) => (
            <li key={team.team_id}>{team.long_name}</li>
          ))}
        </ul>
      </div>
    );
  }
}

export default Pool;
