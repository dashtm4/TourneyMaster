import React from 'react';
import PDFTableSchedule from 'pdg-layouts/table-schedule';
import PDFTableFieldsSchedule from 'pdg-layouts/table-fields-schedule';
import { Modal, HeadingLevelTwo, Button } from 'components/common';
import { onPDFSave } from 'helpers';
import { BindingAction } from 'common/models';
import { ButtonColors, ButtonVarian } from 'common/enums';
import { IEventDetails, ISchedule } from 'common/models';
import { IGame } from 'components/common/matrix-table/helper';
import { IField } from 'common/models/schedule/fields';
import ITimeSlot from 'common/models/schedule/timeSlots';
import { IScheduleFacility } from 'common/models/schedule/facilities';
import styles from './styles.module.scss';

interface Props {
  event: IEventDetails;
  timeSlots: ITimeSlot[];
  facilities: IScheduleFacility[];
  games: IGame[];
  fields: IField[];
  schedule: ISchedule;
  isOpen: boolean;
  onClose: BindingAction;
}

const PopupSaveReporting = ({
  event,
  facilities,
  timeSlots,
  games,
  fields,
  schedule,
  isOpen,
  onClose,
}: Props) => {
  const onScheduleTableSave = async () =>
    onPDFSave(
      <PDFTableSchedule
        event={event}
        games={games}
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
        games={games}
        fields={fields}
        timeSlots={timeSlots}
        facilities={facilities}
        schedule={schedule}
        isHeatMap={true}
      />,
      event.event_name
        ? `${event.event_name} Master Schedule(HeatMap)`
        : 'Schedule'
    );

  const onScheduleFieldsSave = async () =>
    onPDFSave(
      <PDFTableFieldsSchedule
        event={event}
        games={games}
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
        <div className={styles.titleWrapper}>
          <HeadingLevelTwo>Save as:</HeadingLevelTwo>
        </div>
        <ul className={styles.linkList}>
          <li className={styles.link}>
            <h3>Schedule:</h3>
            <ul className={styles.downloadLinkList}>
              <li className={styles.dowloadLinkWrapper}>
                <b>Schedule table</b>
                <Button
                  onClick={onScheduleTableSave}
                  variant={ButtonVarian.TEXT}
                  color={ButtonColors.SECONDARY}
                  label="Download"
                />
              </li>
              <li className={styles.dowloadLinkWrapper}>
                <b>Schedule table(with Heatmap)</b>
                <Button
                  onClick={onHeatmapScheduleTableSave}
                  variant={ButtonVarian.TEXT}
                  color={ButtonColors.SECONDARY}
                  label="Download"
                />
              </li>
            </ul>
          </li>
          <li className={styles.link}>
            <h3>Fields' schedule: </h3>
            <ul className={styles.downloadLinkList}>
              <li className={styles.dowloadLinkWrapper}>
                <b>Fields' schedule table</b>
                <Button
                  onClick={onScheduleFieldsSave}
                  variant={ButtonVarian.TEXT}
                  color={ButtonColors.SECONDARY}
                  label="Download"
                />
              </li>
            </ul>
          </li>
        </ul>
        <div className={styles.btnWrapper}>
          <Button
            onClick={onClose}
            variant={ButtonVarian.TEXT}
            color={ButtonColors.SECONDARY}
            label="Cancel"
          />
        </div>
      </section>
    </Modal>
  );
};

export default PopupSaveReporting;
