import React from 'react';
import PDFTableSchedule from 'pdg-layouts/table-schedule';
import PDFTableFieldsSchedule from 'pdg-layouts/table-fields-schedule';
import {
  Modal,
  HeadingLevelTwo,
  ButtonLoad,
  Button,
  SelectMultiple,
  CardMessage,
} from 'components/common';
import { CardMessageTypes } from 'components/common/card-message/types';
import { onPDFSave, getSelectDayOptions, getGamesByDays } from 'helpers';
import { BindingAction } from 'common/models';
import { ButtonColors, ButtonVariant, DefaultSelectValues } from 'common/enums';
import { IEventDetails, ISchedule } from 'common/models';
import { IGame } from 'components/common/matrix-table/helper';
import { IField } from 'common/models/schedule/fields';
import ITimeSlot from 'common/models/schedule/timeSlots';
import { IScheduleFacility } from 'common/models/schedule/facilities';
import styles from './styles.module.scss';
import { ITeamCard } from 'common/models/schedule/teams';

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
  eventDays: string[];
  isOpen: boolean;
  onClose: BindingAction;
}

const PopupSaveReporting = ({
  event,
  facilities,
  timeSlots,
  teamCards,
  games,
  fields,
  schedule,
  eventDays,
  isOpen,
  onClose,
}: Props) => {
  const [isAllowDownload, changeAllowDownload] = React.useState<boolean>(true);
  const [activeDay, changeActiveDay] = React.useState<string[]>([
    DefaultSelectValues.ALL,
  ]);

  React.useEffect(() => {
    changeAllowDownload(activeDay.length > 0);
  }, [activeDay]);

  const gamesByDay = getGamesByDays(games, activeDay);
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
      event.event_name ? `${event.event_name} Master Schedule` : 'Schedule'
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
        ? `${event.event_name} Master Schedule (HeatMap)`
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

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <section className={styles.section}>
        <header className={styles.headerWrapper}>
          <HeadingLevelTwo>Select:</HeadingLevelTwo>
          <SelectMultiple
            options={selectDayOptions}
            value={activeDay}
            onChange={onChangeActiveDay}
            primaryValue={DefaultSelectValues.ALL}
            isFormControlRow={true}
            label="Date Selection: "
          />
        </header>
        <ul className={styles.linkList}>
          <li className={styles.link}>
            <h3>Full Schedule:</h3>
            <ul className={styles.downloadLinkList}>
              <li className={styles.dowloadLinkWrapper}>
                <b>Master Schedule (no colors)</b>
                <ButtonLoad
                  loadFunc={onScheduleTableSave}
                  variant={ButtonVariant.TEXT}
                  color={ButtonColors.SECONDARY}
                  isDisabled={!isAllowDownload}
                  label="Download"
                />
              </li>
              <li className={styles.dowloadLinkWrapper}>
                <b>Master Schedule (Colored Heatmap)</b>
                <ButtonLoad
                  loadFunc={onHeatmapScheduleTableSave}
                  variant={ButtonVariant.TEXT}
                  color={ButtonColors.SECONDARY}
                  isDisabled={!isAllowDownload}
                  label="Download"
                />
              </li>
            </ul>
          </li>
          <li className={styles.link}>
            <h3>Fields Schedule: </h3>
            <ul className={styles.downloadLinkList}>
              <li className={styles.dowloadLinkWrapper}>
                <b>Field-by-Field Schedule</b>
                <ButtonLoad
                  loadFunc={onScheduleFieldsSave}
                  variant={ButtonVariant.TEXT}
                  color={ButtonColors.SECONDARY}
                  isDisabled={!isAllowDownload}
                  label="Download"
                />
              </li>
            </ul>
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
        <div className={styles.btnWrapper}>
          <Button
            onClick={onClose}
            variant={ButtonVariant.TEXT}
            color={ButtonColors.SECONDARY}
            label="Cancel"
          />
        </div>
      </section>
    </Modal>
  );
};

export default PopupSaveReporting;
