import React, { Component } from 'react';
import { bindActionCreators, Dispatch } from 'redux';
import { connect } from 'react-redux';

import { Button, Paper, HeadingLevelTwo } from 'components/common';
import { ICalendarEvent } from 'common/models/calendar';
import CreateDialog from './create-dialog';
import styles from './styles.module.scss';
import CalendarBody from './body';

import { getCalendarEvents, createCalendarEvent } from './logic/actions';
import { appropriateEvents } from './calendar.helper';

interface IMapStateToProps {
  eventsList?: ICalendarEvent[];
  calendarEventCreated: boolean;
}

interface IProps extends IMapStateToProps {
  createCalendarEvent: (event: ICalendarEvent) => void;
  getCalendarEvents: () => void;
}

interface IState {
  dialogOpen: boolean;
}

class Calendar extends Component<IProps, IState> {
  state = {
    dialogOpen: false,
  };

  componentDidMount() {
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
  }

  onSave() {
    console.log('SAVE');
  }

  onCreatePressed = () => {
    this.setState({ dialogOpen: true });
  };

  onDialogClose = () => {
    this.setState({ dialogOpen: false });
  };

  onCalendarEvent = (calendarEvent: ICalendarEvent) => {
    this.onDialogClose();
    this.props.createCalendarEvent(calendarEvent);
  };

  render() {
    const { dialogOpen } = this.state;
    const { eventsList } = this.props;

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
          onDialogClose={this.onDialogClose}
          onSave={this.onCalendarEvent}
        />

        <CalendarBody
          eventsList={appropriateEvents(eventsList || [])}
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
  bindActionCreators({ getCalendarEvents, createCalendarEvent }, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(Calendar);
