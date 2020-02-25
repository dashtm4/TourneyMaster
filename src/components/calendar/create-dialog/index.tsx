/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';
import { Dialog } from '@material-ui/core';
import { capitalize } from 'lodash-es';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendar, faClock } from '@fortawesome/free-regular-svg-icons';
import { faAt, faMapPin, faAlignLeft } from '@fortawesome/free-solid-svg-icons';

import { Input, DatePicker, Button, Checkbox } from 'components/common';
import { buttonTypeEvent, ButtonTypeEvent } from '../calendar.helper';
import { ICalendarEvent } from 'common/models/calendar';
import { IDateSelect } from '../calendar.model';
import styles from './styles.module.scss';

import { isCalendarEventValid } from '../logic/helper';

type InputTargetValue = React.ChangeEvent<HTMLInputElement>;

interface IProps {
  dialogOpen: boolean;
  onDialogClose: () => void;
  onSave: (data: ICalendarEvent) => void;
  dateSelect: IDateSelect;
}

const defaultCalendarEvent = (): ICalendarEvent => ({
  title: '',
  dateFrom: new Date().toString(),
  dateTo: new Date().toString(),
  location: '',
  eventTag: '',
  type: 'event',
  timeFrom: new Date().toString(),
  timeTo: new Date().toString(),
  description: '',
  setReminder: false,
});

export default (props: IProps) => {
  const { dialogOpen, onDialogClose, onSave, dateSelect } = props;
  const { left, top, date } = dateSelect;

  useEffect(() => {
    if (!dialogOpen)
      setTimeout(() => setCalendarEvent(defaultCalendarEvent()), 200);
  }, [dialogOpen]);

  useEffect(
    () =>
      setCalendarEvent({
        ...calendarEvent,
        dateFrom: date!,
        dateTo: date!,
      }),
    [dateSelect]
  );

  const [calendarEvent, setCalendarEvent] = useState<ICalendarEvent>(
    defaultCalendarEvent()
  );

  const buttonTypeEvents: ButtonTypeEvent[] = ['event', 'reminder', 'task'];

  const changeEventType = (type: ButtonTypeEvent) => {
    setCalendarEvent({ ...calendarEvent, type });
  };

  const updateEvent = (name: string, value: any) =>
    setCalendarEvent({ ...calendarEvent, [name]: value });

  const onDateFromChange = (value: Date | string) =>
    updateEvent('dateFrom', String(value));

  const onDateToChange = (value: Date | string) =>
    updateEvent('dateTo', String(value));

  const onTimeFromChange = (value: Date | string) =>
    updateEvent('timeFrom', String(value));

  const onTimeToChange = (value: Date | string) =>
    updateEvent('timeTo', String(value));

  const onChange = (event: InputTargetValue) => {
    const { name, value } = event?.target;
    updateEvent(name, value);
  };

  const toggleReminder = () =>
    updateEvent('setReminder', !calendarEvent.setReminder);

  const onSaveClicked = () => onSave(calendarEvent);

  const renderButtons = (eventTypes: ButtonTypeEvent[]) =>
    eventTypes.map((el: ButtonTypeEvent) => (
      <Button
        key={el}
        label={capitalize(el)}
        color="primary"
        variant="contained"
        onClick={changeEventType.bind(undefined, el)}
        type={buttonTypeEvent(el, calendarEvent.type)}
      />
    ));

  return (
    <Dialog
      className={styles.container}
      open={dialogOpen}
      style={{ left, top }}
      PaperProps={{ classes: { root: styles.dialogPaper } }}
      BackdropProps={{ invisible: true }}
    >
      <div className={styles.wrapper}>
        <div className={styles.innerWrapper}>
          <div className={styles.leftColumn}>
            <Input
              name="title"
              width="284px"
              onChange={onChange}
              value={calendarEvent.title}
              placeholder="Title"
            />
            <div className={styles.withIconWrapper}>
              <FontAwesomeIcon icon={faCalendar} />
              <DatePicker
                width="115px"
                label=""
                type="date"
                viewType="input"
                value={calendarEvent.dateFrom}
                onChange={onDateFromChange}
              />
              <span>&ndash;</span>
              <DatePicker
                width="115px"
                label=""
                type="date"
                viewType="input"
                value={calendarEvent.dateTo}
                onChange={onDateToChange}
              />
            </div>
            <div className={styles.withIconWrapper}>
              <FontAwesomeIcon icon={faMapPin} />
              <Input
                name="location"
                width="257px"
                onChange={onChange}
                value={calendarEvent.location}
                placeholder="Location"
              />
            </div>
            <div className={styles.withIconWrapper}>
              <FontAwesomeIcon icon={faAt} />
              <Input
                name="eventTag"
                width="257px"
                onChange={onChange}
                value={calendarEvent.eventTag}
                placeholder="Event Tag"
              />
            </div>
          </div>

          <div className={styles.rightColumn}>
            <div className={styles.buttonsWrapper}>
              {renderButtons(buttonTypeEvents)}
            </div>
            <div className={styles.withIconWrapper}>
              <FontAwesomeIcon icon={faClock} />
              <DatePicker
                width="100px"
                label=""
                type="time"
                viewType="input"
                value={calendarEvent.timeFrom}
                onChange={onTimeFromChange}
              />
              <span>&ndash;</span>
              <DatePicker
                width="100px"
                label=""
                type="time"
                viewType="input"
                value={calendarEvent.timeTo}
                onChange={onTimeToChange}
              />
            </div>
            <div className={styles.withIconWrapper}>
              <FontAwesomeIcon icon={faAlignLeft} />
              <Input
                name="description"
                width="231px"
                onChange={onChange}
                value={calendarEvent.description}
                placeholder="Description"
              />
            </div>
            <div className={styles.checkboxWrapper}>
              <Checkbox
                options={[
                  { label: 'Set Reminder', checked: calendarEvent.setReminder },
                ]}
                onChange={toggleReminder}
              />
            </div>
          </div>
        </div>
        <div className={styles.controlWrapper}>
          <Button
            onClick={onDialogClose}
            label="Cancel"
            variant="text"
            color="secondary"
          />
          <Button
            disabled={!isCalendarEventValid(calendarEvent)}
            onClick={onSaveClicked}
            label="Save"
            variant="contained"
            color="primary"
          />
        </div>
      </div>
    </Dialog>
  );
};
