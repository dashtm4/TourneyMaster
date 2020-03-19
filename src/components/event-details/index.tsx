import React, { Component } from 'react';
import { Dispatch, bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import {
  getEventDetails,
  saveEventDetails,
  createEvent,
  removeFiles,
  deleteEvent,
} from './logic/actions';
import { EventDetailsDTO, IIconFile } from './logic/model';
import { IEventState } from './logic/reducer';

import PrimaryInformationSection from './primary-information';
import EventStructureSection from './event-structure';
import MediaAssetsSection from './media-assets';
import PlayoffsSection from './playoffs';

import {
  Button,
  HeadingLevelTwo,
  Paper,
  Loader,
  PopupConfirm,
} from 'components/common';
import { IUploadFile, BindingCbWithOne } from 'common/models';
import { uploadFile } from 'helpers';
import styles from './styles.module.scss';
import { eventState } from './state';
import DeleteIcon from '@material-ui/icons/Delete';

interface IMapStateProps {
  event: IEventState;
}

interface Props extends IMapStateProps {
  match: any;
  getEventDetails: (eventId: string) => void;
  saveEventDetails: (event: Partial<EventDetailsDTO>) => void;
  createEvent: (event: Partial<EventDetailsDTO>) => void;
  uploadFiles: (files: IIconFile[]) => void;
  removeFiles: (files: IIconFile[]) => void;
  deleteEvent: BindingCbWithOne<string>;
}

type State = {
  eventId: string | undefined;
  event?: Partial<EventDetailsDTO>;
  error: boolean;
  expanded: boolean[];
  expandAll: boolean;
  isModalOpen: boolean;
};

class EventDetails extends Component<Props, State> {
  state: State = {
    eventId: undefined,
    event: undefined,
    error: false,
    expanded: [true, true, true, true],
    expandAll: false,
    isModalOpen: false,
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

  onFileUpload = async (files: IUploadFile[]) => {
    for await (let file of files) {
      const uploadedFile = await uploadFile(file);
      const { key } = uploadedFile as Storage;

      this.onChange(file.destinationType, key);
    }
  };

  onFileRemove = (files: IUploadFile[]) => {
    this.props.removeFiles(files);
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

  onToggleAll = () => {
    this.setState({
      expanded: this.state.expanded.map(_e => this.state.expandAll),
      expandAll: !this.state.expandAll,
    });
  };

  onToggleOne = (indexPanel: number) => {
    this.setState({
      expanded: this.state.expanded.map((e: boolean, index: number) =>
        index === indexPanel ? !e : e
      ),
    });
  };

  onDeleteClick = () => {
    this.setState({ isModalOpen: true });
  };

  onModalClose = () => {
    this.setState({ isModalOpen: false });
  };

  onDeleteEvent = () => {};

  render() {
    const eventTypeOptions = ['Tournament', 'Showcase'];
    const { event } = this.state;
    const { isEventLoading } = this.props.event;

    if (!event || isEventLoading) {
      return <Loader />;
    }

    return (
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
        <div className={styles.headingContainer}>
          <HeadingLevelTwo margin="24px 0">Event Details</HeadingLevelTwo>
          <Button
            label={this.state.expandAll ? 'Expand All' : 'Collapse All'}
            variant="text"
            color="secondary"
            onClick={this.onToggleAll}
          />
        </div>
        <Button
          label="Delete Event"
          variant="text"
          color="secondary"
          type="dangerLink"
          icon={<DeleteIcon style={{ fill: '#FF0F19' }} />}
          onClick={this.onDeleteClick}
        />
        <PrimaryInformationSection
          eventData={event}
          onChange={this.onChange}
          index={0}
          expanded={this.state.expanded[0]}
          onToggleOne={this.onToggleOne}
        />
        <EventStructureSection
          eventData={event}
          eventTypeOptions={eventTypeOptions}
          onChange={this.onChange}
          index={1}
          expanded={this.state.expanded[1]}
          onToggleOne={this.onToggleOne}
        />
        <PlayoffsSection
          eventData={event}
          onChange={this.onChange}
          index={2}
          expanded={this.state.expanded[2]}
          onToggleOne={this.onToggleOne}
        />
        <MediaAssetsSection
          onFileUpload={this.onFileUpload}
          onFileRemove={this.onFileRemove}
          index={3}
          expanded={this.state.expanded[3]}
          onToggleOne={this.onToggleOne}
          logo={event.desktop_icon_URL}
        />
        <PopupConfirm
          message="Are you sure you want to delete this event? All data related to this event will be deleted too."
          isOpen={this.state.isModalOpen}
          onClose={this.onModalClose}
          onCanceClick={this.onModalClose}
          onYesClick={() => {
            this.props.deleteEvent(event.event_id!);
          }}
          type="warning"
        />
      </div>
    );
  }
}

interface IRootState {
  event: IEventState;
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
      removeFiles,
      deleteEvent,
    },
    dispatch
  );

export default connect(mapStateToProps, mapDispatchToProps)(EventDetails);
