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
import { ISchedule } from 'common/models/schedule';
import { stringToLink, getIcon } from 'helpers';
import { EventMenuTitles, Icons } from 'common/enums';

const STYLES_INFO_ICON = {
  marginLeft: '5px',
  fill: '#00A3EA',
};

type InputTargetValue = React.ChangeEvent<HTMLInputElement>;

interface IProps {
  schedule?: ISchedule;
  onChange: (name: string, value: any) => void;
  onViewEventMatrix: () => void;
}

export default (props: IProps) => {
  const { schedule, onChange, onViewEventMatrix } = props;
  const gameStartOptions = ['10'];

  const localChange = (event: InputTargetValue) => {
    const { name, value } = event.target;
    onChange(name, value);
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
          {renderSectionCell('Number of Fields', `${8}`, true)}
          {renderSectionCell('Play Time Window', `${8.3} - ${5.3}`, true)}
          {renderSectionCell(
            'Teams Registered/Max',
            `${schedule?.num_teams}/${24}`,
            true
          )}
        </div>
        <div className={styles.taSecond}>
          <Select
            options={gameStartOptions.map(option => ({
              label: option,
              value: option,
            }))}
            value={gameStartOptions[0]}
            label="Games Start On"
            name="gamesStartOn"
            onChange={localChange}
            width="100px"
            align="center"
          />
          <fieldset className={styles.numberGames}>
            <legend>Min/Max # of Games</legend>
            <div className={styles.numberGamesWrapper}>
              <Input width="50px" minWidth="50px" type="number" />
              <Input width="50px" minWidth="50px" type="number" />
            </div>
          </fieldset>
          <Input width="100px" type="number" align="center" label="Warmup" />
          <Input
            width="100px"
            type="number"
            align="center"
            label="Division Duration(2)"
          />
          <Input
            width="100px"
            type="number"
            align="center"
            label="Time Between Periods"
          />
        </div>
        <div className={styles.taThird}>
          {renderSectionCell('Game Runtime', `${50} Minutes`)}
          {renderSectionCell('Total Game Slots', `${128}`)}
          {renderSectionCell('Average Games per Team', `${4}`)}
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
