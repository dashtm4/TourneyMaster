import React, { Component } from 'react';
import { bindActionCreators, Dispatch } from 'redux';
import { connect } from 'react-redux';

import { Button, Paper, HeadingLevelTwo } from 'components/common';
import { ICalendarEvent, IEvent } from 'common/models/calendar';
import CreateDialog from './create-dialog';
import styles from './styles.module.scss';
import CalendarBody from './body';

import { getCalendarEvents, createCalendarEvent } from './logic/actions';

interface IProps {
  eventsList?: IEvent[];
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
          eventsList={eventsList}
          onCreatePressed={this.onCreatePressed}
        />
      </div>
    );
  }
}

interface IRootState {
  calendar: {
    events?: IEvent[];
  };
}

const mapStateToProps = (state: IRootState) => ({
  eventsList: state.calendar.events,
});

const mapDispatchToProps = (dispatch: Dispatch) =>
  bindActionCreators({ getCalendarEvents, createCalendarEvent }, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(Calendar);
