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
} from './logic/actions';
import { HeadingLevelTwo, Loader, Modal } from 'components/common';
import Navigation from './navigation';
import TourneyArchitect from './tourney-architect';
import TournamentPlay from './tournament-play';
import HazardList from './hazard-list';
import styles from './styles.module.scss';
import Brackets from './brackets';
import { ISchedule, IConfigurableSchedule } from 'common/models/schedule';
import { IAppState } from 'reducers/root-reducer.types';
import CreateNewModal from './create-new-modal';
import PopupEditSchedule from './popup-edit-schedule';
import { IMenuItem, BindingAction, BindingCbWithOne } from 'common/models';
import { ISchedulingSchedule } from './types';
import ViewMatrix from './view-matrix';
import { getTimeValuesFromSchedule, calculateTimeSlots } from 'helpers';
import { IField } from 'common/models';

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
}

interface IState {
  editedSchedule: ISchedulingSchedule | null;
  createModalOpen: boolean;
  viewMatrixOpen: boolean;
}

class Scheduling extends Component<IProps, IState> {
  state = {
    editedSchedule: null,
    createModalOpen: false,
    viewMatrixOpen: false,
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

  onCreatePressed = () => {
    this.setState({ createModalOpen: true });
  };

  onCreateClosed = () => {
    this.setState({ createModalOpen: false });
  };

  onEditSchedule = (schedule: ISchedulingSchedule) =>
    this.setState({ editedSchedule: schedule });

  onCloseEditSchedule = () => this.setState({ editedSchedule: null });

  openViewMatrix = () => this.setState({ viewMatrixOpen: true });
  closeViewMatrix = () => this.setState({ viewMatrixOpen: false });

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
    } = this.props;
    const { createModalOpen, editedSchedule, viewMatrixOpen } = this.state;
    const { eventId } = this.props.match?.params;
    const isAllowCreate = incompleteMenuItems.length === 0;

    if (isLoading || !schedule) {
      return <Loader />;
    }

    const timeValues = getTimeValuesFromSchedule(schedule);
    const timeSlots = calculateTimeSlots(timeValues);

    return (
      <>
        <div className={styles.container}>
          <Navigation
            isAllowCreate={isAllowCreate}
            onCreatePressed={this.onCreatePressed}
          />
          {isAllowCreate ? (
            <>
              <HeadingLevelTwo margin="24px 0px">Scheduling</HeadingLevelTwo>
              <TourneyArchitect
                schedule={schedule}
                onChange={this.onChange}
                onViewEventMatrix={this.openViewMatrix}
              />
              {schedules.length > 0 && (
                <>
                  <TournamentPlay
                    schedules={schedules}
                    onEditSchedule={this.onEditSchedule}
                    eventId={eventId}
                  />
                  {false && <Brackets onManageBrackets={() => {}} />}
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
      </>
    );
  }
}

const mapStateToProps = ({ scheduling, pageEvent }: IAppState) => ({
  schedule: scheduling.schedule,
  schedules: scheduling.schedules,
  isLoading: scheduling.isLoading,
  isLoaded: scheduling.isLoaded,
  fields: pageEvent?.tournamentData?.fields,
});

const mapDispatchToProps = (dispatch: Dispatch) =>
  bindActionCreators(
    {
      getScheduling,
      createNewSchedule,
      addNewSchedule,
      changeSchedule,
      updateSchedule,
      deleteSchedule,
    },
    dispatch
  );

export default connect(mapStateToProps, mapDispatchToProps)(Scheduling);
