import React, { Component } from 'react';
import CodeIcon from '@material-ui/icons/Code';

import styles from './style.module.scss';
import {
  Button,
  Radio,
  Checkbox,
  DatePicker,
  HeadingLevelTwo,
  HeadingLevelThree,
  Input,
  SectionDropdown,
  Select,
} from 'components/common';

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
    const totalRuntimeMin = 50;
    const esDetailsOptions = ['Back to Back Game Warning', 'Require Waivers'];

    return (
      <div className={styles.container}>
        <HeadingLevelTwo>
          <>Event Details</>
        </HeadingLevelTwo>

        <SectionDropdown type="section" padding="0">
          <HeadingLevelThree>
            <span className={styles.blockHeading}>Primary Information</span>
          </HeadingLevelThree>
          <div className={styles['pi-details']}>
            <div className={styles['pi-details-first']}>
              <Input width="256px" fullWidth={true} label="Event Name" />
              <Input width="161px" fullWidth={true} label="Event Tag" />
              <Select
                width="161px"
                options={sportOptions}
                label="Sport"
                value={sportOptions[0]}
              />
              <Select
                width="160px"
                options={genderOptions}
                label="Gender"
                value={genderOptions[0]}
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
                value={timeZoneOptions[0]}
              />
            </div>
            <div className={styles['pi-details-third']}>
              <Input
                width="635px"
                label="General Location"
                placeholder="Search google maps"
              />
              <div className={styles['pi-details-third-area']}>
                <Input
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

        <SectionDropdown type="section" padding="0">
          <HeadingLevelThree>
            <span className={styles.blockHeading}>Event Structure</span>
          </HeadingLevelThree>
          <div className={styles['es-details']}>
            <div className={styles['es-details-first']}>
              <div className={styles.column}>
                <Radio
                  options={eventTypeOptions}
                  formLabel="Event Type"
                  onChange={this.onChange}
                />
              </div>
              <div className={styles.column}>
                <Radio
                  options={timeDivisionOptions}
                  formLabel="Time Division"
                  onChange={this.onChange}
                />
              </div>
              <div className={styles.column}>
                <Checkbox
                  options={resultsDisplayOptions}
                  formLabel="Results Display"
                  onChange={this.onChange}
                />
              </div>
              <Input
                width="250px"
                fullWidth={true}
                label="Min # of Game Guarantee"
              />
            </div>
            <div className={styles['es-details-second']}>
              <Input
                width="170px"
                fullWidth={true}
                endAdornment="Minutes"
                label="Pregame Warmup"
              />
              <span className={styles.innerSpanText}>&nbsp;+&nbsp;</span>
              <Input
                width="170px"
                fullWidth={true}
                endAdornment="Minutes"
                label="Time Division Duration"
              />
              <span className={styles.innerSpanText}>
                &nbsp;(2)&nbsp;+&nbsp;
              </span>
              <Input
                width="170px"
                fullWidth={true}
                endAdornment="Minutes"
                label="Time Between Periods"
              />
              <span className={styles.innerSpanText}>
                &nbsp;=&nbsp;{totalRuntimeMin} Minutes Total Runtime
              </span>
            </div>
            <div className={styles['es-details-third']}>
              <Checkbox
                options={esDetailsOptions}
                formLabel="Results Display"
                onChange={this.onChange}
              />
            </div>
          </div>
        </SectionDropdown>

        <SectionDropdown type="section" padding="0">
          <HeadingLevelThree>
            <span className={styles.blockHeading}>Playoffs</span>
          </HeadingLevelThree>
          <h2>BODY</h2>
        </SectionDropdown>

        <SectionDropdown type="section" padding="0">
          <HeadingLevelThree>
            <span className={styles.blockHeading}>Media Assets</span>
          </HeadingLevelThree>
          <h2>BODY</h2>
        </SectionDropdown>

        <SectionDropdown type="section" padding="0">
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
