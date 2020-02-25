import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Dispatch, bindActionCreators } from 'redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFileExport, faFileUpload } from '@fortawesome/free-solid-svg-icons';
import CircularProgress from '@material-ui/core/CircularProgress';

import { getScheduling, createNewVersion, INewVersion } from './logic/actions';
import { HeadingLevelTwo, Paper, Button } from 'components/common';
import TourneyArchitect from './tourney-architect';
import TournamentPlay from './tournament-play';
import styles from './styles.module.scss';
import Brackets from './brackets';
import { ISchedule } from 'common/models/schedule';
import { ISchedulingState } from './logic/reducer';
import CreateNewModal from './create-new-modal';

interface IProps {
  match: any;
  getScheduling: (eventId?: number) => void;
  createNewVersion: (data: INewVersion) => void;
  schedule?: ISchedule;
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

  componentDidUpdate() {
    const { schedule } = this.props;
    const { schedule: stateSchedule, loading } = this.state;

    if (schedule && !stateSchedule) {
      this.setState({ schedule, loading: false });
    }

    if (schedule === null && loading) {
      this.setState({ loading: false });
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
    this.props.createNewVersion(data);
  };

  onCreateClosed = () => {
    this.setState({ createModalOpen: false });
  };

  render() {
    const { schedule, createModalOpen, loading } = this.state;

    return (
      <div className={styles.container}>
        <CreateNewModal
          isOpen={createModalOpen}
          onSave={this.onCreateNew}
          onClose={this.onCreateClosed}
        />
        <section className={styles.paper}>
          <Paper>
            <div>
              <Button
                icon={<FontAwesomeIcon icon={faFileExport} />}
                label="Load From Library"
                color="secondary"
                variant="text"
              />
              &nbsp;
              <Button
                icon={<FontAwesomeIcon icon={faFileUpload} />}
                label="Upload From File"
                color="secondary"
                variant="text"
              />
            </div>
            <Button
              label="Create New Version"
              color="primary"
              variant="contained"
              onClick={this.onCreatePressed}
            />
          </Paper>
        </section>
        {loading && (
          <div className={styles.loader}>
            <CircularProgress />
          </div>
        )}
        {schedule && (
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
        )}
        {!schedule && !loading && (
          <div className={styles.noFoundWrapper}>
            <span>No Schedules found</span>
          </div>
        )}
      </div>
    );
  }
}

interface IRootState {
  scheduling: ISchedulingState;
}

const mapStateToProps = (store: IRootState) => ({
  schedule: store.scheduling?.schedule,
});

const mapDispatchToProps = (dispatch: Dispatch) =>
  bindActionCreators({ getScheduling, createNewVersion }, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(Scheduling);
