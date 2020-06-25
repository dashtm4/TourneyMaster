import React, { Component } from 'react';
import { Dispatch, bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import {
  getEventDetails,
  saveEventDetails,
  createEvent,
  removeFiles,
  deleteEvent,
  createEvents,
} from './logic/actions';
import { addEntityToLibrary } from 'components/authorized-page/authorized-page-event/logic/actions';
import { IIconFile } from './logic/model';
import { IEventState } from './logic/reducer';

import Navigation from './navigation';
import PrimaryInformationSection from './primary-information';
import EventStructureSection from './event-structure';
import MediaAssetsSection from './media-assets';
import PlayoffsSection from './playoffs';
import Rankings from './rankings';

import { Button, HeadingLevelTwo, Loader, Tooltip } from 'components/common';
import {
  IUploadFile,
  IEventDetails,
  BindingCbWithTwo,
  ISchedule,
  IFetchedBracket,
} from 'common/models';
import { uploadFile } from 'helpers';
import styles from './styles.module.scss';
import { eventState } from './state';
import DeleteIcon from '@material-ui/icons/Delete';
import history from '../../browserhistory';
import { PopupExposure } from 'components/common';
import DeletePopupConfrim from 'components/common/delete-popup-confirm';
import CsvLoader from 'components/common/csv-loader';
import { IEntity } from 'common/types';
import { EntryPoints, LibraryStates } from 'common/enums';
import WellnessStatement from './wellness-statement';
import EventWarningModal from './warning-modal';
import api from 'api/api';

interface IMapStateProps {
  event: IEventState;
}

interface Props extends IMapStateProps {
  match: any;
  getEventDetails: (eventId: string) => void;
  saveEventDetails: (event: Partial<IEventDetails>) => void;
  createEvent: (event: Partial<IEventDetails>) => void;
  uploadFiles: (files: IIconFile[]) => void;
  removeFiles: (files: IIconFile[]) => void;
  deleteEvent: BindingCbWithTwo<string, string>;
  createEvents: (events: Partial<IEventDetails>[]) => void;
  addEntityToLibrary: BindingCbWithTwo<IEntity, EntryPoints>;
}

type State = {
  eventId: string | undefined;
  event?: Partial<IEventDetails>;
  error: boolean;
  isModalOpen: boolean;
  isDeleteModalOpen: boolean;
  isCsvLoaderOpen: boolean;
  isSectionsExpand: boolean;
  changesAreMade: boolean;
  warningModalOpen: boolean;
};

class EventDetails extends Component<Props, State> {
  state: State = {
    eventId: undefined,
    event: undefined,
    error: false,
    isModalOpen: false,
    isDeleteModalOpen: false,
    isCsvLoaderOpen: false,
    isSectionsExpand: true,
    changesAreMade: false,
    warningModalOpen: false,
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

  checkSchedulingExistence = async () => {
    const { event_id } = this.state.event || {};
    const schedules = await api.get('/schedules', { event_id });
    const brackets = await api.get('/brackets_details', { event_id });

    const schedulesExist = schedules?.filter((v?: ISchedule) => v)?.length;
    const bracketsExist = brackets?.filter((v?: IFetchedBracket) => v)?.length;

    return Boolean(schedulesExist || bracketsExist);
  };

  onChange = (name: string, value: any, ignore?: boolean) => {
    this.setState(({ event }) => ({
      event: {
        ...event,
        [name]: value,
      },
    }));
    if (!this.state.changesAreMade && !ignore) {
      this.setState({ changesAreMade: true });
    }
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

  onSavePressed = async () => {
    const schedulingExist = await this.checkSchedulingExistence();

    if (schedulingExist) {
      this.openWarningModal();
      return;
    }

    this.onSave();
  };

  onSave = () => {
    const { event, eventId } = this.state;
    this.closeWarningModal();
    this.onModalClose();
    this.setState({ changesAreMade: false });

    if (!event) return;

    if (eventId) {
      this.props.saveEventDetails(event);
      return;
    }

    this.props.createEvent(event);
  };

  toggleSectionCollapse = () => {
    this.setState({ isSectionsExpand: !this.state.isSectionsExpand });
  };

  onDeleteClick = () => {
    this.setState({ isDeleteModalOpen: true });
  };

  onDeleteModalClose = () => {
    this.setState({ isDeleteModalOpen: false });
  };

  onCancelClick = () => {
    if (this.state.changesAreMade) {
      this.setState({ isModalOpen: true });
    } else {
      this.onCancel();
    }
  };

  onModalClose = () => {
    this.setState({ isModalOpen: false });
  };

  onCancel = () => {
    history.push('/');
  };

  openWarningModal = () => this.setState({ warningModalOpen: true });

  closeWarningModal = () => this.setState({ warningModalOpen: false });

  onCsvLoaderBtn = () => {
    this.setState({ isCsvLoaderOpen: true });
  };

  onCsvLoaderClose = () => {
    this.setState({ isCsvLoaderOpen: false });
  };

  onAddToLibraryManager = () => {
    const { event } = this.state;

    if (event?.is_library_YN === LibraryStates.FALSE) {
      this.onChange('is_library_YN', LibraryStates.TRUE);
    }

    this.props.addEntityToLibrary(event as IEventDetails, EntryPoints.EVENTS);
  };

  renderDeleteEventBtn = () => {
    return (
      <Button
        label="Delete Event"
        variant="text"
        color="secondary"
        type="dangerLink"
        icon={<DeleteIcon style={{ fill: '#FF0F19' }} />}
        onClick={this.onDeleteClick}
        disabled={Boolean(this.state.event?.is_published_YN)}
      />
    );
  };

  render() {
    const { event, isModalOpen, warningModalOpen } = this.state;
    const { isEventLoading } = this.props.event;
    const deleteMessage = `You are about to delete this event and this cannot be undone. All related data to this event will be deleted too.
      Please, enter the name of the event to continue.`;

    if (!event || isEventLoading) {
      return <Loader />;
    }

    return (
      <div className={styles.container}>
        <Navigation
          isEventId={this.props.match?.params.eventId}
          onCancelClick={this.onCancelClick}
          onCsvLoaderBtn={this.onCsvLoaderBtn}
          onAddToLibraryManager={this.onAddToLibraryManager}
          onSave={this.onSavePressed}
        />
        <div className={styles.headingContainer}>
          <HeadingLevelTwo margin="24px 0">Event Details</HeadingLevelTwo>
          <div>
            {this.props.match?.params.eventId &&
            this.state.event?.is_published_YN ? (
              <Tooltip
                type="info"
                title="This event is currently published. Unpublish it first if you would like to delete it."
              >
                <span>{this.renderDeleteEventBtn()}</span>
              </Tooltip>
            ) : (
              this.renderDeleteEventBtn()
            )}
            <Button
              label={
                this.state.isSectionsExpand ? 'Collapse All' : 'Expand All'
              }
              variant="text"
              color="secondary"
              onClick={this.toggleSectionCollapse}
            />
          </div>
        </div>
        <PrimaryInformationSection
          eventData={event}
          onChange={this.onChange}
          isSectionExpand={this.state.isSectionsExpand}
        />
        <EventStructureSection
          eventData={event}
          onChange={this.onChange}
          isSectionExpand={this.state.isSectionsExpand}
        />
        <WellnessStatement
          eventData={event}
          onChange={this.onChange}
          isSectionExpand={this.state.isSectionsExpand}
        />
        <Rankings
          eventData={event}
          onChange={this.onChange}
          isSectionExpand={this.state.isSectionsExpand}
        />
        <PlayoffsSection
          eventData={event}
          onChange={this.onChange}
          isSectionExpand={this.state.isSectionsExpand}
        />
        <MediaAssetsSection
          onFileUpload={this.onFileUpload}
          onFileRemove={this.onFileRemove}
          isSectionExpand={this.state.isSectionsExpand}
          logo={event.desktop_icon_URL}
          mobileLogo={event.mobile_icon_URL}
        />
        <DeletePopupConfrim
          type={'event'}
          deleteTitle={event.event_name!}
          message={deleteMessage}
          isOpen={this.state.isDeleteModalOpen}
          onClose={this.onDeleteModalClose}
          onDeleteClick={() => {
            this.props.deleteEvent(event.event_id!, event.event_name!);
          }}
        />
        <PopupExposure
          isOpen={isModalOpen}
          onClose={this.onModalClose}
          onExitClick={this.onCancel}
          onSaveClick={this.onSavePressed}
        />
        <EventWarningModal
          isOpen={warningModalOpen}
          onClose={this.closeWarningModal}
          onExitClick={this.onCancel}
          onSaveClick={this.onSave}
        />
        <CsvLoader
          isOpen={this.state.isCsvLoaderOpen}
          onClose={this.onCsvLoaderClose}
          type="event_master"
          onCreate={this.props.createEvents}
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
      createEvents,
      addEntityToLibrary,
    },
    dispatch
  );

export default connect(mapStateToProps, mapDispatchToProps)(EventDetails);
