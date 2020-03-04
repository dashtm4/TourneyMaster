/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';
import { Calendar, View } from '@fullcalendar/core';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import listPlugin from '@fullcalendar/list';
import { capitalize } from 'lodash-es';
import { format } from 'date-fns/esm';

import { getViewType, buttonTypeView, ViewType } from '../calendar.helper';
import { DatePicker, Button } from 'components/common';
import styles from './styles.module.scss';
import { IEvent } from 'common/models/calendar';
import { IDateSelect } from '../calendar.model';
import './main.scss';

interface IProps {
  onCreatePressed: () => void;
  eventsList?: IEvent[];
  onDatePressed: (dateSelect: IDateSelect) => void;
}

interface EventArg {
  date: Date;
  dateStr: string;
  allDay: boolean;
  resource?: any;
  dayEl: HTMLElement;
  jsEvent: MouseEvent;
  view: View;
}

export default (props: IProps) => {
  const { eventsList, onCreatePressed, onDatePressed } = props;

  const header = {
    left: '',
    center: '',
    right: '',
  };

  // const header = {
  //   left: 'prev,next today',
  //   center: 'title',
  //   right: 'dayGridMonth,timeGridWeek,timeGridDay,listWeek'
  // }

  const eventTimeFormat = {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
    meridiem: false,
  };

  const [currentDate, changeCurrentDate] = useState(new Date());
  const [currentView, changeCurrentView] = useState<ViewType>('month');

  const calendarRef = React.createRef<FullCalendar>();
  const plugins = [
    dayGridPlugin,
    timeGridPlugin,
    interactionPlugin,
    listPlugin,
  ];
  const columnHeaderFormat = {
    weekday: 'long',
    day: 'numeric',
  };

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

  const handleDateClick = (arg: EventArg) => {
    const left = arg.jsEvent.x;
    const top = arg.jsEvent.y;
    const date = format(arg.date, 'yyyy-MM-dd HH:mm:ss');

    const dateSelect = {
      left,
      top,
      date,
    };

    onDatePressed(dateSelect);
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

  const renderDatePicker = () => {
    const view = currentView === 'month' ? 'month' : 'date';
    const dateFormat = currentView === 'month' ? 'MMMM yyyy' : 'MMMM dd, yyyy';
    return (
      <DatePicker
        views={[view]}
        width="250px"
        label=""
        type="date"
        dateFormat={dateFormat}
        value={String(currentDate)}
        onChange={onDateChange}
      />
    );
  };

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
        {renderDatePicker()}
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
