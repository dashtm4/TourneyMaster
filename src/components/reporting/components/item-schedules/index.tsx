import React from 'react';
import PDFTableSchedule from 'pdg-layouts/table-schedule';
import PDFTableFieldsSchedule from 'pdg-layouts/table-fields-schedule';
import {
  HeadingLevelThree,
  ButtonLoad,
  SelectMultiple,
  CardMessage,
} from 'components/common';
import { CardMessageTypes } from 'components/common/card-message/types';
import {
  onPDFSave,
  onXLSXSave,
  getAllTeamCardGames,
  getSelectDayOptions,
  getGamesByDays,
} from 'helpers';
import { ButtonVariant, ButtonColors, DefaultSelectValues } from 'common/enums';
import { IEventDetails, ISchedule, IPool, IDivision } from 'common/models';
import { getScheduleTableXLSX } from '../../helpers';
import { IGame, calculateDays } from 'components/common/matrix-table/helper';
import { IField } from 'common/models/schedule/fields';
import ITimeSlot from 'common/models/schedule/timeSlots';
import { IScheduleFacility } from 'common/models/schedule/facilities';
import { ITeamCard } from 'common/models/schedule/teams';
import styles from './styles.module.scss';
import { IBracketGame } from 'components/playoffs/bracketGames';

const STYLES_ICOM_WARNING = {
  fill: '#FFCB00',
  height: '25px',
  width: '30px',
};

interface Props {
  event: IEventDetails;
  timeSlots: ITimeSlot[];
  facilities: IScheduleFacility[];
  games: IGame[];
  fields: IField[];
  schedule: ISchedule;
  teamCards: ITeamCard[];
  bracketGames: IBracketGame[];
  pools: IPool[];
  playoffTimeSlots?: ITimeSlot[];
  divisions: IDivision[];
}

const ItemSchedules = ({
  event,
  facilities,
  timeSlots,
  games,
  fields,
  schedule,
  teamCards,
  pools,
  bracketGames,
  playoffTimeSlots,
  divisions,
}: Props) => {
  const [isAllowDownload, changeAllowDownload] = React.useState<boolean>(true);
  const [activeDay, changeActiveDay] = React.useState<string[]>([
    DefaultSelectValues.ALL,
  ]);

  React.useEffect(() => {
    changeAllowDownload(activeDay.length > 0);
  }, [activeDay]);

  const eventDays = calculateDays(teamCards);
  const allTeamCardGames = getAllTeamCardGames(
    teamCards,
    games,
    eventDays,
    bracketGames,
    playoffTimeSlots,
    divisions
  );
  const gamesByDay = getGamesByDays(allTeamCardGames, activeDay);
  const selectDayOptions = getSelectDayOptions(eventDays);

  const onChangeActiveDay = (avtiveDay: string[] | null) => {
    if (activeDay) {
      changeActiveDay(avtiveDay as string[]);
    }
  };

  const onScheduleTableSave = () =>
    onPDFSave(
      <PDFTableSchedule
        event={event}
        games={gamesByDay}
        fields={fields}
        timeSlots={timeSlots}
        facilities={facilities}
        schedule={schedule}
        teamCards={teamCards}
      />,
      event.event_name
        ? `${event.event_name} Master Schedule - PDF`
        : 'Schedule'
    );

  const onHeatmapScheduleTableSave = () =>
    onPDFSave(
      <PDFTableSchedule
        event={event}
        games={gamesByDay}
        fields={fields}
        timeSlots={timeSlots}
        facilities={facilities}
        schedule={schedule}
        teamCards={teamCards}
        isHeatMap={true}
      />,
      event.event_name
        ? `${event.event_name} Master Schedule (HeatMap) - PDF`
        : 'Schedule'
    );

  const onScheduleFieldsSave = () =>
    onPDFSave(
      <PDFTableFieldsSchedule
        event={event}
        games={gamesByDay}
        fields={fields}
        timeSlots={timeSlots}
        facilities={facilities}
        schedule={schedule}
      />,
      event.event_name
        ? `${event.event_name} Master Fields Schedule`
        : 'FieldsSchedule'
    );

  const onScheduleTableXLSXSave = async () => {
    const { header, body } = await getScheduleTableXLSX(
      event,
      schedule,
      games,
      teamCards,
      facilities,
      fields,
      pools
    );

    onXLSXSave(header, body, 'Master Schedule');
  };

  return (
    <li>
      <section>
        <header className={styles.headerWrapper}>
          <HeadingLevelThree>
            <span>Schedules</span>
          </HeadingLevelThree>
          <SelectMultiple
            options={selectDayOptions}
            value={activeDay}
            onChange={onChangeActiveDay}
            primaryValue={DefaultSelectValues.ALL}
            isFormControlRow={true}
            label="Day Selection: "
          />
        </header>
        <ul className={styles.scheduleList}>
          <li>
            <ButtonLoad
              loadFunc={onScheduleTableSave}
              variant={ButtonVariant.TEXT}
              color={ButtonColors.SECONDARY}
              isDisabled={!isAllowDownload}
              label="Master Schedule - PDF"
            />
          </li>
          <li>
            <ButtonLoad
              loadFunc={onHeatmapScheduleTableSave}
              variant={ButtonVariant.TEXT}
              color={ButtonColors.SECONDARY}
              isDisabled={!isAllowDownload}
              label="Master Schedule (with Heatmap) - PDF"
            />
          </li>
          <li>
            <ButtonLoad
              loadFunc={onScheduleFieldsSave}
              variant={ButtonVariant.TEXT}
              color={ButtonColors.SECONDARY}
              isDisabled={!isAllowDownload}
              label="Master Schedule (Field by Field) - PDF"
            />
          </li>
          <li>
            <ButtonLoad
              loadFunc={onScheduleTableXLSXSave}
              variant={ButtonVariant.TEXT}
              color={ButtonColors.SECONDARY}
              label="Master Schedule - XLSX"
            />
          </li>
        </ul>
        {!isAllowDownload && (
          <CardMessage
            type={CardMessageTypes.WARNING}
            iconStyle={STYLES_ICOM_WARNING}
          >
            Select day to download PDF-files
          </CardMessage>
        )}
      </section>
    </li>
  );
};

export default ItemSchedules;
