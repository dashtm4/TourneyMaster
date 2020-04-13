import { IEventDetails } from 'common/models';

interface IScoringSetting {
  hasGoalsScored: boolean;
  hasGoalsAllowed: boolean;
  hasGoalsDifferential: boolean;
  hasTies: boolean;
}

const getScoringSetting = (event: IEventDetails): IScoringSetting => {
  const scroingSetting = {
    hasGoalsScored: Boolean(event.show_goals_scored),
    hasGoalsAllowed: Boolean(event.show_goals_allowed),
    hasGoalsDifferential: Boolean(event.max_goal_differential),
    hasTies: Boolean(event.tie_breaker_format_id),
  };

  return scroingSetting;
};

export { getScoringSetting };
