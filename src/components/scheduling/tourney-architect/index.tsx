import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye } from '@fortawesome/free-regular-svg-icons';

import styles from '../styles.module.scss';
import {
  SectionDropdown,
  HeadingLevelThree,
  Button,
  Select,
  Input,
  Tooltip,
  CardMessage,
} from 'components/common';
import { CardMessageTypes } from 'components/common/card-message/types';
import {
  stringToLink,
  getIcon,
  getTimeFromString,
  timeToString,
  formatTimeSlot,
} from 'helpers';
import { EventMenuTitles, Icons } from 'common/enums';
import { IConfigurableSchedule } from 'common/models';
import { BindingAction } from 'common/models';
import { ArchitectFormFields } from '../types';

const STYLES_INFO_ICON = {
  marginLeft: '5px',
  fill: '#00A3EA',
};

const gameStartOptions = ['5', '10', '15'];

type InputTargetValue = React.ChangeEvent<HTMLInputElement>;

interface IProps {
  schedule: IConfigurableSchedule;
  onChange: (name: string, value: any) => void;
  onViewEventMatrix: BindingAction;
}

export default (props: IProps) => {
  const { schedule, onChange, onViewEventMatrix } = props;

  const localChange = ({ target: { name, value } }: InputTargetValue) => {
    onChange(name, value);
  };

  const onTimeChage = ({ target: { name, value } }: InputTargetValue) => {
    onChange(name, timeToString(Number(value)));
  };

  const renderSectionCell = (name: string, value: any, infoIcon?: boolean) => (
    <div className={styles.sectionCell}>
      <p>
        <b>{`${name}: `}</b>
        {value}
      </p>
      {infoIcon && (
        <Tooltip
          type="info"
          title="Play Time is based on Facilities availability"
        >
          {getIcon(Icons.INFO, STYLES_INFO_ICON)}
        </Tooltip>
      )}
    </div>
  );

  return (
    <SectionDropdown
      type="section"
      isDefaultExpanded={true}
      useBorder={true}
      id={stringToLink(EventMenuTitles.TOURNEY_ARCHITECT)}
    >
      <HeadingLevelThree>
        <span className={styles.blockHeading}>
          {EventMenuTitles.TOURNEY_ARCHITECT}
        </span>
      </HeadingLevelThree>
      <div className={styles.tourneyArchitect}>
        <div className={styles.taFirst}>
          {renderSectionCell(
            'Number of Fields',
            `${schedule.num_fields}`,
            true
          )}
          {renderSectionCell(
            'Play Time Window',
            `${formatTimeSlot(schedule.time_slots[0].time)} - ${formatTimeSlot(
              schedule.time_slots[schedule.time_slots.length - 1].time
            )}`,
            true
          )}
          {renderSectionCell(
            'Teams Registered/Max',
            `${schedule.num_teams}/${schedule.num_teams}`,
            true
          )}
        </div>
        <div className={styles.taSecond}>
          <Select
            options={gameStartOptions.map(option => ({
              label: option,
              value: option,
            }))}
            onChange={localChange}
            value={schedule.games_start_on}
            name={ArchitectFormFields.GAMES_START_ON}
            label="Games Start On"
            width="100px"
            align="center"
          />
          <fieldset className={styles.numberGames}>
            <legend>Min/Max # of Games</legend>
            <div className={styles.numberGamesWrapper}>
              <Input
                onChange={localChange}
                value={schedule.min_num_games || ''}
                name={ArchitectFormFields.MIN_NUM_GAMES}
                width="50px"
                minWidth="50px"
                type="number"
              />
              <Input
                onChange={localChange}
                value={schedule.max_num_games || ''}
                name={ArchitectFormFields.MAX_NUM_GAMES}
                width="50px"
                minWidth="50px"
                type="number"
              />
            </div>
          </fieldset>
          <Input
            onChange={onTimeChage}
            value={getTimeFromString(
              schedule.pre_game_warmup!,
              'minutes'
            ).toString()}
            name={ArchitectFormFields.PRE_GAME_WARMUP}
            width="100px"
            type="number"
            align="center"
            label="Warmup"
          />
          <Input
            onChange={onTimeChage}
            value={getTimeFromString(
              schedule.period_duration!,
              'minutes'
            ).toString()}
            name={ArchitectFormFields.PERIOD_DURATION}
            width="100px"
            type="number"
            align="center"
            label={`Division Duration(${schedule.periods_per_game})`}
          />
          <Input
            onChange={onTimeChage}
            value={getTimeFromString(
              schedule.time_btwn_periods!,
              'minutes'
            ).toString()}
            name={ArchitectFormFields.TIME_BTWN_PERIODS}
            width="100px"
            type="number"
            align="center"
            label="Time Between Periods"
          />
        </div>
        <div className={styles.taThird}>
          {renderSectionCell(
            'Game Runtime',
            `${schedule.periods_per_game *
              getTimeFromString(schedule.period_duration!, 'minutes') +
              getTimeFromString(schedule.pre_game_warmup!, 'minutes') +
              getTimeFromString(
                schedule.time_btwn_periods!,
                'minutes'
              )} Minutes`
          )}
          {renderSectionCell('Total Game Slots', `${128}`)}
          {renderSectionCell(
            'Average Games per Team',
            `${Math.floor(
              Number(schedule.max_num_games) +
                Number(schedule.min_num_games) / 2
            )}`
          )}
          <Button
            label="View Matrix"
            icon={<FontAwesomeIcon icon={faEye} />}
            color="secondary"
            variant="text"
            onClick={onViewEventMatrix}
          />
        </div>
        <CardMessage type={CardMessageTypes.EMODJI_OBJECTS}>
          Changing the game time and games start on will affect the total game
          slots and average games per team. Event Details and Facilities can
          also be edited to optimize the schedule.
        </CardMessage>
      </div>
    </SectionDropdown>
  );
};
