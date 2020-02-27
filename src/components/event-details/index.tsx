import React, { Component } from 'react';
import { Dispatch, bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import {
  getEventDetails,
  saveEventDetails,
  createEvent,
  uploadFiles,
} from './logic/actions';
import { EventDetailsDTO, IIconFile } from './logic/model';
import { IAppState } from './logic/reducer';

import PrimaryInformationSection from './primary-information';
import EventStructureSection from './event-structure';
import MediaAssetsSection from './media-assets';
import PlayoffsSection from './playoffs';

import { Button, HeadingLevelTwo, Paper, Loader } from 'components/common';
import styles from './styles.module.scss';
import { eventState } from './state';

interface IMapStateProps {
  event: IAppState;
}

interface Props extends IMapStateProps {
  match: any;
  getEventDetails: (eventId: string) => void;
  saveEventDetails: (event: Partial<EventDetailsDTO>) => void;
  createEvent: (event: Partial<EventDetailsDTO>) => void;
  uploadFiles: (files: IIconFile[]) => void;
}

type State = {
  eventId: string | undefined;
  event?: Partial<EventDetailsDTO>;
  error: boolean;
};

class EventDetails extends Component<Props, State> {
  state: State = {
    eventId: undefined,
    event: undefined,
    error: false,
  };

  componentDidMount() {
    this.checkEventExistence();
  }

  componentDidUpdate(prevProps: Props) {
    const { data, isEventLoading } = this.props.event;

    if (isEventLoading !== prevProps.event.isEventLoading) {
      this.setState({
        eventId: data?.event_id,
        event: data,
      });
    }
  }

  checkEventExistence = () => {
    const { eventId } = this.props.match?.params;

    if (eventId) {
      this.setState({ eventId });

      this.props.getEventDetails(eventId);

      return;
    }

    this.setState({
      event: eventState(),
    });
  };

  onChange = (name: string, value: any) => {
    this.setState(({ event }) => ({
      event: {
        ...event,
        [name]: value,
      },
    }));
  };

  onFileUpload = (files: IIconFile[]) => {
    this.props.uploadFiles(files);
  };

  onSave = () => {
    const { event, eventId } = this.state;
    if (!event) return;

    if (eventId) {
      this.props.saveEventDetails(event);
      return;
    }

    this.props.createEvent(event);
  };

  render() {
    const eventTypeOptions = ['Tournament', 'Showcase'];

    const { event } = this.state;
    const { isEventLoading } = this.props.event;

    return !event || isEventLoading ? (
      <Loader />
    ) : (
      <div className={styles.container}>
        <Paper sticky={true}>
          <div className={styles.paperWrapper}>
            <Button
              label="Save"
              color="primary"
              variant="contained"
              onClick={this.onSave}
            />
          </div>
        </Paper>
        <HeadingLevelTwo margin="24px 0">Event Details</HeadingLevelTwo>
        <PrimaryInformationSection eventData={event} onChange={this.onChange} />
        <EventStructureSection
          eventData={event}
          eventTypeOptions={eventTypeOptions}
          onChange={this.onChange}
        />
        <PlayoffsSection eventData={event} onChange={this.onChange} />
        <MediaAssetsSection onFileUpload={this.onFileUpload} />
      </div>
    );
  }
}

interface IRootState {
  event: IAppState;
}

const mapStateToProps = (state: IRootState): IMapStateProps => ({
  event: state.event,
});

const mapDispatchToProps = (dispatch: Dispatch) =>
  bindActionCreators(
    {
      getEventDetails,
      saveEventDetails,
      createEvent,
      uploadFiles,
    },
    dispatch
  );

export default connect(mapStateToProps, mapDispatchToProps)(EventDetails);
