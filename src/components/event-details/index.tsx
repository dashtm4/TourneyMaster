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

import {
  Button,
  HeadingLevelTwo,
  HeadingLevelThree,
  SectionDropdown,
  Paper,
} from 'components/common';
import styles from './styles.module.scss';

interface IMapStateProps {
  event: IAppState;
}

interface Props extends IMapStateProps {
  getEventDetails: (eventId: string) => void;
}

type State = {
  event?: EventDetailsDTO;
  eventToSubmit: Partial<EventDetailsDTO>;
  error: boolean;
};

class EventDetails extends Component<Props, State> {
  state: State = {
    event: undefined,
    eventToSubmit: {},
    error: false,
  };

  onChange = (name: string, value: any) => {
    this.setState(({ eventToSubmit }) => ({
      eventToSubmit: {
        ...eventToSubmit,
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
    return {
      event: nextProps.event?.data,
      eventToSubmit:
        !prevState.event && nextProps.event.data
          ? nextProps.event?.data
          : prevState.eventToSubmit,
      error: nextProps.event?.error,
    };
  }

  Loading = () => <div>Loading...</div>;

  render() {
    const genderOptions = ['Male', 'Female', 'Attack Helicopter'];
    const timeZoneOptions = [
      'Eastern Standart Time',
      'Another Time',
      'Some Different Zone Idk',
    ];
    const eventTypeOptions = ['Tournament', 'Showcase'];
    const timeDivisionOptions = ['Halves (2)', 'Periods (3)', 'Quarters (4)'];
    const resultsDisplayOptions = [
      'Show Goals Scored',
      'Show Goals Allowed',
      'Show Goals Differential',
      'Allow Ties',
    ];
    const totalRuntimeMin = '50';
    const esDetailsOptions = ['Back to Back Game Warning', 'Require Waivers'];
    const bracketTypeOptions = [
      'Single Elimination',
      'Double Elimination',
      '3 Game Guarantee',
    ];
    const topNumberOfTeams = ['2', '3', '4', '5', '6', '7', '8'];

    const { eventToSubmit: event } = this.state;

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
          timeZoneOptions={timeZoneOptions}
          onChange={this.onChange}
        />

        <EventStructureSection
          eventTypeOptions={eventTypeOptions}
          timeDivisionOptions={timeDivisionOptions}
          resultsDisplayOptions={resultsDisplayOptions}
          totalRuntimeMin={totalRuntimeMin}
          esDetailsOptions={esDetailsOptions}
          onChange={this.onChange}
        />

        <PlayoffsSection
          bracketTypeOptions={bracketTypeOptions}
          topNumberOfTeams={topNumberOfTeams}
          onChange={this.onChange}
        />

        <MediaAssetsSection />

        <SectionDropdown type="section" padding="0">
          <HeadingLevelThree>
            <span className={styles.blockHeading}>Advanced Settings</span>
          </HeadingLevelThree>
          <h2 />
        </SectionDropdown>
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
