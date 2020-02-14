import React, { useState, useEffect } from 'react';
import { Calendar } from '@fullcalendar/core';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { capitalize } from 'lodash-es';

import { getViewType, buttonTypeView, ViewType } from '../calendar.helper';
import { DatePicker, Button } from 'components/common';
import styles from './styles.module.scss';
import { IEvent } from 'common/models/calendar';
import './main.scss';

interface IProps {
  onCreatePressed: () => void;
  eventsList?: IEvent[];
}

export default (props: IProps) => {
  const { eventsList, onCreatePressed } = props;

  const header = {
    left: '',
    center: '',
    right: '',
  };

  const eventTimeFormat = {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
    meridiem: false,
  };

  const [currentDate, changeCurrentDate] = useState(new Date());
  const [currentView, changeCurrentView] = useState<ViewType>('month');

  const calendarRef = React.createRef<FullCalendar>();
  const plugins = [dayGridPlugin, timeGridPlugin, interactionPlugin];
  const columnHeaderFormat = { weekday: 'long' };

  let calendarApi: Calendar;

  useEffect(() => {
    calendarApi = calendarRef!.current!.getApi();
  });

  const changeView = (view: 'day' | 'week' | 'month') => {
    const viewType = getViewType(view);
    calendarApi.changeView(viewType);
    changeCurrentView(view);
  };

  const onDateChange = (date: any) => {
    calendarApi.gotoDate(date);
    changeCurrentDate(date);
  };

  const handleDateClick = (arg: any) => {
    console.log(arg);
  };

  const handleEventClick = (arg: any) => {
    console.log(arg);
  };

  const onEventDrop = () => {};

  const renderButton = (buttonType: ViewType) => (
    <Button
      label={capitalize(buttonType)}
      color="primary"
      variant="contained"
      onClick={changeView.bind(undefined, buttonType)}
      type={buttonTypeView(buttonType, currentView)}
    />
  );

  const renderBadge = (color: string, label: string) => (
    <div className={styles.badgeWrapper}>
      <div style={{ background: color }} />
      <span>{label}</span>
    </div>
  );

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <Button
          label="Create +"
          color="primary"
          variant="contained"
          onClick={onCreatePressed}
        />
        <DatePicker
          views={['month']}
          width="200px"
          label=""
          type="date"
          dateFormat="MMMM yyyy"
          value={String(currentDate)}
          onChange={onDateChange}
        />
        <div className={styles.buttonsWrapper}>
          {renderButton('day')}
          {renderButton('week')}
          {renderButton('month')}
        </div>
      </div>
      <div>
        <FullCalendar
          firstDay={1}
          droppable={true}
          editable={true}
          defaultView="dayGridMonth"
          eventTimeFormat={eventTimeFormat}
          columnHeaderFormat={columnHeaderFormat}
          plugins={plugins}
          header={header}
          events={eventsList}
          ref={calendarRef}
          dateClick={handleDateClick}
          eventClick={handleEventClick}
          eventDrop={onEventDrop}
        />
        <div className={styles.badgeContainer}>
          {renderBadge('#1c315f', 'Event')}
          {renderBadge('#6a6a6a', 'Reminder')}
          {renderBadge('#00a3ea', 'Task')}
        </div>
      </div>
    </div>
  );
};
