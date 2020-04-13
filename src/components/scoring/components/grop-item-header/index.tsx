import React from 'react';
import { IScoringSetting } from 'common/models';

interface Props {
  scoringSettings: IScoringSetting;
}

const GroupItemHeader = ({ scoringSettings }: Props) => (
  <thead>
    <tr>
      <th>Team</th>
      <th>W</th>
      <th>L</th>
      {scoringSettings.hasTies && <th>T</th>}
      {scoringSettings.hasGoalsScored && <th>GS</th>}
      {scoringSettings.hasGoalsAllowed && <th>GA</th>}
      {scoringSettings.hasGoalsDifferential && <th>GD</th>}
    </tr>
  </thead>
);

export default GroupItemHeader;
