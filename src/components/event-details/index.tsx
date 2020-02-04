import React, { Component } from 'react';
import styles from './style.module.scss';
import SectionDropdown from 'components/common/section-dropdown';
import HeadingLevelThree from 'components/common/headings/heading-level-three';
import HeadingLevelTwo from 'components/common/headings/heading-level-two';
import TextField from 'components/common/input';
import Select from 'components/common/select';
import DatePicker from 'components/common/date-picker';
import Button from 'components/common/buttons/button';
import CodeIcon from '@material-ui/icons/Code';

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

    return (
      <div className={styles.container}>
        <HeadingLevelTwo>
          <>Event Details</>
        </HeadingLevelTwo>

        <SectionDropdown padding="0" summaryPadding="0">
          <HeadingLevelThree>
            <span className={styles.blockHeading}>Primary Information</span>
          </HeadingLevelThree>
          <div className={styles['pi-details']}>
            <div className={styles['pi-details-first']}>
              <TextField width="256px" fullWidth={true} label="Event Name" />
              <TextField width="161px" fullWidth={true} label="Event Tag" />
              <Select
                width="161px"
                options={sportOptions}
                label="Sport"
                value=""
              />
              <Select
                width="160px"
                options={genderOptions}
                label="Gender"
                value=""
              />
            </div>
            <div className={styles['pi-details-second']}>
              <DatePicker
                width="160px"
                label="Start Date"
                type="date"
                onChange={this.onChange}
              />
              <DatePicker
                width="161px"
                label="End Date"
                type="date"
                onChange={this.onChange}
              />
              <Select
                width="256px"
                options={timeZoneOptions}
                label="Time Zone"
                value=""
              />
            </div>
            <div className={styles['pi-details-third']}>
              <TextField
                width="635px"
                label="General Location"
                placeholder="Search google maps"
              />
              <div className={styles['pi-details-third-area']}>
                <TextField
                  width="635px"
                  label="Description"
                  multiline={true}
                  rows="4"
                />
                <div style={{ width: 164 }}>
                  <Button
                    label="Embed Code"
                    icon={<CodeIcon />}
                    color="secondary"
                    variant="text"
                  />
                </div>
              </div>
            </div>
          </div>
        </SectionDropdown>

        <SectionDropdown padding="0" summaryPadding="0">
          <HeadingLevelThree>
            <span className={styles.blockHeading}>Event Structure</span>
          </HeadingLevelThree>
          <h2>BODY</h2>
        </SectionDropdown>

        <SectionDropdown padding="0" summaryPadding="0">
          <HeadingLevelThree>
            <span className={styles.blockHeading}>Playoffs</span>
          </HeadingLevelThree>
          <h2>BODY</h2>
        </SectionDropdown>

        <SectionDropdown padding="0" summaryPadding="0">
          <HeadingLevelThree>
            <span className={styles.blockHeading}>Media Assets</span>
          </HeadingLevelThree>
          <h2>BODY</h2>
        </SectionDropdown>

        <SectionDropdown padding="0" summaryPadding="0">
          <HeadingLevelThree>
            <span className={styles.blockHeading}>Advanced Settings</span>
          </HeadingLevelThree>
          <h2>BODY</h2>
        </SectionDropdown>
      </div>
    );
  }
}

export default EventDetails;
