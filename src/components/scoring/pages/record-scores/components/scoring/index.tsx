import React from 'react';
import ScoringFilter from '../scoring-filter/index';
import { DayTypes } from '../../index';
import { IDivision, ITeam, IField } from 'common/models';
import styles from './styles.module.scss';

interface Props {
  divisions: IDivision[];
  teams: ITeam[];
  fields: IField[];
  selectedDay: DayTypes;
  selectedDivision: string;
  selectedTeam: string;
  selectedField: string;
  onChangeSelect: (evt: React.ChangeEvent<HTMLInputElement>) => void;
  onChangeDay: (day: DayTypes) => void;
}

const Scoring = ({
  divisions,
  teams,
  fields,
  selectedDay,
  selectedDivision,
  selectedTeam,
  selectedField,
  onChangeSelect,
  onChangeDay,
}: Props) => (
  <section className={styles.scoringWrapper}>
    <h2 className="visually-hidden">Scoring</h2>
    <ScoringFilter
      divisions={divisions}
      teams={teams}
      fields={fields}
      selectedDay={selectedDay}
      selectedDivision={selectedDivision}
      selectedTeam={selectedTeam}
      selectedField={selectedField}
      onChangeSelect={onChangeSelect}
      onChangeDay={onChangeDay}
    />
  </section>
);

export default Scoring;
