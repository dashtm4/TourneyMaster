import React from 'react';
import { MatrixTable, DivisionHeatmap } from 'components/common';
// import { mapKeys } from 'helpers';
import { IField, ITeam, IDivision } from 'common/models';

import { mockedFields, mockedGames, mockedTimeSlots } from '../../mocks';

interface Props {
  divisions: IDivision[];
  isEnterScores: boolean;
  fields: IField[];
  teams: ITeam[];
}

const ScoringTable = ({ isEnterScores, divisions, fields, teams }: Props) => {
  const [isHeatmap, onHeatmapChange] = React.useState(false);

  if (isEnterScores || fields || teams) {
  }

  // const mapped = mapKeys(teams, divisions, 'division_id', [
  //   'division_hex',
  //   'short_name',
  // ]);

  return (
    <>
      <MatrixTable
        games={mockedGames}
        fields={mockedFields}
        timeSlots={mockedTimeSlots}
        isHeatmap={isHeatmap}
      />
      <DivisionHeatmap
        divisions={divisions}
        isHeatmap={isHeatmap}
        onHeatmapChange={onHeatmapChange}
      />
    </>
  );
};

export default ScoringTable;
