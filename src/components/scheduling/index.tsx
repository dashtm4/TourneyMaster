import React, { Component } from 'react';
import { connect } from 'react-redux';
import { History } from 'history';
import { Dispatch, bindActionCreators } from 'redux';

import {
  getScheduling,
  createNewSchedule,
  addNewSchedule,
  changeSchedule,
} from './logic/actions';
import { HeadingLevelTwo, Loader } from 'components/common';
import Navigation from './navigation';
import TourneyArchitect from './tourney-architect';
import TournamentPlay from './tournament-play';
import HazardList from './hazard-list';
import styles from './styles.module.scss';
import Brackets from './brackets';
import { ISchedule, IConfigurableSchedule } from 'common/models/schedule';
import { IAppState } from 'reducers/root-reducer.types';
import CreateNewModal from './create-new-modal';
import { IMenuItem, BindingAction, BindingCbWithOne } from 'common/models';
import { ISchedulingSchedule } from './types';

interface IProps {
  schedule: IConfigurableSchedule | null;
  schedules: ISchedulingSchedule[];
  incompleteMenuItems: IMenuItem[];
  match: any;
  history: History;
  isLoading: boolean;
  isLoaded: boolean;
  getScheduling: (eventId: string) => void;
  createNewSchedule: (schedule: IConfigurableSchedule) => void;
  addNewSchedule: BindingAction;
  changeSchedule: BindingCbWithOne<Partial<ISchedule>>;
}

interface IState {
  createModalOpen: boolean;
}

class Scheduling extends Component<IProps, IState> {
  state = {
    createModalOpen: false,
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

  render() {
    const {
      schedule,
      schedules,
      incompleteMenuItems,
      isLoading,
      createNewSchedule,
    } = this.props;
    const { createModalOpen } = this.state;
    const { eventId } = this.props.match?.params;
    const isAllowCreate = incompleteMenuItems.length === 0;

    if (isLoading || !schedule) {
      return <Loader />;
    }

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
                onViewEventMatrix={() => {}}
              />
              {schedules.length > 0 && (
                <>
                  <TournamentPlay
                    schedules={schedules}
                    onEditScheduleDetails={() => {}}
                    onManageTournamentPlay={() => {}}
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
      </>
    );
  }
}

const mapStateToProps = ({ scheduling }: IAppState) => ({
  schedule: scheduling.schedule,
  schedules: scheduling.schedules,
  isLoading: scheduling.isLoading,
  isLoaded: scheduling.isLoaded,
});

const mapDispatchToProps = (dispatch: Dispatch) =>
  bindActionCreators(
    { getScheduling, createNewSchedule, addNewSchedule, changeSchedule },
    dispatch
  );

export default connect(mapStateToProps, mapDispatchToProps)(Scheduling);
