import React, { Component } from 'react';
import { connect } from 'react-redux';
import { History } from 'history';
import { Dispatch, bindActionCreators } from 'redux';
import {
  getScheduling,
  createNewSchedule,
  addNewSchedule,
  changeSchedule,
  updateSchedule,
  deleteSchedule,
  publishSchedule,
  unpublishSchedule,
  createNewBracket,
} from './logic/actions';
import { addEntityToLibrary } from 'components/authorized-page/authorized-page-event/logic/actions';
import {
  HeadingLevelTwo,
  Loader,
  Modal,
  HazardList,
  Input,
  Button,
  HeadingLevelFour,
  PopupAddToLibrary,
} from 'components/common';
import Navigation from './navigation';
import TourneyArchitect from './tourney-architect';
import TournamentPlay from './tournament-play';
import styles from './styles.module.scss';
import Brackets from './brackets';
import { ISchedule, IConfigurableSchedule } from 'common/models/schedule';
import { IAppState } from 'reducers/root-reducer.types';
import CreateNewModal from './create-new-modal';
import PopupEditSchedule from './popup-edit-schedule';
import {
  IMenuItem,
  BindingAction,
  BindingCbWithOne,
  ITeam,
  IField,
  IDivision,
  IEventDetails,
  BindingCbWithTwo,
} from 'common/models';
import { ISchedulingSchedule } from './types';
import ViewMatrix from './view-matrix';
import { getTimeValuesFromSchedule, calculateTimeSlots } from 'helpers';
import { ButtonVarian, ButtonColors, EntryPoints } from 'common/enums';
import CreateNewBracket, {
  ICreateBracketModalOutput,
} from './create-new-bracket';
import { IEntity } from 'common/types';

enum ComponentActionsEnum {
  SchedulePublish = 'schedulePublish',
  ScheduleUnpublish = 'scheduleUnpublish',
  BracketPublish = 'bracketPublish',
  BracketUnpublish = 'bracketUnpublish',
}

interface IProps {
  schedule: IConfigurableSchedule | null;
  schedules: ISchedulingSchedule[];
  incompleteMenuItems: IMenuItem[];
  match: any;
  history: History;
  isLoading: boolean;
  isLoaded: boolean;
  fields?: IField[];
  getScheduling: (eventId: string) => void;
  createNewSchedule: (schedule: IConfigurableSchedule) => void;
  addNewSchedule: BindingAction;
  changeSchedule: BindingCbWithOne<Partial<ISchedule>>;
  updateSchedule: BindingCbWithOne<ISchedulingSchedule>;
  deleteSchedule: BindingCbWithOne<ISchedulingSchedule>;
  publishSchedule: BindingCbWithOne<string>;
  unpublishSchedule: BindingCbWithOne<string>;
  createNewBracket: BindingCbWithOne<ICreateBracketModalOutput>;
  addEntityToLibrary: BindingCbWithTwo<IEntity, EntryPoints>;
  divisions?: IDivision[];
  teams?: ITeam[];
  event?: IEventDetails | null;
  schedulesPublished?: boolean;
  gamesAlreadyExist?: boolean;
}

interface IState {
  editedSchedule: ISchedulingSchedule | null;
  createModalOpen: boolean;
  viewMatrixOpen: boolean;
  confirmationModalOpen: boolean;
  confirmText?: string;
  confirmCondition?: { name: string; data: any };
  componentAction?: ComponentActionsEnum;
  isSectionsExpand: boolean;
  createBracketOpen: boolean;
  isLibraryPopupOpen: boolean;
}

class Scheduling extends Component<IProps, IState> {
  state: IState = {
    editedSchedule: null,
    createModalOpen: false,
    viewMatrixOpen: false,
    confirmationModalOpen: false,
    confirmText: '',
    confirmCondition: undefined,
    componentAction: undefined,
    isSectionsExpand: true,
    createBracketOpen: false,
    isLibraryPopupOpen: false,
  };

  componentDidMount() {
    const { eventId } = this.props.match?.params;
    const { getScheduling, addNewSchedule } = this.props;

    if (eventId) {
      getScheduling(eventId);
      addNewSchedule();
    }
  }

