import React from 'react';
import { DndProvider } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import Dnd from '../dnd';
import {
  SectionDropdown,
  HeadingLevelThree,
  CardMessage,
  Checkbox,
  Select,
} from 'components/common';
import { BindingCbWithOne } from 'common/models';
import { EventMenuTitles, RankingFactorValues } from 'common/enums';
import { EventDetailsDTO } from '../logic/model';
import styles from '../styles.module.scss';
import { CardMessageTypes } from 'components/common/card-message/types';
import { IInputEvent } from 'common/types';

const defaultRankingFactor = [
  { id: RankingFactorValues.BEST_RECORD, text: 'Best record' },
  { id: RankingFactorValues.HEAD_TO_HEAD, text: 'Head to Head' },
  { id: RankingFactorValues.GOAL_DIFFERENCE, text: 'Goal Difference' },
  { id: RankingFactorValues.GOAL_SCORED, text: 'Goals Scored' },
  { id: RankingFactorValues.GOAL_ALLOWED, text: 'Goals Allowed' },
];

const MAX_GOAL_ALLOWED_COUNT = 8;

const goalAllowedSelectOptions = Array.from(
  new Array(MAX_GOAL_ALLOWED_COUNT),
  (_, idx) => ({
    label: (idx + 1).toString(),
    value: (idx + 1).toString(),
  })
);

const SELECT_DEFAULT_VALUE = 'none';

const goalAllowedDefaultOption = {
  label: 'None',
  value: SELECT_DEFAULT_VALUE,
};

enum rankingFactors {
  'rankingFactorDivisions' = 'ranking_factor_divisions',
  'rankingFactorPools' = 'ranking_factor_pools',
}

interface Props {
  eventData: Partial<EventDetailsDTO>;
  onChange: any;
  expanded: boolean;
  onToggleOne: BindingCbWithOne<number>;
  index: number;
}

const Rankings = ({
  eventData,
  expanded,
  onChange,
  onToggleOne,
  index,
}: Props) => {
  const {
    ranking_factor_divisions,
    ranking_factor_pools,
    max_goal_differential,
  } = eventData;

  const onRankingFactorReorder = (
    name: string,
    cards: { id: number; text: string }[]
  ) => {
    const rankingFactor = JSON.stringify(cards.map(card => card.id));

    onChange(rankingFactors[name], rankingFactor);
  };

  const onSectionToggle = () => {
    onToggleOne(index);
  };

  const parseRankingFactor = (factor?: string) => {
    return factor
      ? JSON.parse(factor).map((fact: number) => ({
          id: fact,
          text: defaultRankingFactor[fact - 1].text,
        }))
      : defaultRankingFactor;
  };

  const rankingFactorDivisions = parseRankingFactor(ranking_factor_divisions);

  const rankingFactorPools = parseRankingFactor(ranking_factor_pools);

  const goalAllowedCheckboxOptions = [
    {
      label: 'Cap Goals Allowed Differential',
      checked: Boolean(max_goal_differential),
    },
  ];

  const onGoalAllowedChage = ({ target: { value } }: IInputEvent) => {
    value === SELECT_DEFAULT_VALUE
      ? onChange('max_goal_differential', null)
      : onChange('max_goal_differential', value);
  };

  return (
    <SectionDropdown
      id={EventMenuTitles.RANKINGS}
      type="section"
      panelDetailsType="flat"
      isDefaultExpanded={true}
      useBorder={true}
      expanded={expanded}
      onToggle={onSectionToggle}
    >
      <HeadingLevelThree>
        <span className={styles.blockHeading}>{EventMenuTitles.RANKINGS}</span>
      </HeadingLevelThree>
      <div className={styles.playoffsDetails}>
        <div className={styles.pdThird}>
          <div className={styles.dndTitleWrapper}>
            <span>Ranking Factors (in Divisions)</span>
            <span>Ranking Factors (in Pools)</span>
          </div>
          <div className={styles.dndWrapper}>
            <DndProvider backend={HTML5Backend}>
              <Dnd
                name="rankingFactorDivisions"
                cards={rankingFactorDivisions}
                onUpdate={onRankingFactorReorder.bind(
                  undefined,
                  'rankingFactorDivisions'
                )}
              />
              <Dnd
                name="rankingFactorPools"
                cards={rankingFactorPools}
                onUpdate={onRankingFactorReorder.bind(
                  undefined,
                  'rankingFactorPools'
                )}
              />
            </DndProvider>
          </div>
          <div className={styles.tooltipWrapper}>
            <CardMessage type={CardMessageTypes.EMODJI_OBJECTS}>
              Drag and Drop to reorder Ranking Factors
            </CardMessage>
          </div>
          <div className={styles.checkBoxWrapper}>
            <Checkbox options={goalAllowedCheckboxOptions} />
            <Select
              onChange={onGoalAllowedChage}
              options={[goalAllowedDefaultOption, ...goalAllowedSelectOptions]}
              value={max_goal_differential || SELECT_DEFAULT_VALUE}
            />
          </div>
        </div>
      </div>
    </SectionDropdown>
  );
};

export default Rankings;
