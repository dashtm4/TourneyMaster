import React, { useState } from 'react';
import styles from './styles.module.scss';
import { format } from 'date-fns';
import { capitalize } from 'lodash-es';
import DeleteIcon from '@material-ui/icons/Delete';
import CreateIcon from '@material-ui/icons/Create';
import Button from 'components/common/buttons/button';
import Input from 'components/common/input';
import { ICalendarEvent } from 'common/models';
import { DatePicker } from 'components/common';

type InputTargetValue = React.ChangeEvent<HTMLInputElement>;

interface IConfirmModalProps {
  clickedEvent: any;
  onDeleteCalendarEvent: (id: string) => void;
  onClose: () => void;
  setClickedEvent: any;
  onUpdateCalendarEventDetails: (event: Partial<ICalendarEvent>) => void;
}
const InfoModal = ({
  clickedEvent,
  onDeleteCalendarEvent,
  onClose,
  onUpdateCalendarEventDetails,
  setClickedEvent,
}: IConfirmModalProps) => {
  console.log(clickedEvent);

  const [editable, setEditable] = useState(false);

  const updateEvent = (name: string, value: any) =>
    setClickedEvent({ ...clickedEvent, [name]: value });

  const onTitleChange = (event: InputTargetValue) =>
    updateEvent('cal_event_title', event.target.value);

  const onTagChange = (event: InputTargetValue) =>
    updateEvent('cal_event_tag', event.target.value);

  const onDescriptionChange = (event: InputTargetValue) =>
    updateEvent('cal_event_desc', event.target.value);

  const onDateFromChange = (value: Date | string) =>
    updateEvent('cal_event_startdate', new Date(value).toISOString());

  const onDateToChange = (value: Date | string) =>
    updateEvent('cal_event_enddate', new Date(value).toISOString());

  const onEventDateTimeChange = (value: Date | string) => {
    setClickedEvent({
      ...clickedEvent,
      cal_event_datetime: new Date(value).toISOString(),
      cal_event_startdate: new Date(value).toISOString(),
      cal_event_enddate: new Date(value).toISOString(),
    });
  };

  const renderButtons = () => {
    return !editable ? (
      <div>
        <Button
          label="Delete"
          variant="text"
          color="secondary"
          type="dangerLink"
          icon={<DeleteIcon style={{ fill: '#FF0F19' }} />}
          onClick={() => {
            onDeleteCalendarEvent(clickedEvent.cal_event_id);
            onClose();
          }}
        />
        <Button
          label="Edit"
          variant="text"
          color="secondary"
          icon={<CreateIcon />}
          onClick={() => setEditable(!editable)}
        />
      </div>
    ) : (
      <div>
        <Button
          label="Cancel"
          variant="text"
          color="secondary"
          onClick={() => onClose()}
        />
        <Button
          label="Save"
          variant="contained"
          color="primary"
          onClick={() => {
            onUpdateCalendarEventDetails(clickedEvent);
            onClose();
          }}
        />
      </div>
    );
  };

  const renderTitle = (editable: boolean) => {
    return editable ? (
      <Input
        width="248px"
        value={clickedEvent.cal_event_title || ''}
        onChange={onTitleChange}
      />
    ) : (
      clickedEvent.cal_event_title || '—'
    );
  };

  const renderType = (editable: boolean) => {
    return editable ? (
      <Input
        width="248px"
        value={clickedEvent.cal_event_type || ''}
        disabled={true}
      />
    ) : (
      clickedEvent.cal_event_type || '—'
    );
  };

  const renderTag = (editable: boolean) => {
    return editable ? (
      <Input
        width="248px"
        value={clickedEvent.cal_event_tag || ''}
        onChange={onTagChange}
      />
    ) : (
      clickedEvent.cal_event_tag || '—'
    );
  };

  const renderDescription = (editable: boolean) => {
    return editable ? (
      <Input
        width="248px"
        value={clickedEvent.cal_event_desc || ''}
        onChange={onDescriptionChange}
      />
    ) : (
      clickedEvent.cal_event_desc || '—'
    );
  };

  const renderDate = (editable: boolean) => {
    switch (clickedEvent.cal_event_type) {
      case 'event':
        return editable ? (
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <DatePicker
              width="120px"
              label=""
              type="date"
              viewType="input"
              value={clickedEvent.cal_event_startdate}
              onChange={onDateFromChange}
            />
            <span>&ndash;</span>
            <DatePicker
              width="120px"
              label=""
              type="date"
              viewType="input"
              value={
                clickedEvent.cal_event_enddate ||
                clickedEvent.cal_event_startdate
              }
              onChange={onDateToChange}
            />
          </div>
        ) : (
          `${format(clickedEvent.cal_event_startdate, 'MM-dd-yyyy')} - ${format(
            clickedEvent.cal_event_enddate
              ? clickedEvent.cal_event_enddate
              : clickedEvent.cal_event_startdate,
            'MM-dd-yyyy'
          )}`
        );
      case 'reminder':
      case 'task':
        return editable ? (
          <DatePicker
            width="248px"
            label=""
            type="date-time"
            viewType="input"
            value={clickedEvent.cal_event_datetime}
            onChange={onEventDateTimeChange}
          />
        ) : (
          `${format(clickedEvent.cal_event_startdate, 'MM-dd-yyyy, h:mm a')}`
        );
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.sectionTitle}>{`${capitalize(
        clickedEvent.cal_event_type
      )} Details`}</div>
      <div>
        <div
          className={!editable ? styles.sectionItem : styles.sectionItemEdit}
        >
          <span className={styles.title}>Title:</span> {renderTitle(editable)}
        </div>
        <div
          className={!editable ? styles.sectionItem : styles.sectionItemEdit}
        >
          <span className={styles.title}>Type:</span>
          {renderType(editable)}
        </div>
        <div
          className={!editable ? styles.sectionItem : styles.sectionItemEdit}
        >
          <span className={styles.title}>
            {clickedEvent.cal_event_type === 'event' ? 'Date:' : 'Due Date:'}
          </span>{' '}
          {renderDate(editable)}
        </div>
        <div
          className={!editable ? styles.sectionItem : styles.sectionItemEdit}
        >
          <span className={styles.title}>Tag:</span> {renderTag(editable)}
        </div>
        <div
          className={!editable ? styles.sectionItem : styles.sectionItemEdit}
        >
          <span className={styles.title}>Description:</span>{' '}
          {renderDescription(editable)}
        </div>
      </div>
      <div className={styles.buttonsGroup}>{renderButtons()}</div>
    </div>
  );
};

export default InfoModal;
