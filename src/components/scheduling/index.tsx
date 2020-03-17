import React, { Component } from 'react';
import { connect } from 'react-redux';
import { History } from 'history';
import { Dispatch, bindActionCreators } from 'redux';

import { getScheduling, createNewVersion, INewVersion } from './logic/actions';
import { HeadingLevelTwo, Loader } from 'components/common';
import Navigation from './navigation';
import TourneyArchitect from './tourney-architect';
import TournamentPlay from './tournament-play';
import HazardList from './hazard-list';
import styles from './styles.module.scss';
import Brackets from './brackets';
import { ISchedule } from 'common/models/schedule';
import { ISchedulingState } from './logic/reducer';
import CreateNewModal from './create-new-modal';
import { IMenuItem } from 'common/models';

interface IProps {
  match: any;
  history: History;
  getScheduling: (eventId?: number) => void;
  createNewVersion: (data: INewVersion) => void;
  schedule?: ISchedule;
  schedulingIsLoading: boolean;
  incompleteMenuItems: IMenuItem[];
}

interface IState {
  loading: boolean;
  createModalOpen: boolean;
  schedule?: ISchedule;
}

class Scheduling extends Component<IProps, IState> {
  state = {
    loading: true,
    createModalOpen: false,
    schedule: undefined,
  };

  componentDidMount() {
    const { eventId } = this.props.match?.params;
    this.props.getScheduling(eventId);
  }

  componentDidUpdate(prevProps: IProps) {
    const { schedulingIsLoading: prevSchedulingIsLoading } = prevProps;
    const { schedule, schedulingIsLoading } = this.props;

    if (prevSchedulingIsLoading !== schedulingIsLoading) {
      this.setState({
        loading: schedulingIsLoading,
        schedule,
      });
    }
  }

  onChange = (name: string, value: any) => {
    console.log(name, value);
  };

  onCallAction = () => {
    console.log('Call action');
  };

  onCreatePressed = () => {
    this.setState({ createModalOpen: true });
  };

  onCreateNew = (data: INewVersion) => {
    this.setState({ createModalOpen: false });
    const { eventId } = this.props.match?.params;
    this.props.history.push(`/schedules/${eventId}`);
    this.props.createNewVersion(data);
  };

  onCreateClosed = () => {
    this.setState({ createModalOpen: false });
  };

  render() {
    const { incompleteMenuItems } = this.props;
    const { schedule, createModalOpen, loading } = this.state;
    const { eventId } = this.props.match?.params;
    const isAllowCreate = incompleteMenuItems.length === 0;

    if (loading) {
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
                onViewEventMatrix={this.onCallAction}
              />
              <TournamentPlay
                onEditScheduleDetails={this.onCallAction}
                onManageTournamentPlay={this.onCallAction}
                onSaveScheduleCSV={this.onCallAction}
              />
              <Brackets onManageBrackets={this.onCallAction} />
            </>
          ) : (
            <HazardList
              incompleteMenuItems={incompleteMenuItems}
              eventId={eventId}
            />
          )}
        </div>
        <CreateNewModal
          isOpen={createModalOpen}
          onSave={this.onCreateNew}
          onClose={this.onCreateClosed}
        />
      </>
    );
  }
}

interface IRootState {
  scheduling: ISchedulingState;
}

const mapStateToProps = (store: IRootState) => ({
  schedule: store.scheduling?.schedule,
  schedulingIsLoading: store.scheduling?.schedulingIsLoading,
});

const mapDispatchToProps = (dispatch: Dispatch) =>
  bindActionCreators({ getScheduling, createNewVersion }, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(Scheduling);
