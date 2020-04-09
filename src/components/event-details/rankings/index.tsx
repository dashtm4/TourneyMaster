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
import { CardMessageTypes } from 'components/common/card-message/types';
import { BindingCbWithOne } from 'common/models';
import { EventMenuTitles } from 'common/enums';
import { IInputEvent } from 'common/types';
import { EventDetailsDTO } from '../logic/model';
import { defaultRankingFactor } from '../state';
import styles from '../styles.module.scss';

const MAX_GOAL_ALLOWED_COUNT = 16;

const goalAllowedSelectOptions = Array.from(
  new Array(MAX_GOAL_ALLOWED_COUNT),
  (_, idx) => ({
    label: idx.toString(),
    value: idx.toString(),
  })
);

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

  const [isGoalCheckboxAllowed, toggleGoalCheckbox] = React.useState<boolean>(
    Boolean(max_goal_differential)
  );

  const onChangeGoalCheckbox = () => {
    if (max_goal_differential) {
      onChange('max_goal_differential', null);

      toggleGoalCheckbox(false);
    } else {
      toggleGoalCheckbox(true);
    }
  };

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
      checked: isGoalCheckboxAllowed,
    },
  ];

  const onGoalAllowedChage = (evt: IInputEvent) => {
    onChange('max_goal_differential', evt.target.value);
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
            <div className={styles.checkBoxWrapper}>
              <Checkbox
                onChange={onChangeGoalCheckbox}
                options={goalAllowedCheckboxOptions}
              />
              {isGoalCheckboxAllowed && (
                <Select
                  onChange={onGoalAllowedChage}
                  options={goalAllowedSelectOptions}
                  value={max_goal_differential || ''}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </SectionDropdown>
  );
};

export default Rankings;