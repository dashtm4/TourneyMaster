import React from 'react';
import ScoringFilter from '../scoring-filter';
import ScoringTable from '../scoring-table';
import { DayTypes, ViewTypes } from '../../index';
import { IDivision, ITeam } from 'common/models';
import { IFieldWithRelated } from '../../types';
import styles from './styles.module.scss';

interface Props {
  divisions: IDivision[];
  teams: ITeam[];
  fields: IFieldWithRelated[];
  view: ViewTypes;
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
  view,
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
    <ScoringTable isEnterScores={view === ViewTypes.ENTER_SCORES} />
  </section>
);

export default Scoring;
