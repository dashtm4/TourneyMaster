import { IEventDetails, IScoringSetting } from 'common/models';

const getScoringSettings = (event: IEventDetails): IScoringSetting => {
  const scroingSetting = {
    hasGoalsScored: Boolean(event.show_goals_scored),
    hasGoalsAllowed: Boolean(event.show_goals_allowed),
    hasGoalsDifferential: Boolean(event.show_goals_diff),
    hasTies: Boolean(event.tie_breaker_format_id),
    maxGoalDifferential: Number(event.max_goal_differential),
  };

  return scroingSetting;
};

export { getScoringSettings };
