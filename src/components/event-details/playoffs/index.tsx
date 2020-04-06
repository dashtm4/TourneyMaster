import React, { useEffect } from 'react';
import {
  SectionDropdown,
  HeadingLevelThree,
  Checkbox,
  CardMessage,
  Radio,
  Select,
  Input,
} from 'components/common';
import { CardMessageTypes } from 'components/common/card-message/types';
import { EventMenuTitles } from 'common/enums';

import styles from '../styles.module.scss';
import { EventDetailsDTO } from '../logic/model';

import Dnd from '../dnd';
import { DndProvider } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import { BindingCbWithOne } from 'common/models';

type InputTargetValue = React.ChangeEvent<HTMLInputElement>;

const bracketTypeOptions = [
  'Single Elimination',
  'Double Elimination',
  '3 Game Guarantee',
];

const topNumberOfTeams = [
  '2',
  '3',
  '4',
  '5',
  '6',
  '7',
  '8',
  '9',
  '10',
  '11',
  '12',
  '13',
  '14',
  '15',
  '16',
];

enum bracketTypesEnum {
  'Single Elimination' = 1,
  'Double Elimination' = 2,
  '3 Game Guarantee' = 3,
}

enum numTeamsBracketEnum {
  'Top:' = 1,
  'All' = 2,
}

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

export const defaultRankingFactor = [
  { id: 1, text: 'Best record' },
  { id: 2, text: 'Head to Head' },
  { id: 3, text: 'Goal Difference' },
  { id: 4, text: 'Goals Scored' },
  { id: 5, text: 'Goals Allowed' },
];

const PlayoffsSection: React.FC<Props> = ({
  eventData,
  onChange,
  expanded,
  index,
  onToggleOne,
}: Props) => {
  const {
    playoffs_exist,
    bracket_type,
    num_teams_bracket,
    bracket_durations_vary,
    ranking_factor_divisions,
    ranking_factor_pools,
  } = eventData;

  const bracketGameDurationOpts = [
    {
      label: 'Bracket Games have Different Game Durations',
      checked: Boolean(bracket_durations_vary),
    },
  ];

  const onPlayoffs = () => {
    onChange('playoffs_exist', playoffs_exist ? 0 : 1);
    onChange(
      'ranking_factor_divisions',
      JSON.stringify(defaultRankingFactor.map(factor => factor.id))
    );
    onChange(
      'ranking_factor_pools',
      JSON.stringify(defaultRankingFactor.map(factor => factor.id))
    );
  };

  const onChangeBracketType = (e: InputTargetValue) =>
    onChange('bracket_type', bracketTypesEnum[e.target.value]);

  const onNumberOfTeamsChange = (e: InputTargetValue) =>
    onChange(
      'num_teams_bracket',
      e.target.value === numTeamsBracketEnum[2]
        ? null
        : Number(topNumberOfTeams[topNumberOfTeams.length - 1])
    );

  const onChangeMaxTeamNumber = (e: InputTargetValue) =>
    onChange('num_teams_bracket', Number(e.target.value));

  const onBracketGameDuration = () =>
    onChange('bracket_durations_vary', bracket_durations_vary ? 0 : 1);

  useEffect(() => {
    if (playoffs_exist && !bracket_type)
      onChange('bracket_type', bracketTypesEnum['Single Elimination']);
  });

  const onRankingFactorReorder = (name: string, cards: any) => {
    const rankingFactor = JSON.stringify(cards.map((card: any) => card.id));

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

  return (
    <SectionDropdown
      id={EventMenuTitles.PLAYOFFS}
      type="section"
      panelDetailsType="flat"
      isDefaultExpanded={true}
      useBorder={true}
      expanded={expanded}
      onToggle={onSectionToggle}
    >
      <HeadingLevelThree>
        <span className={styles.blockHeading}>Playoffs</span>
      </HeadingLevelThree>
      <div className={styles.playoffsDetails}>
        <div className={styles.pdFirst}>
          <Checkbox
            formLabel=""
            options={[
              { label: 'Event has Playoffs', checked: Boolean(playoffs_exist) },
            ]}
            onChange={onPlayoffs}
          />
          <CardMessage type={CardMessageTypes.EMODJI_OBJECTS}>
            Playoff settings include Bracket Type, # of Teams, and Ranking
            Factors
          </CardMessage>
        </div>
        {Boolean(playoffs_exist) && (
          <>
            <div className={styles.pdSecond}>
              <Radio
                formLabel="Bracket Type"
                options={bracketTypeOptions}
                onChange={onChangeBracketType}
                checked={bracketTypesEnum[bracket_type!]}
              />
              <Radio
                formLabel="# of Teams"
                options={['Top:', 'All']}
                onChange={onNumberOfTeamsChange}
                checked={numTeamsBracketEnum[num_teams_bracket ? 1 : 2]}
              />
              <Select
                label=""
                disabled={!num_teams_bracket}
                options={topNumberOfTeams.map(type => ({
                  label: type,
                  value: type,
                }))}
                value={String(num_teams_bracket || '')}
                onChange={onChangeMaxTeamNumber}
              />
            </div>
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
              <CardMessage type={CardMessageTypes.EMODJI_OBJECTS}>
                Drag and Drop to reorder Ranking Factors
              </CardMessage>
              <Checkbox
                options={bracketGameDurationOpts}
                onChange={onBracketGameDuration}
              />
            </div>
            {Boolean(bracket_durations_vary) && (
              <div className={styles.pdFourth}>
                <Input
                  fullWidth={true}
                  endAdornment="Minutes"
                  label="Pregame Warmup"
                  value="0"
                />
                <span className={styles.innerSpanText}>&nbsp;+&nbsp;</span>
                <Input
                  fullWidth={true}
                  endAdornment="Minutes"
                  label="Time Division Duration"
                  value="0"
                />
                <span className={styles.innerSpanText}>
                  &nbsp;(0)&nbsp;+&nbsp;
                </span>
                <Input
                  fullWidth={true}
                  endAdornment="Minutes"
                  label="Time Between Periods"
                  value="0"
                />
                <span className={styles.innerSpanText}>
                  &nbsp;=&nbsp;0&nbsp; Minutes Total Runtime
                </span>
              </div>
            )}
          </>
        )}
      </div>
    </SectionDropdown>
  );
};

export default PlayoffsSection;
