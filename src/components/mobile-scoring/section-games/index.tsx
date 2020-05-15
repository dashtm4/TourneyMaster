import React, { useState, useEffect } from 'react';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import { makeStyles, Theme } from '@material-ui/core/styles';
import Api from 'api/api';
import TabGames from '../tab-games';
import { mapScheduleGamesWithNames, formatTimeSlot } from 'helpers';
import { Loader, Select, Radio } from 'components/common';
import {
  IEventDetails,
  ISchedule,
  IFacility,
  IField,
  ISchedulesGame,
  ITeam,
  IFetchedBracket,
} from 'common/models';
import { ScheduleStatuses, BracketStatuses } from 'common/enums';
import {
  getTabTimes,
  getDayOptions,
  geEventDates,
  getTeamWithFacility,
  getGamesByScoreMode,
  mapScoringBracketsWithNames,
} from '../helpers';
import styles from './styles.module.scss';
import { IInputEvent } from 'common/types';
import { IMobileScoringGame, ScoresRaioOptions } from '../common';
import { IPlayoffGame } from 'common/models/playoffs/bracket-game';

const DEFAULT_TAB = 0;

interface Props {
  event: IEventDetails;
}

const useStyles = makeStyles((theme: Theme) => ({
  tabs: {
    borderRight: `1px solid ${theme.palette.divider}`,
  },
}));

const SectionGames = ({ event }: Props) => {
  const classes = useStyles();
  const [isLoading, changeLoading] = useState<boolean>(false);
  const [isLoaded, changeLoaded] = useState<boolean>(false);
  const [activeDay, changeActiveDay] = useState<string | null>(null);
  const [activeTab, changeActiveTab] = useState<number>(DEFAULT_TAB);
  const [scoreMode, changeScoreMode] = useState<ScoresRaioOptions>(
    ScoresRaioOptions.ALL
  );
  const [originGames, setOriginGames] = useState<ISchedulesGame[]>([]);
  const [originBracktGames, setOriginBracktGames] = useState<IPlayoffGame[]>(
    []
  );
  const [gamesWithNames, setGamesWithTames] = useState<IMobileScoringGame[]>(
    []
  );

  useEffect(() => {
    (async () => {
      changeActiveDay(null);
      changeActiveTab(0);
      setOriginGames([]);
      setOriginBracktGames([]);
      setGamesWithTames([]);
      changeLoading(true);
      changeLoaded(false);
      changeScoreMode(ScoresRaioOptions.ALL);

      const schedules = (await Api.get(
        `/schedules?event_id=${event.event_id}`
      )) as ISchedule[];
      const brackets = (await Api.get(
        `brackets_details?event_id=${event.event_id}`
      )) as IFetchedBracket[];
      const teams = (await Api.get(
        `/teams?event_id=${event.event_id}`
      )) as ITeam[];
      const facilities = (await Api.get(
        `/facilities?event_id=${event.event_id}`
      )) as IFacility[];
      const fields = (
        await Promise.all(
          facilities.map(facility =>
            Api.get(`/fields?facilities_id=${facility.facilities_id}`)
          )
        )
      ).flat() as IField[];

      const publishedSchedule = schedules.find(
        it => it.is_published_YN === ScheduleStatuses.Published
      );
      const publishedBracket = brackets.find(
        it => it.is_published_YN === BracketStatuses.Published
      );

      const games = publishedSchedule
        ? ((await Api.get(
            `/games?schedule_id=${publishedSchedule.schedule_id}`
          )) as ISchedulesGame[])
        : [];
      const bracketGames = publishedBracket
        ? ((await Api.get(
            `/games_brackets?bracket_id=${publishedBracket.bracket_id}`
          )) as IPlayoffGame[])
        : [];

      const gamesWithTeams = games.filter(
        it => it.away_team_id || it.away_team_id
      );

      const gamesWithNames = mapScheduleGamesWithNames(
        teams,
        fields,
        gamesWithTeams
      );

      const gameWithFacility = getTeamWithFacility(
        gamesWithNames,
        facilities,
        fields
      );

      const mappedBracketGames = mapScoringBracketsWithNames(
        teams,
        facilities,
        fields,
        bracketGames
      );

      const allGames = [...gameWithFacility, ...mappedBracketGames];

      setGamesWithTames(allGames);
      setOriginGames(games);
      setOriginBracktGames(bracketGames);

      changeLoading(false);
      changeLoaded(true);
    })();
  }, [event]);

  const changeGameWithName = (changedGame: IMobileScoringGame) => {
    // const changedOriginGames = originGames.map(it =>
    //   it.game_id === changedGame.game_id ? changedGame : it
    // );
    // setOriginGames(changedOriginGames);

    const changedGamesWithGames = gamesWithNames.map(game =>
      game.id === changedGame.id ? changedGame : game
    );

    setGamesWithTames(changedGamesWithGames);
  };

  const onChangeActiveTimeSlot = (
    _evt: React.ChangeEvent<{}>,
    newValue: number
  ) => {
    changeActiveTab(newValue);
  };

  const onChangeActiveDay = (evt: IInputEvent) => {
    changeActiveDay(evt.target.value);
    changeActiveTab(DEFAULT_TAB);
  };

  const onChangeScoreMode = (evt: IInputEvent) => {
    changeScoreMode(evt.target.value as ScoresRaioOptions);
  };

  if (isLoading || !isLoaded) {
    return <Loader />;
  }

  const eventDays = geEventDates(gamesWithNames);
  const eventDayOptions = getDayOptions(eventDays);
  const tabTimes = getTabTimes(activeDay, gamesWithNames);

  const activeTime = tabTimes.find((_, idx) => idx === activeTab);
  const originGamesByTime = originGames.filter(
    it => it.game_date === activeDay && it.start_time === activeTime
  );
  const gamesWithNamesByTime = gamesWithNames.filter(
    it => it.gameDate === activeDay && it.startTime === activeTime
  );

  const gameByScoreMode = getGamesByScoreMode(gamesWithNamesByTime, scoreMode);

  return (
    <section>
      <div className={styles.dayWrapper}>
        <h2 className={styles.dayTitle}>Date:</h2>
        <Select
          onChange={onChangeActiveDay}
          value={activeDay || ''}
          options={eventDayOptions}
          width="100%"
          isFullWith={true}
        />
      </div>
      <div className={styles.radionWrapper}>
        <Radio
          row={true}
          checked={scoreMode}
          onChange={onChangeScoreMode}
          options={Object.values(ScoresRaioOptions)}
        />
      </div>
      {activeDay && (
        <div className={styles.tabsWrapper}>
          <Tabs
            orientation="vertical"
            variant="scrollable"
            value={activeTab}
            onChange={onChangeActiveTimeSlot}
            className={classes.tabs}
          >
            {tabTimes.map((it, idx) => (
              <Tab label={formatTimeSlot(it)} key={idx} />
            ))}
          </Tabs>
          <TabGames
            gamesWithName={gameByScoreMode}
            originGames={originGamesByTime}
            originBracktGames={originBracktGames}
            changeGameWithName={changeGameWithName}
          />
        </div>
      )}
    </section>
  );
};

export default SectionGames;
