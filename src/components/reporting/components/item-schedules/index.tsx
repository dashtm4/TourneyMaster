import React from 'react';
import PDFTableSchedule from 'pdg-layouts/table-schedule';
import PDFTableFieldsSchedule from 'pdg-layouts/table-fields-schedule';
import { HeadingLevelThree, Button } from 'components/common';
import { onPDFSave, mapGamesByField, onXLSXSave } from 'helpers';
import { ButtonVarian, ButtonColors } from 'common/enums';
import { IEventDetails, ISchedule } from 'common/models';
import { getScheduleTableXLSX } from '../../helpers';
import {
  IGame,
  settleTeamsPerGames,
} from 'components/common/matrix-table/helper';
import { IField } from 'common/models/schedule/fields';
import ITimeSlot from 'common/models/schedule/timeSlots';
import { IScheduleFacility } from 'common/models/schedule/facilities';
import { ITeamCard } from 'common/models/schedule/teams';
import styles from './styles.module.scss';

interface Props {
  event: IEventDetails;
  timeSlots: ITimeSlot[];
  facilities: IScheduleFacility[];
  games: IGame[];
  fields: IField[];
  schedule: ISchedule;
  teamCards: ITeamCard[];
}

const ItemSchedules = ({
  event,
  facilities,
  timeSlots,
  games,
  fields,
  schedule,
  teamCards,
}: Props) => {
  const filledGames = settleTeamsPerGames(games, teamCards);
  const mappedGames = mapGamesByField(filledGames, fields);

  const onScheduleTableSave = async () =>
    onPDFSave(
      <PDFTableSchedule
        event={event}
        games={mappedGames}
        fields={fields}
        timeSlots={timeSlots}
        facilities={facilities}
        schedule={schedule}
      />,
      event.event_name ? `${event.event_name} Master Schedule` : 'Schedule'
    );

  const onHeatmapScheduleTableSave = async () =>
    onPDFSave(
      <PDFTableSchedule
        event={event}
        games={mappedGames}
        fields={fields}
        timeSlots={timeSlots}
        facilities={facilities}
        schedule={schedule}
        isHeatMap={true}
      />,
      event.event_name
        ? `${event.event_name} Master Schedule (HeatMap)`
        : 'Schedule'
    );

  const onScheduleFieldsSave = async () =>
    onPDFSave(
      <PDFTableFieldsSchedule
        event={event}
        games={mappedGames}
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
    );

    onXLSXSave(header, body, 'Master Schedule');
  };

  return (
    <li>
      <div className={styles.titleWrapper}>
        <HeadingLevelThree>
          <span>Schedules</span>
        </HeadingLevelThree>
      </div>
      <ul className={styles.scheduleList}>
        <li>
          <Button
            onClick={onScheduleTableSave}
            variant={ButtonVarian.TEXT}
            color={ButtonColors.SECONDARY}
            label="Master Schedule"
          />
        </li>
        <li>
          <Button
            onClick={onHeatmapScheduleTableSave}
            variant={ButtonVarian.TEXT}
            color={ButtonColors.SECONDARY}
            label="Master Schedule (with Heatmap)"
          />
        </li>
        <li>
          <Button
            onClick={onScheduleFieldsSave}
            variant={ButtonVarian.TEXT}
            color={ButtonColors.SECONDARY}
            label="Master Schedule (by fields)"
          />
        </li>
        <li>
          <Button
            onClick={onScheduleTableXLSXSave}
            variant={ButtonVarian.TEXT}
            color={ButtonColors.SECONDARY}
            label="Master Schedule (XLSX)"
          />
        </li>
      </ul>
    </li>
  );
};

export default ItemSchedules;
