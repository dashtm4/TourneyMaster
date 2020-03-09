/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';
import { Dialog } from '@material-ui/core';
import { capitalize } from 'lodash-es';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendar } from '@fortawesome/free-regular-svg-icons';
import { faAt, faAlignLeft, faMapPin } from '@fortawesome/free-solid-svg-icons';

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
  onSave: (data: Partial<ICalendarEvent>) => void;
  dateSelect: IDateSelect;
}

const defaultCalendarEvent = (): Partial<ICalendarEvent> => ({
  cal_event_title: '',
  cal_event_startdate: new Date().toString(),
  cal_event_enddate: new Date().toString(),
  cal_event_location: '',
  cal_event_tag: '',
  cal_event_type: 'event',
  cal_event_desc: '',
  has_reminder: 0,
});

export default (props: IProps) => {
  const { dialogOpen, onDialogClose, onSave, dateSelect } = props;
  const { left, top, date } = dateSelect;
  console.log(date);
  useEffect(() => {
    if (!dialogOpen)
      setTimeout(() => setCalendarEvent(defaultCalendarEvent()), 200);
  }, [dialogOpen]);

  useEffect(
    () =>
      setCalendarEvent({
        ...calendarEvent,
        cal_event_startdate: date! || calendarEvent.cal_event_startdate,
        cal_event_enddate: date! || calendarEvent.cal_event_enddate,
      }),
    [dateSelect]
  );

  const [calendarEvent, setCalendarEvent] = useState<Partial<ICalendarEvent>>(
    defaultCalendarEvent()
  );

  const buttonTypeEvents: ButtonTypeEvent[] = ['event', 'reminder', 'task'];

  const changeEventType = (type: ButtonTypeEvent) => {
    setCalendarEvent({ ...calendarEvent, cal_event_type: type });
  };

  const updateEvent = (name: string, value: any) =>
    setCalendarEvent({ ...calendarEvent, [name]: value });

  const onDateFromChange = (value: Date | string) =>
    updateEvent('cal_event_startdate', String(value));

  const onDateToChange = (value: Date | string) =>
    updateEvent('cal_event_enddate', String(value));

  // const onTimeFromChange = (value: Date | string) =>
  //   updateEvent('timeFrom', String(value));

  // const onTimeToChange = (value: Date | string) =>
  //   updateEvent('timeTo', String(value));

  const onChange = (event: InputTargetValue) => {
    const { name, value } = event?.target;
    updateEvent(name, value);
  };

  const toggleReminder = () =>
    updateEvent('hasReminder', !calendarEvent.has_reminder);

  const onSaveClicked = () => onSave(calendarEvent);

  const renderButtons = (eventTypes: ButtonTypeEvent[]) =>
    eventTypes.map((el: ButtonTypeEvent) => (
      <Button
        key={el}
        label={capitalize(el)}
        color="primary"
        variant="contained"
        onClick={changeEventType.bind(undefined, el)}
        type={buttonTypeEvent(el, calendarEvent.cal_event_type!)}
      />
    ));
  console.log(calendarEvent);
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
              name="cal_event_title"
              width="284px"
              onChange={onChange}
              value={calendarEvent.cal_event_title}
              placeholder="Title"
            />
            <div className={styles.withIconWrapper}>
              <FontAwesomeIcon icon={faCalendar} />
              <DatePicker
                width="257px"
                label=""
                type="date-time"
                viewType="input"
                value={calendarEvent.cal_event_startdate}
                onChange={onDateFromChange}
              />
              <span>&ndash;</span>
            </div>
            <div className={styles.withIconWrapper}>
              <FontAwesomeIcon icon={faMapPin} />
              <Input
                name="cal_event_location"
                width="257px"
                onChange={onChange}
                value={calendarEvent.cal_event_location}
                placeholder="Location"
              />
            </div>
            <div className={styles.withIconWrapper}>
              <FontAwesomeIcon icon={faAt} />
              <Input
                name="cal_event_tag"
                width="257px"
                onChange={onChange}
                value={calendarEvent.cal_event_tag}
                placeholder="Event Tag"
              />
            </div>
          </div>

          <div className={styles.rightColumn}>
            <div className={styles.buttonsWrapper}>
              {renderButtons(buttonTypeEvents)}
            </div>
            <DatePicker
              width="257px"
              label=""
              type="date-time"
              viewType="input"
              value={calendarEvent.cal_event_enddate}
              onChange={onDateToChange}
            />
            {/* <div className={styles.withIconWrapper}>
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
            </div> */}
            <div className={styles.withIconWrapper}>
              <FontAwesomeIcon icon={faAlignLeft} />
              <Input
                name="cal_event_desc"
                width="231px"
                onChange={onChange}
                value={calendarEvent.cal_event_desc}
                placeholder="Description"
              />
            </div>
            <div className={styles.checkboxWrapper}>
              <Checkbox
                options={[
                  {
                    label: 'Set Reminder',
                    checked: Boolean(calendarEvent.has_reminder),
                  },
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
