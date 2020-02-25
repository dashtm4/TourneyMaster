import React, { Component } from 'react';
import { bindActionCreators, Dispatch } from 'redux';
import { connect } from 'react-redux';

import { Button, Paper, HeadingLevelTwo } from 'components/common';
import { ICalendarEvent } from 'common/models/calendar';
import CreateDialog from './create-dialog';
import styles from './styles.module.scss';
import CalendarBody from './body';

import { getCalendarEvents, saveCalendar } from './logic/actions';
import {
  appropriateEvents,
  calculateDialogPosition,
  setBlankNewEvent,
} from './calendar.helper';
import { IDateSelect } from './calendar.model';

interface IMapStateToProps {
  eventsList?: ICalendarEvent[];
  calendarEventCreated: boolean;
}

interface IProps extends IMapStateToProps {
  getCalendarEvents: () => void;
  saveCalendar: (data: ICalendarEvent[]) => void;
}

interface IState {
  dialogOpen: boolean;
  blankNewEvent?: ICalendarEvent;
  dateSelect: IDateSelect;
  eventsList?: ICalendarEvent[];
}

class Calendar extends Component<IProps, IState> {
  state = {
    dialogOpen: false,
    blankNewEvent: undefined,
    eventsList: this.props.eventsList,
    dateSelect: {
      left: 0,
      top: 0,
      date: undefined,
    },
  };

  componentDidMount() {
    window.addEventListener('resize', this.updateDimensions);
    this.props.getCalendarEvents();
  }

  componentDidUpdate(prevProps: IProps) {
    const { calendarEventCreated: prevEventCreated } = prevProps;
    const { calendarEventCreated } = this.props;
    if (
      prevEventCreated !== calendarEventCreated &&
      calendarEventCreated === true
    ) {
      this.props.getCalendarEvents();
    }

    if (!prevProps.eventsList?.length && !this.state.eventsList) {
      this.setState({
        eventsList: this.props.eventsList,
      });
    }
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.updateDimensions);
  }

  updateDimensions = () => {
    const left = window.innerWidth / 2 - 300 / 2;
    const top = window.innerHeight / 2 - 134 / 2;
    this.setState({ dateSelect: { left, top } });
  };

  onSave = () => {
    const { eventsList } = this.state;
    this.props.saveCalendar(eventsList!);
  };

  onDatePressed = (dateSelect: IDateSelect) => {
    const { left, top, date } = dateSelect;
    const { leftPosition, topPosition } = calculateDialogPosition(left, top);

    this.setState({
      dateSelect: {
        left: leftPosition,
        top: topPosition,
        date,
      },
    });

    this.onDialogOpen();
    this.setBlankEvent(date);
  };

  onCreatePressed = () => {
    this.updateDimensions();
    this.onDialogOpen();
  };

  setBlankEvent = (date?: string) => {
    this.setState({
      blankNewEvent: setBlankNewEvent(date),
    });
  };

  onDialogOpen = () => {
    this.setState({ dialogOpen: true });
  };

  onDialogClose = () => {
    this.setState({ dialogOpen: false, blankNewEvent: undefined });
  };

  onCalendarEvent = (calendarEvent: ICalendarEvent) => {
    this.onDialogClose();
    this.setState(({ eventsList }) => ({
      eventsList: [...eventsList, calendarEvent],
    }));
  };

  render() {
    const { dialogOpen, dateSelect, blankNewEvent, eventsList } = this.state;

    const events = blankNewEvent
      ? eventsList?.concat(blankNewEvent!)
      : eventsList;

    return (
      <div className={styles.container}>
        <Paper>
          <div className={styles.paperWrapper}>
            <Button
              label="Save"
              color="primary"
              variant="contained"
              onClick={this.onSave}
            />
          </div>
        </Paper>

        <HeadingLevelTwo margin="24px 0">Calendar</HeadingLevelTwo>

        <CreateDialog
          dialogOpen={dialogOpen}
          dateSelect={dateSelect}
          onDialogClose={this.onDialogClose}
          onSave={this.onCalendarEvent}
        />

        <CalendarBody
          eventsList={appropriateEvents(events || [])}
          onDatePressed={this.onDatePressed}
          onCreatePressed={this.onCreatePressed}
        />
      </div>
    );
  }
}

interface IRootState {
  calendar: {
    events?: ICalendarEvent[];
    eventJustCreated: boolean;
  };
}

const mapStateToProps = (state: IRootState): IMapStateToProps => ({
  eventsList: state.calendar.events,
  calendarEventCreated: state.calendar.eventJustCreated,
});

const mapDispatchToProps = (dispatch: Dispatch) =>
  bindActionCreators({ getCalendarEvents, saveCalendar }, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(Calendar);