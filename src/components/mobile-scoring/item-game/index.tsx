import React, { useState } from 'react';
import { Button, Toasts } from 'components/common';
import { ISchedulesGame } from 'common/models';
import { ButtonVarian, ButtonColors } from 'common/enums';
import { IMobileScoringGame } from '../common';
import { IInputEvent } from 'common/types';
import Api from 'api/api';
import styles from './styles.module.scss';

interface Props {
  gameWithNames: IMobileScoringGame;
  originGame: ISchedulesGame;
}

enum GameScoreTypes {
  AWAY_TEAM_SCORE = 'away_team_score',
  HOME_TEAM_SCORE = 'home_team_score',
}

const ItemGame = ({ gameWithNames, originGame }: Props) => {
  const [wasSaved, changeSavedState] = useState<boolean>(false);
  const [chanedOriginGame, changeOriginGame] = useState<ISchedulesGame>(
    originGame
  );

  const onChangeOriginTeam = ({ target }: IInputEvent) => {
    const { name, value } = target;

    changeOriginGame({ ...chanedOriginGame, [name]: value });
  };

  const onSave = async () => {
    const unpdetedGame: ISchedulesGame = {
      ...chanedOriginGame,
      away_team_score: chanedOriginGame.away_team_score || null,
      home_team_score: chanedOriginGame.home_team_score || null,
    };

    await Api.put('/games', unpdetedGame);

    changeSavedState(true);

    Toasts.successToast('Changes successfully saved.');
  };

  return (
    <li className={styles.gameWrapper}>
      <b className={styles.fieldName}>
        {gameWithNames.facilityName
          ? `${gameWithNames.facilityName} - ${gameWithNames.fieldName}`
          : gameWithNames.fieldName}
      </b>
      <div className={styles.teamNames}>
        <p className={styles.teamNameWrapper}>
          <span className={styles.teamName}>{gameWithNames.awayTeamName}</span>
          <input
            onChange={onChangeOriginTeam}
            value={chanedOriginGame?.away_team_score || ''}
            name={GameScoreTypes.AWAY_TEAM_SCORE}
            type="number"
            min="0"
          />
        </p>
        <p className={styles.teamNameWrapper}>
          <span className={styles.teamName}>{gameWithNames.homeTeamName}</span>
          <input
            onChange={onChangeOriginTeam}
            value={chanedOriginGame?.home_team_score || ''}
            name={GameScoreTypes.HOME_TEAM_SCORE}
            type="number"
            min="0"
          />
        </p>
      </div>
      <div className={styles.updateBtnWrapper}>
        <Button
          onClick={onSave}
          variant={ButtonVarian.TEXT}
          color={ButtonColors.SECONDARY}
          label={wasSaved ? 'Edit' : 'Save'}
        />
      </div>
    </li>
  );
};

export default ItemGame;
