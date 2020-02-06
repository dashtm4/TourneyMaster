import React, { Component } from 'react';
import { Dispatch, bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { getEventDetails } from './logic/actions';
import { EventDetailsDTO } from './logic/model';
import { IAppState } from './logic/reducer';

import PrimaryInformationSection from './primary-information';
import EventStructureSection from './event-structure';
import MediaAssetsSection from './media-assets';
import PlayoffsSection from './playoffs';

import { Button, HeadingLevelTwo, Paper } from 'components/common';
import styles from './styles.module.scss';

interface IMapStateProps {
  event: IAppState;
}

interface Props extends IMapStateProps {
  getEventDetails: (eventId: string) => void;
}

type State = {
  event?: Partial<EventDetailsDTO>;
  error: boolean;
};

class EventDetails extends Component<Props, State> {
  state: State = {
    event: undefined,
    error: false,
  };

  onChange = (name: string, value: any) => {
    this.setState(({ event }) => ({
      event: {
        ...event,
        [name]: value,
      },
    }));
  };

  async componentDidMount() {
    this.props.getEventDetails('ABC123');
  }

  static getDerivedStateFromProps(
    nextProps: Props,
    prevState: State
  ): Partial<State> {
    if (!prevState.event && nextProps.event.data) {
      return {
        event: nextProps.event.data,
        error: nextProps.event.error,
      };
    }
    return {
      error: nextProps.event.error,
    };
  }

  Loading = () => <div>Nice Loading...</div>;

  render() {
    const genderOptions = ['Male', 'Female', 'Attack Helicopter'];
    const eventTypeOptions = ['Tournament', 'Showcase'];
    const bracketTypeOptions = [
      'Single Elimination',
      'Double Elimination',
      '3 Game Guarantee',
    ];
    const topNumberOfTeams = ['2', '3', '4', '5', '6', '7', '8'];

    const { event } = this.state;

    return !event ? (
      this.Loading()
    ) : (
      <div className={styles.container}>
        <Paper>
          <div className={styles.paperWrapper}>
            <Button label="Save" color="primary" variant="contained" />
          </div>
        </Paper>
        <HeadingLevelTwo margin="24px 0">Event Details</HeadingLevelTwo>

        <PrimaryInformationSection
          eventData={event}
          genderOptions={genderOptions}
          onChange={this.onChange}
        />

        <EventStructureSection
          eventData={event}
          eventTypeOptions={eventTypeOptions}
          onChange={this.onChange}
        />

        <PlayoffsSection
          bracketTypeOptions={bracketTypeOptions}
          topNumberOfTeams={topNumberOfTeams}
          onChange={this.onChange}
        />

        <MediaAssetsSection />
      </div>
    );
  }
}

interface IRootState {
  event: IAppState;
}

const mapStateToProps = (state: IRootState): IMapStateProps => ({
  event: state.event,
});

const mapDispatchToProps = (dispatch: Dispatch) =>
  bindActionCreators({ getEventDetails }, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(EventDetails);
