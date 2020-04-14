import React from 'react';
import moment from 'moment';
import { ISchedulesGameWithNames } from 'common/models';
import styles from './styles.module.scss';

interface Props {
  games: ISchedulesGameWithNames[];
}

const ListStatistic = ({ games }: Props) => {
  const completedGames = games.filter(
    it => it.awayTeamScore !== null || it.homeTeamScore !== null
  );

  const lastUpd = Math.max(
    ...games.map(it =>
      it.updatedTime
        ? Number(new Date(it.updatedTime))
        : Number(new Date(it.createTime))
    )
  );

  return (
    <ul className={styles.statisticList}>
      <li>
        <b>Games Complete:</b> {completedGames.length}/{games.length}
      </li>
      <li>
        <b>Last Web Publishing: </b>
        <time dateTime={new Date(lastUpd).toString()}>
          {lastUpd ? moment(lastUpd).format('LLLL') : 'No scores published'}
        </time>
      </li>
    </ul>
  );
};

export default ListStatistic;
