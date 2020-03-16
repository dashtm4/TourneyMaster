import { ITeamCard } from 'common/models/schedule/teams';

const getUnassignedTeams = (teams: ITeamCard[]) =>
  teams.filter(it => !it.fieldId && !it.timeSlotId);

export { getUnassignedTeams };
