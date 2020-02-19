import React from 'react';
import styles from '../styles.module.scss';

class Pool extends React.Component<any> {
  render() {
    const { pool, teams } = this.props;
    console.log(pool);
    return (
      <div className={styles.pool}>
        {/* <p className={styles.poolTitle}>{pool.long_name}</p> */}
        <p className={styles.poolTitle}>West</p>
        <ul>
          {teams.map((team: any) => (
            <li>{team.long_name}</li>
          ))}
        </ul>
      </div>
    );
  }
}

export default Pool;
