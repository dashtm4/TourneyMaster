import React from 'react';

import {
  SectionDropdown,
  HeadingLevelThree,
  Input,
  Radio,
  Checkbox,
} from 'components/common';

import styles from '../styles.module.scss';
import { EventDetailsDTO } from '../logic/model';
import { getTimeFromString, timeToString } from 'helpers/stringTimeOperations';

type InputTargetValue = React.ChangeEvent<HTMLInputElement>;

enum esDetailsEnum {
  'Back to Back Game Warning' = 'back_to_back_warning',
}

enum timeDivisionEnum {
  'Halves (2)' = 2,
  'Periods (3)' = 3,
  'Quarters (4)' = 4,
}

enum ResultsDisplayEnum {
  'Show Goals Scored' = 'show_goals_scored',
  'Show Goals Allowed' = 'show_goals_allowed',
  'Show Goals Differential' = 'show_goals_diff',
  'Allow Ties' = 'tie_breaker_format_id',
}

interface Props {
  eventTypeOptions: string[];
  eventData: Partial<EventDetailsDTO>;
  onChange: any;
}

const EventStructureSection: React.FC<Props> = ({
  eventTypeOptions,
  eventData,
  onChange,
}: Props) => {
  const onEventTypeChange = (e: InputTargetValue) =>
    onChange('event_type', e.target.value);

  const onGameNumChange = (e: InputTargetValue) =>
    onChange('min_num_of_games', Number(e.target.value));

  const onResultsChange = (e: InputTargetValue) =>
    onChange(
      ResultsDisplayEnum[e.target.value],
      eventData[ResultsDisplayEnum[e.target.value]] ? 0 : 1
    );

  const onChangePeriod = (e: InputTargetValue) =>
    onChange('periods_per_game', timeDivisionEnum[e.target.value]);

  const onEsDetailsChange = (e: InputTargetValue) =>
    onChange(
      esDetailsEnum[e.target.value],
      eventData[esDetailsEnum[e.target.value]] ? 0 : 1
    );

  const onPregameWarmupChange = (e: InputTargetValue) => {
    const value = e.target.value;
    const timeInString: string = timeToString(Number(value));
    return onChange('pre_game_warmup', timeInString);
  };

  const onTimeDivisionDuration = (e: InputTargetValue) => {
    const value = e.target.value;
    const timeInString: string = timeToString(Number(value));
    return onChange('period_duration', timeInString);
  };

  const onTimeBtwnPeriodsDuration = (e: InputTargetValue) => {
    const value = e.target.value;
    const timeInString: string = timeToString(Number(value));
    return onChange('time_btwn_periods', timeInString);
  };

  const {
    show_goals_scored,
    show_goals_allowed,
    show_goals_diff,
    back_to_back_warning,
    tie_breaker_format_id,
    period_duration,
    time_btwn_periods,
    pre_game_warmup,
    periods_per_game,
  } = eventData;

  const resultsDisplayOptions = [
    { label: 'Show Goals Scored', checked: Boolean(show_goals_scored) },
    { label: 'Show Goals Allowed', checked: Boolean(show_goals_allowed) },
    { label: 'Show Goals Differential', checked: Boolean(show_goals_diff) },
    { label: 'Allow Ties', checked: Boolean(tie_breaker_format_id) },
  ];

  const timeDivisionOptions = ['Halves (2)', 'Periods (3)', 'Quarters (4)'];

  const esDetailsOptions = [
    {
      label: 'Back to Back Game Warning',
      checked: Boolean(back_to_back_warning),
    },
    {
      label: 'Require Waivers',
      checked: false,
    },
  ];

  return (
    <SectionDropdown type="section" padding="0">
      <HeadingLevelThree>
        <span className={styles.blockHeading}>Event Structure</span>
      </HeadingLevelThree>
      <div className={styles['es-details']}>
        <div className={styles['es-details-first']}>
          <div className={styles.column}>
            <Radio
              options={eventTypeOptions}
              formLabel="Event Type"
              onChange={onEventTypeChange}
              checked={eventData.event_type || ''}
            />
          </div>
          <div className={styles.column}>
            <Radio
              options={timeDivisionOptions}
              formLabel="Time Division"
              onChange={onChangePeriod}
              checked={timeDivisionEnum[eventData.periods_per_game || 2]}
            />
          </div>
          <div className={styles.column}>
            <Checkbox
              options={resultsDisplayOptions}
              formLabel="Results Display"
              onChange={onResultsChange}
            />
          </div>
          <Input
            width="250px"
            fullWidth={true}
            label="Min # of Game Guarantee"
            value={String(eventData.min_num_of_games)}
            onChange={onGameNumChange}
          />
        </div>
        <div className={styles['es-details-second']}>
          <Input
            width="170px"
            fullWidth={true}
            endAdornment="Minutes"
            label="Pregame Warmup"
            value={getTimeFromString(pre_game_warmup!, 'minutes').toString()}
            onChange={onPregameWarmupChange}
          />
          <span className={styles.innerSpanText}>&nbsp;+&nbsp;</span>
          <Input
            width="170px"
            fullWidth={true}
            endAdornment="Minutes"
            label="Time Division Duration"
            value={getTimeFromString(period_duration!, 'minutes').toString()}
            onChange={onTimeDivisionDuration}
          />
          <span className={styles.innerSpanText}>
            &nbsp;({periods_per_game})&nbsp;+&nbsp;
          </span>
          <Input
            width="170px"
            fullWidth={true}
            endAdornment="Minutes"
            label="Time Between Periods"
            value={getTimeFromString(time_btwn_periods!, 'minutes').toString()}
            onChange={onTimeBtwnPeriodsDuration}
          />
          <span className={styles.innerSpanText}>
            &nbsp;=&nbsp;
            {eventData &&
              periods_per_game! *
                getTimeFromString(period_duration!, 'minutes') +
                getTimeFromString(pre_game_warmup!, 'minutes') +
                getTimeFromString(time_btwn_periods!, 'minutes')}
            Minutes Total Runtime
          </span>
        </div>
        <div className={styles['es-details-third']}>
          <Checkbox
            options={esDetailsOptions}
            formLabel=""
            onChange={onEsDetailsChange}
          />
        </div>
      </div>
    </SectionDropdown>
  );
};

export default EventStructureSection;
