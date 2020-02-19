import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Dispatch, bindActionCreators } from 'redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFileExport, faFileUpload } from '@fortawesome/free-solid-svg-icons';
import CircularProgress from '@material-ui/core/CircularProgress';

import { getScheduling } from './logic/actions';
import { HeadingLevelTwo, Paper, Button } from 'components/common';
import TourneyArchitect from './tourney-architect';
import TournamentPlay from './tournament-play';
import styles from './styles.module.scss';
import Brackets from './brackets';
import { ISchedule } from 'common/models/schedule';
import { ISchedulingState } from './logic/reducer';

interface IProps {
  getScheduling: () => void;
  schedule?: ISchedule;
}

interface IState {
  schedule?: ISchedule;
}

class Scheduling extends Component<IProps, IState> {
  state = {
    schedule: undefined,
  };

  componentDidMount() {
    this.props.getScheduling();
  }

  componentDidUpdate(prevProps: IProps) {
    const { schedule } = this.props;

    if (!prevProps?.schedule && !this.state.schedule) {
      this.setState({
        schedule,
      });
    }
  }

  onChange = (name: string, value: any) => {
    console.log(name, value);
  };

  render() {
    const { schedule } = this.state;

    return (
      <div className={styles.container}>
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
            <TourneyArchitect schedule={schedule} onChange={this.onChange} />
            <TournamentPlay />
            <Brackets />
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
  bindActionCreators({ getScheduling }, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(Scheduling);
