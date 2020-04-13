/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';

import {
  SectionDropdown,
  HeadingLevelThree,
  Input,
  Radio,
  Checkbox,
  Button,
} from 'components/common';
import { EventMenuTitles } from 'common/enums';

import styles from '../styles.module.scss';
import { getTimeFromString, timeToString } from 'helpers';
import { IEventDetails } from 'common/models';
import waiverHubLogo from 'assets/WaiverHubLogo.png';
import MultipleDatesPicker from '@randex/material-ui-multiple-dates-picker';

type InputTargetValue = React.ChangeEvent<HTMLInputElement>;

enum esDetailsEnum {
  'Back to Back Game Warning' = 'back_to_back_warning',
  'Require Waivers' = 'waivers_required',
  'Synchronize via WaiverHub data' = 'waiverhub_utilized',
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
  eventData: Partial<IEventDetails>;
  onChange: any;
  isSectionExpand: boolean;
}

const EventStructureSection: React.FC<Props> = ({
  eventTypeOptions,
  eventData,
  onChange,
  isSectionExpand,
}: Props) => {
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
    event_type,
    min_num_of_games,
    waivers_required,
    waiverhub_utilized,
    league_dates,
  } = eventData;

  useEffect(() => {
    if (!event_type) onChange('event_type', eventTypeOptions[0]);

    if (!periods_per_game) onChange('periods_per_game', 2);
  });

  const [isDatePickerOpen, setDatePickerOpen] = useState(false);

  const onEventTypeChange = (e: InputTargetValue) => {
    onChange('event_type', e.target.value);
  };

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
      checked: Boolean(waivers_required),
    },
  ];

  const onDatesSubmit = (dates: Date[]) => {
    const parsedDates = JSON.stringify(
      dates.map((date: Date) => date.toISOString())
    );
    onChange('league_dates', parsedDates);
    setDatePickerOpen(false);
  };

  const leagueDates = league_dates
    ? JSON.parse(league_dates).map((date: Date) => new Date(date))
    : [];

  return (
    <SectionDropdown
      id={EventMenuTitles.EVENT_STRUCTURE}
      type="section"
      panelDetailsType="flat"
      useBorder={true}
      expanded={isSectionExpand}
    >
      <HeadingLevelThree>
        <span className={styles.blockHeading}>Event Structure</span>
      </HeadingLevelThree>
      <div className={styles.esDetails}>
        <div className={styles.esDetailsFirst}>
          <div className={styles.column}>
            <Radio
              options={eventTypeOptions}
              formLabel="Event Type"
              onChange={onEventTypeChange}
              checked={event_type || ''}
            />
            {event_type === 'League' ? (
              <div>
                <Button
                  label="Select Dates"
                  color="secondary"
                  variant="text"
                  onClick={() => setDatePickerOpen(!isDatePickerOpen)}
                />
                <MultipleDatesPicker
                  open={isDatePickerOpen}
                  selectedDates={leagueDates}
                  onCancel={() => setDatePickerOpen(false)}
                  onSubmit={onDatesSubmit}
                  submitButtonText="Select"
                />
              </div>
            ) : null}
          </div>
          <div className={styles.column}>
            <Radio
              options={timeDivisionOptions}
              formLabel="Time Division"
              onChange={onChangePeriod}
              checked={timeDivisionEnum[periods_per_game!] || ''}
            />
          </div>
          <div className={styles.column}>
            <Checkbox
              options={resultsDisplayOptions}
              formLabel="Results Display"
              onChange={onResultsChange}
            />
          </div>
          <div className={styles.column}>
            <Input
              fullWidth={true}
              type="number"
              label="Min # of Game Guarantee"
              value={min_num_of_games || ''}
              onChange={onGameNumChange}
            />
          </div>
        </div>
        <div className={styles.esDetailsSecond}>
          <Input
            fullWidth={true}
            endAdornment="Minutes"
            label="Pregame Warmup"
            type="number"
            value={getTimeFromString(pre_game_warmup!, 'minutes').toString()}
            onChange={onPregameWarmupChange}
          />
          <span className={styles.innerSpanText}>&nbsp;+&nbsp;</span>
          <Input
            fullWidth={true}
            endAdornment="Minutes"
            label="Time Division Duration"
            type="number"
            value={getTimeFromString(period_duration!, 'minutes').toString()}
            onChange={onTimeDivisionDuration}
          />
          <span className={styles.innerSpanText}>
            &nbsp;({periods_per_game})&nbsp;+&nbsp;
          </span>
          <Input
            fullWidth={true}
            endAdornment="Minutes"
            label="Time Between Periods"
            type="number"
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
            &nbsp; Minutes Total Runtime
          </span>
        </div>
        <div className={styles.esDetailsThird}>
          <Checkbox
            options={esDetailsOptions}
            formLabel=""
            onChange={onEsDetailsChange}
          />
          <div className={styles.waiverHubWrapper}>
            <Checkbox
              options={[
                {
                  label: 'Connect to WaiverHub',
                  checked: Boolean(waiverhub_utilized),
                },
              ]}
              formLabel=""
              onChange={onEsDetailsChange}
            />
            <a
              target="_blank"
              rel="noopener noreferrer"
              href="https://www.waiverhub.com/"
            >
              <img
                src={waiverHubLogo}
                style={{ width: '150px' }}
                alt="Waiverhub logo"
              />
            </a>
          </div>
        </div>
      </div>
    </SectionDropdown>
  );
};

export default EventStructureSection;
