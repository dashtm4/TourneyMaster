import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { Button, Paper } from 'components/common';
import styles from './styles.module.scss';
import BracketManager from './tabs/brackets';
import ResourceMatrix from './tabs/resources';
import { IAppState } from 'reducers/root-reducer.types';
import { ITournamentData } from 'common/models/tournament';
import { IEventSummary } from 'common/models';
import { bindActionCreators } from 'redux';
import { fetchEventSummary } from 'components/schedules/logic/actions';
import { IBracket } from 'common/models/playoffs/bracket';

interface IMapStateToProps extends Partial<ITournamentData> {
  eventSummary?: IEventSummary[];
  bracket: IBracket | null;
}
interface IMapDispatchToProps {
  fetchEventSummary: (eventId: string) => void;
}
interface IProps extends IMapStateToProps, IMapDispatchToProps {}

interface IState {
  activeTab: PlayoffsTabsEnum;
}

enum PlayoffsTabsEnum {
  ResourceMatrix = 1,
  BracketManager = 2,
}

class Playoffs extends Component<IProps> {
  state: IState = {
    activeTab: PlayoffsTabsEnum.ResourceMatrix,
  };

  componentDidMount() {
    const { event } = this.props;
    const eventId = event?.event_id!;
    this.props.fetchEventSummary(eventId);
  }

  render() {
    const { activeTab } = this.state;
    const { bracket } = this.props;

    // tableType
    // event
    // divisions
    // pools
    // teamCards
    // games
    // fields
    // timeSlots
    // facilities
    // scheduleData
    // eventSummary
    // onTeamCardsUpdate
    // onTeamCardUpdate
    // onUndo

    return (
      <div className={styles.container}>
        <div className={styles.paperWrapper}>
          <Paper>
            <div className={styles.paperContainer}>
              <div className={styles.bracketName}>
                <span>{bracket?.name}</span>
              </div>
              <div>
                <Button label="Close" variant="text" color="secondary" />
                <Button label="Save" variant="contained" color="primary" />
              </div>
            </div>
          </Paper>
        </div>

        <section className={styles.tabsContainer}>
          <div className={styles.tabToggle}>
            <div
              className={activeTab === 1 ? styles.active : ''}
              onClick={() => this.setState({ activeTab: 1 })}
            >
              Resource Matrix
            </div>
            <div
              className={activeTab === 2 ? styles.active : ''}
              onClick={() => this.setState({ activeTab: 2 })}
            >
              Bracket Manager
            </div>
          </div>
          {activeTab === PlayoffsTabsEnum.ResourceMatrix && <ResourceMatrix />}
          {activeTab === PlayoffsTabsEnum.BracketManager && <BracketManager />}
        </section>
      </div>
    );
  }
}

const mapStateToProps = ({
  pageEvent,
  schedules,
  scheduling,
}: IAppState): IMapStateToProps => ({
  event: pageEvent.tournamentData.event,
  facilities: pageEvent.tournamentData.facilities,
  divisions: pageEvent.tournamentData.divisions,
  teams: pageEvent.tournamentData.teams,
  fields: pageEvent.tournamentData.fields,
  schedules: pageEvent.tournamentData.schedules,
  eventSummary: schedules.eventSummary,
  bracket: scheduling.bracket,
});

const mapDispatchToProps = (dispatch: Dispatch): IMapDispatchToProps =>
  bindActionCreators(
    {
      fetchEventSummary,
      // getAllPools
    },
    dispatch
  );

export default connect(mapStateToProps, mapDispatchToProps)(Playoffs);
