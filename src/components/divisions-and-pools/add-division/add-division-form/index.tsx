import React from 'react';
import Input from '../../../common/input';
import ColorPicker from '../../../common/color-picker';
import Checkbox from '../../../common/buttons/checkbox';
import styles from '../styles.module.scss';

type InputTargetValue = React.ChangeEvent<HTMLInputElement>;

class AddDivisionForm extends React.Component<any, any> {
  state = { hasUniqueGameDurations: false, hasMessage: true };

  onLongNameChange = (e: InputTargetValue) =>
    this.props.onChange('long_name', e.target.value);

  onShortNameChange = (e: InputTargetValue) =>
    this.props.onChange('short_name', e.target.value);

  onTagChange = (e: InputTargetValue) =>
    this.props.onChange('division_tag', e.target.value);

  onEntryFeeChange = (e: InputTargetValue) =>
    this.props.onChange('entry_fee', e.target.value);

  onDescChange = (e: InputTargetValue) =>
    this.props.onChange('division_description', e.target.value);

  onMaxNumOfTeamsChange = (e: InputTargetValue) =>
    this.props.onChange('max_num_teams', e.target.value);

  onDivisionMessageChange = (e: InputTargetValue) =>
    this.props.onChange('division_message', e.target.value);

  onColorChange = (value: any) => this.props.onChange('division_color', value);

  onHasMessageChange = () => {
    this.setState({
      hasMessage: !this.state.hasMessage,
    });
  };

  onUniqueGameDurationsChange = () => {
    this.setState({
      hasUniqueGameDurations: !this.state.hasUniqueGameDurations,
    });
  };
  render() {
    const {
      long_name,
      short_name,
      division_tag,
      entry_fee,
      division_description,
      max_num_teams,
      division_message,
      division_color,
    } = this.props.division;
    const defaultDivisionColor = '#1C315F';

    return (
      <div className={styles.sectionContainer}>
        <div className={styles.section}>
          <div className={styles.sectionRow}>
            <div className={styles.sectionItemLarge}>
              <Input
                width="351px"
                label="Long Name"
                value={long_name || ''}
                onChange={this.onLongNameChange}
              />
            </div>
            <div className={styles.sectionItem}>
              <Input
                width="161px"
                label="Short Name"
                value={short_name || ''}
                onChange={this.onShortNameChange}
              />
            </div>
            <div className={styles.sectionItem}>
              <Input
                width="161px"
                label="Division Tag"
                startAdornment="@"
                value={division_tag || ''}
                onChange={this.onTagChange}
              />
            </div>
          </div>
          <div className={styles.sectionRow}>
            <div className={styles.sectionItem}>
              <Input
                width="161px"
                label="Entry Fee"
                startAdornment="$"
                type="number"
                value={entry_fee || ''}
                onChange={this.onEntryFeeChange}
              />
            </div>
            <div className={styles.sectionItem}>
              <Input
                width="161px"
                label="Division Description"
                value={division_description || ''}
                onChange={this.onDescChange}
              />
            </div>
            <div className={styles.sectionItem}>
              <Input
                width="161px"
                label="Max # of Teams"
                type="number"
                value={max_num_teams || ''}
                onChange={this.onMaxNumOfTeamsChange}
              />
            </div>
            <div className={styles.sectionItemColorPicker}>
              <p className={styles.sectionLabel}>Color</p>
              <ColorPicker
                value={division_color || defaultDivisionColor}
                onChange={this.onColorChange}
              />
            </div>
          </div>
          <div className={styles.sectionRow}>
            <div>
              <Checkbox
                formLabel=""
                options={[
                  { label: 'Division Message', checked: this.state.hasMessage },
                ]}
                onChange={this.onHasMessageChange}
              />
              {this.state.hasMessage && (
                <Input
                  width="541px"
                  multiline={true}
                  rows="4"
                  value={division_message || ''}
                  onChange={this.onDivisionMessageChange}
                />
              )}
            </div>
          </div>
          <div className={styles.sectionRow}>
            <div>
              <Checkbox
                formLabel=""
                options={[
                  {
                    label: 'Division has Unique Game Durations',
                    checked: this.state.hasUniqueGameDurations,
                  },
                ]}
                onChange={this.onUniqueGameDurationsChange}
              />
              {this.state.hasUniqueGameDurations && (
                <div className={styles.sectionItemTime}>
                  <Input
                    width="170px"
                    fullWidth={true}
                    endAdornment="Minutes"
                    label="Pregame Warmup"
                    value="0"
                  />
                  <span className={styles.innerSpanText}>&nbsp;+&nbsp;</span>
                  <Input
                    width="170px"
                    fullWidth={true}
                    endAdornment="Minutes"
                    label="Time Division Duration"
                    value="0"
                  />
                  <span className={styles.innerSpanText}>
                    &nbsp;(0)&nbsp;+&nbsp;
                  </span>
                  <Input
                    width="170px"
                    fullWidth={true}
                    endAdornment="Minutes"
                    label="Time Between Periods"
                    value="0"
                  />
                  <span className={styles.innerSpanText}>
                    &nbsp;=&nbsp;0&nbsp; Minutes Total Runtime
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default AddDivisionForm;