  onChange = (name: string, value: any) => {
    const { changeSchedule } = this.props;

    changeSchedule({ [name]: value });
  };

  onCreatePressed = () => this.setState({ createModalOpen: true });

  onCreateBracketPressed = () => this.setState({ createBracketOpen: true });

  onCreateClosed = () => this.setState({ createModalOpen: false });

  onCreateBracketClosed = () => this.setState({ createBracketOpen: false });

  onCreateBracket = (bracketData: ICreateBracketModalOutput) => {
    this.props.createNewBracket(bracketData);
    this.onCreateBracketClosed();
  };

  onEditSchedule = (schedule: ISchedulingSchedule) =>
    this.setState({ editedSchedule: schedule });

  onCloseEditSchedule = () => this.setState({ editedSchedule: null });

  openViewMatrix = () => this.setState({ viewMatrixOpen: true });
  closeViewMatrix = () => this.setState({ viewMatrixOpen: false });

  openConfirmationModal = (open: boolean) => {
    this.setState({
      confirmationModalOpen: open,
    });
  };

  onChangeConfirmText = (e: any) => {
    this.setState({ confirmText: e.target.value });
  };

  onPublish = (schedule: ISchedule, publish: boolean) => {
    this.setState({
      confirmCondition: {
        name: schedule.schedule_name!,
        data: schedule,
      },
      componentAction: publish
        ? ComponentActionsEnum.SchedulePublish
        : ComponentActionsEnum.ScheduleUnpublish,
    });
    this.openConfirmationModal(true);
  };

  actionCalled = async () => {
    const { componentAction, confirmCondition } = this.state;
    if (!componentAction || !confirmCondition) return;

    switch (componentAction) {
      case ComponentActionsEnum.SchedulePublish:
        this.props.publishSchedule(confirmCondition?.data.schedule_id);
        break;
      case ComponentActionsEnum.ScheduleUnpublish:
        this.props.unpublishSchedule(confirmCondition?.data.schedule_id);
        break;
    }

    this.setState({ componentAction: undefined, confirmationModalOpen: false });
  };

  actionCancel = () => {
    this.setState({
      confirmText: '',
      componentAction: undefined,
      confirmCondition: undefined,
      confirmationModalOpen: false,
    });
  };

  toggleSectionCollapse = () =>
    this.setState(({ isSectionsExpand }) => ({
      isSectionsExpand: !isSectionsExpand,
    }));

  toggleLibraryPopup = () => {
    this.setState(({ isLibraryPopupOpen }) => ({
      isLibraryPopupOpen: !isLibraryPopupOpen,
    }));
  };

