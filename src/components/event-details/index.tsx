import React, { Component } from 'react';

import PrimaryInformationSection from './primary-information';
import EventStructureSection from './event-structure';
import PlayoffsSection from './playoffs';

import {
  Button,
  HeadingLevelTwo,
  HeadingLevelThree,
  SectionDropdown,
  Paper,
} from 'components/common';

import styles from './styles.module.scss';
import MediaAssetsSection from './media-assets';

class EventDetails extends Component {
  onChange = () => ({});
  render() {
    const sportOptions = ['Lacrosse', 'Football', 'Baseball'];
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

    return (
      <div className={styles.container}>
        <Paper>
          <div className={styles.paperWrapper}>
            <Button label="Save" color="primary" variant="contained" />
          </div>
        </Paper>
        <HeadingLevelTwo margin="24px 0">Event Details</HeadingLevelTwo>

        <PrimaryInformationSection
          sportOptions={sportOptions}
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

export default EventDetails;
