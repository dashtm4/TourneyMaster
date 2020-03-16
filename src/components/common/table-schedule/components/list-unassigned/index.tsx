import React from 'react';
// import TeamDrop from 'components/common/matrix-table/dnd/drop';
import { ITeamCard } from 'common/models/schedule/teams';
import styles from './styles.module.scss';

interface Props {
  teams: ITeamCard[];
}

const ListUnassigned = ({ teams }: Props) => (
  <section className={styles.section}>
    <h3 className={styles.title}>Needs Assignment</h3>
    <ul className={styles.list}>
      {teams.map(it => (
        // <TeamDrop
        //   team={it}
        //   key={it.team_id}
        // />
        <li key={it.name}>{it.name}</li>
      ))}
    </ul>
  </section>
);

export default ListUnassigned;
