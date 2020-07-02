import React, { Component } from 'react';
import { Dispatch, bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import DeleteIcon from '@material-ui/icons/Delete';

import api from 'api/api';
import history from 'browserhistory';
import { addEntityToLibrary } from 'components/authorized-page/authorized-page-event/logic/actions';
import { Button, HeadingLevelTwo, Loader, Tooltip } from 'components/common';
import {
  IUploadFile,
  IEventDetails,
  BindingCbWithTwo,
  ISchedule,
  IFetchedBracket,
} from 'common/models';
import { uploadFile } from 'helpers';
import { PopupExposure } from 'components/common';
import DeletePopupConfrim from 'components/common/delete-popup-confirm';
import CsvLoader from 'components/common/csv-loader';
import { IEntity } from 'common/types';
import { EntryPoints, LibraryStates } from 'common/enums';
import {
  getEventDetails,
  saveEventDetails,
  createEvent,
  removeFiles,
  deleteEvent,
  createEvents,
} from './logic/actions';
import { IIconFile } from './logic/model';
import { IEventState } from './logic/reducer';
import Navigation from './navigation';
import PrimaryInformationSection from './primary-information';
import EventStructureSection from './event-structure';
import MediaAssetsSection from './media-assets';
import PlayoffsSection from './playoffs';
import Rankings from './rankings';
import { eventState } from './state';
import WellnessStatement from './wellness-statement';
import EventWarningModal from './warning-modal';
import styles from './styles.module.scss';

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
    const {
      match: {
        params: { eventId },
      },
      getEventDetails,
    } = this.props;

    if (eventId) {
      this.setState({ eventId });
      getEventDetails(eventId);
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
    const { changesAreMade } = this.state;

    this.setState(({ event }) => ({
      event: {
        ...event,
        [name]: value,
      },
    }));
    if (!changesAreMade && !ignore) {
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

  onFileRemove = (files: IUploadFile[]) => this.props.removeFiles(files);

  onSavePressed = async () => {
    const schedulingExist = await this.checkSchedulingExistence();

    if (schedulingExist) {
      this.openWarningModal();
      return;
    }
    this.onSave();
  };

  onSave = () => {
    const { createEvent, saveEventDetails } = this.props;
    const { event, eventId } = this.state;
    this.closeWarningModal();
    this.onModalClose();
    this.setState({ changesAreMade: false });

    if (!event) return;

    if (eventId) {
      saveEventDetails(event);
      return;
    }
    createEvent(event);
  };

  toggleSectionCollapse = () =>
    this.setState({ isSectionsExpand: !this.state.isSectionsExpand });

  onDeleteClick = () => this.setState({ isDeleteModalOpen: true });

  onDeleteModalClose = () => this.setState({ isDeleteModalOpen: false });

  onCancelClick = () => {
    const { changesAreMade } = this.state;

    if (changesAreMade) {
      this.setState({ isModalOpen: true });
    } else {
      this.onCancel();
    }
  };

  onModalClose = () => this.setState({ isModalOpen: false });

  onCancel = () => history.push('/');

  openWarningModal = () => this.setState({ warningModalOpen: true });

  closeWarningModal = () => this.setState({ warningModalOpen: false });

  onCsvLoaderBtn = () => this.setState({ isCsvLoaderOpen: true });

  onCsvLoaderClose = () => this.setState({ isCsvLoaderOpen: false });

  onAddToLibraryManager = () => {
    const { addEntityToLibrary } = this.props;
    const { event } = this.state;

    if (event?.is_library_YN === LibraryStates.FALSE) {
      this.onChange('is_library_YN', LibraryStates.TRUE);
    }
    addEntityToLibrary(event as IEventDetails, EntryPoints.EVENTS);
  };

  renderDeleteEventBtn = () => (
    <Button
      label="Delete Event"
      variant="text"
      color="secondary"
      type="dangerLink"
      disabled={Boolean(this.state.event?.is_published_YN)}
      icon={<DeleteIcon style={{ fill: '#FF0F19' }} />}
      onClick={this.onDeleteClick}
    />
  );

  render() {
    const {
      event: { isEventLoading },
      match,
      createEvents,
      deleteEvent,
    } = this.props;
    const {
      event,
      isCsvLoaderOpen,
      isDeleteModalOpen,
      isModalOpen,
      isSectionsExpand,
    } = this.state;
    const deleteMessage = `You are about to delete this event and this cannot be undone. All related data to this event will be deleted too.
      Please, enter the name of the event to continue.`;

    if (!event || isEventLoading) {
      return <Loader />;
    }

    const {
      desktop_icon_URL,
      event_name,
      event_id,
      is_published_YN,
      mobile_icon_URL,
    } = event;
    const commonChildProps = {
      eventData: event,
      onChange: this.onChange,
      isSectionExpand: isSectionsExpand,
    };

    const commonModalProps = {
      isOpen: isModalOpen,
      onClose: this.onModalClose,
      onExitClick: this.onCancel,
      onSaveClick: this.onSavePressed,
    };

    return (
      <div className={styles.container}>
        <Navigation
          isEventId={match?.params.eventId}
          onCancelClick={this.onCancelClick}
          onCsvLoaderBtn={this.onCsvLoaderBtn}
          onAddToLibraryManager={this.onAddToLibraryManager}
          onSave={this.onSavePressed}
        />
        <div className={styles.headingContainer}>
          <HeadingLevelTwo margin="24px 0">Event Details</HeadingLevelTwo>
          <div>
            {match?.params.eventId && is_published_YN ? (
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
              label={isSectionsExpand ? 'Collapse All' : 'Expand All'}
              variant="text"
              color="secondary"
              onClick={this.toggleSectionCollapse}
            />
          </div>
        </div>
        <PrimaryInformationSection {...commonChildProps} />
        <EventStructureSection {...commonChildProps} />
        <WellnessStatement {...commonChildProps} />
        <Rankings {...commonChildProps} />
        <PlayoffsSection {...commonChildProps} />
        <MediaAssetsSection
          onFileUpload={this.onFileUpload}
          onFileRemove={this.onFileRemove}
          isSectionExpand={isSectionsExpand}
          logo={desktop_icon_URL}
          mobileLogo={mobile_icon_URL}
        />
        <DeletePopupConfrim
          type={'event'}
          deleteTitle={event_name!}
          message={deleteMessage}
          isOpen={isDeleteModalOpen}
          onClose={this.onDeleteModalClose}
          onDeleteClick={() => {
            deleteEvent(event_id!, event_name!);
          }}
        />
        <PopupExposure {...commonModalProps} />
        <EventWarningModal {...commonModalProps} />
        <CsvLoader
          type="event_master"
          isOpen={isCsvLoaderOpen}
          onClose={this.onCsvLoaderClose}
          onCreate={createEvents}
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