  render() {
    const {
      schedule,
      schedules,
      incompleteMenuItems,
      isLoading,
      createNewSchedule,
      updateSchedule,
      deleteSchedule,
      fields,
      event,
    } = this.props;

    const {
      createModalOpen,
      editedSchedule,
      viewMatrixOpen,
      confirmText,
      confirmCondition,
      confirmationModalOpen,
      componentAction,
      isSectionsExpand,
      createBracketOpen,
      isLibraryPopupOpen,
    } = this.state;

    const { eventId } = this.props.match?.params;
    const isAllowCreate = incompleteMenuItems.length === 0;

    if (isLoading || !schedule) {
      return <Loader />;
    }

    const timeValues = getTimeValuesFromSchedule(schedule);
    const timeSlots = calculateTimeSlots(timeValues);

    const actionName =
      componentAction === ComponentActionsEnum.SchedulePublish
        ? 'Publish'
        : 'Unpublish';

    return (
      <>
        <div className={styles.container}>
          <Navigation toggleLibraryPopup={this.toggleLibraryPopup} />
          {isAllowCreate ? (
            <>
              <div className={styles.titleWrapper}>
                <HeadingLevelTwo margin="24px 0px">Scheduling</HeadingLevelTwo>
                <Button
                  onClick={this.toggleSectionCollapse}
                  variant={ButtonVarian.TEXT}
                  color={ButtonColors.SECONDARY}
                  label={isSectionsExpand ? 'Collapse All' : 'Expand All'}
                />
              </div>
              <TourneyArchitect
                schedule={schedule}
                event={event}
                onChange={this.onChange}
                isSectionExpand={isSectionsExpand}
                onViewEventMatrix={this.openViewMatrix}
              />
              {schedules.length > 0 && (
                <>
                  <TournamentPlay
                    schedules={schedules}
                    isSectionExpand={isSectionsExpand}
                    isAllowCreate={isAllowCreate}
                    eventId={eventId}
                    onCreatePressed={this.onCreatePressed}
                    onEditSchedule={this.onEditSchedule}
                    onPublish={(data: ISchedule) => this.onPublish(data, true)}
                    onUnpublish={(data: ISchedule) =>
                      this.onPublish(data, false)
                    }
                  />
                  <Brackets
                    schedules={schedules}
                    eventId={eventId}
                    isSectionExpand={isSectionsExpand}
                    bracketCreationAllowed={true}
                    onCreateBracket={this.onCreateBracketPressed}
                  />
                </>
              )}
            </>
          ) : (
            <HazardList
              incompleteMenuItems={incompleteMenuItems}
              eventId={eventId}
            />
          )}
        </div>
        <CreateNewModal
          schedule={schedule}
          isOpen={createModalOpen}
          onCreate={createNewSchedule}
          onClose={this.onCreateClosed}
          onChange={this.onChange}
        />
        <CreateNewBracket
          schedules={schedules}
          isOpen={createBracketOpen}
          onCreateBracket={this.onCreateBracket}
          onClose={this.onCreateBracketClosed}
        />
        <Modal isOpen={viewMatrixOpen} onClose={this.closeViewMatrix}>
          <ViewMatrix
            timeSlots={timeSlots!}
            fields={fields!}
            onClose={this.closeViewMatrix}
          />
        </Modal>
        {editedSchedule && (
          <PopupEditSchedule
            schedule={editedSchedule}
            onClose={this.onCloseEditSchedule}
            onSubmit={updateSchedule}
            onDelete={deleteSchedule}
          />
        )}

        <Modal isOpen={confirmationModalOpen} onClose={this.actionCancel}>
          <div className={styles.modalContainer}>
            <HeadingLevelFour>
              <span>{actionName} Schedule</span>
            </HeadingLevelFour>
            <span>
              Please confirm your desire to&nbsp;
              {actionName.toLowerCase()}
              &nbsp;this schedule by typing in the name of the schedule
              below&nbsp;
              <b>"{confirmCondition?.name}"</b>
            </span>
            <Input
              width="400px"
              align="center"
              placeholder="Confirmation Text"
              onChange={this.onChangeConfirmText}
            />
            <div className={styles.modalBtnsWrapper}>
              <Button
                label="Cancel"
                variant="text"
                color="secondary"
                onClick={this.actionCancel}
              />
              <Button
                label="Confirm"
                variant="contained"
                color="primary"
                disabled={confirmText !== confirmCondition?.name}
                onClick={this.actionCalled}
              />
            </div>
          </div>
        </Modal>
        <PopupAddToLibrary
          entities={schedules}
          entryPoint={EntryPoints.SCHEDULES}
          isOpen={isLibraryPopupOpen}
          onClose={this.toggleLibraryPopup}
          addEntityToLibrary={this.props.addEntityToLibrary}
        />
      </>
    );
  }
}

const mapStateToProps = ({ scheduling, pageEvent, schedules }: IAppState) => ({
  schedule: scheduling.schedule,
  schedules: scheduling.schedules,
  isLoading: scheduling.isLoading,
  isLoaded: scheduling.isLoaded,
  fields: pageEvent?.tournamentData?.fields,
  teams: pageEvent?.tournamentData?.teams,
  divisions: pageEvent?.tournamentData?.divisions,
  event: pageEvent?.tournamentData?.event,
  schedulesPublished: schedules?.schedulesPublished,
  gamesAlreadyExist: schedules?.gamesAlreadyExist,
});

const mapDispatchToProps = (dispatch: Dispatch) =>
  bindActionCreators(
    {
      getScheduling,
      createNewSchedule,
      createNewBracket,
      addNewSchedule,
      changeSchedule,
      updateSchedule,
      deleteSchedule,
      publishSchedule,
      unpublishSchedule,
      addEntityToLibrary,
    },
    dispatch
  );

export default connect(mapStateToProps, mapDispatchToProps)(Scheduling);
