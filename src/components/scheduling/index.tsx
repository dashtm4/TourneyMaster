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
  getScheduling: () => void;
  createNewVersion: (data: INewVersion) => void;
  schedule?: ISchedule;
}

interface IState {
  createModalOpen: boolean;
  schedule?: ISchedule;
}

class Scheduling extends Component<IProps, IState> {
  state = {
    createModalOpen: false,
    schedule: undefined,
  };

  componentDidMount() {
    this.props.getScheduling();
  }

  componentDidUpdate() {
    const { schedule } = this.props;
    if (schedule && !this.state.schedule) {
      this.setState({
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
    this.props.createNewVersion(data);
    console.log('data', data);
  };

  onCreateClosed = () => {
    this.setState({ createModalOpen: false });
  };

  render() {
    const { schedule, createModalOpen } = this.state;

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
        <HeadingLevelTwo margin="24px 0px">Scheduling</HeadingLevelTwo>
        {!schedule ? (
          <div className={styles.loader}>
            <CircularProgress />
          </div>
        ) : (
          <>
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
