import React from 'react';
import Input from '../../../common/input';
import ColorPicker from '../../../common/color-picker';
import Checkbox from '../../../common/buttons/checkbox';
import styles from '../styles.module.scss';
import { BindingCbWithThree, IDivision } from 'common/models';
import { IRegistration } from 'common/models/registration';

type InputTargetValue = React.ChangeEvent<HTMLInputElement>;

interface IAddDivisionFormState {
  hasUniqueGameDurations: boolean;
  hasMessage: boolean;
}
interface IAddDivisionFormProps {
  onChange: BindingCbWithThree<string, string, number>;
  index: number;
  division: Partial<IDivision>;
  registration?: IRegistration;
}

class AddDivisionForm extends React.Component<
  IAddDivisionFormProps,
  IAddDivisionFormState
> {
  state = { hasUniqueGameDurations: false, hasMessage: true };

  onLongNameChange = (e: InputTargetValue) =>
    this.props.onChange('long_name', e.target.value, this.props.index);

  onShortNameChange = (e: InputTargetValue) =>
    this.props.onChange('short_name', e.target.value, this.props.index);

  onTagChange = (e: InputTargetValue) =>
    this.props.onChange('division_tag', e.target.value, this.props.index);

  onEntryFeeChange = (e: InputTargetValue) =>
    this.props.onChange('entry_fee', e.target.value, this.props.index);

  onDescChange = (e: InputTargetValue) =>
    this.props.onChange(
      'division_description',
      e.target.value,
      this.props.index
    );

  onMaxNumOfTeamsChange = (e: InputTargetValue) =>
    this.props.onChange('max_num_teams', e.target.value, this.props.index);

  onDivisionMessageChange = (e: InputTargetValue) =>
    this.props.onChange('division_message', e.target.value, this.props.index);

  onColorChange = (value: string) =>
    this.props.onChange('division_hex', value, this.props.index);

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
      division_hex,
    } = this.props.division;
    const defaultDivisionColor = '#1C315F';

    return (
      <div className={styles.sectionContainer}>
        <div className={styles.section}>
          <div className={styles.sectionRow}>
            <div className={styles.sectionItemLarge}>
              <Input
                fullWidth={true}
                label="Long Name"
                value={long_name || ''}
                onChange={this.onLongNameChange}
              />
            </div>
            <div className={styles.sectionItem}>
              <Input
                fullWidth={true}
                label="Short Name"
                value={short_name || ''}
                onChange={this.onShortNameChange}
              />
            </div>
            <div className={styles.sectionItem}>
              <Input
                fullWidth={true}
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
                fullWidth={true}
                label="Entry Fee"
                startAdornment="$"
                type="number"
                value={entry_fee || ''}
                onChange={this.onEntryFeeChange}
              />
            </div>
            <div className={styles.sectionItem}>
              <Input
                fullWidth={true}
                label="Division Description"
                value={division_description || ''}
                onChange={this.onDescChange}
              />
            </div>
            <div className={styles.sectionItem}>
              <Input
                fullWidth={true}
                label="Max # of Teams"
                type="number"
                value={max_num_teams || ''}
                onChange={this.onMaxNumOfTeamsChange}
              />
            </div>
            <div className={styles.sectionItemColorPicker}>
              <p className={styles.sectionLabel}>Color</p>
              <ColorPicker
                value={division_hex || defaultDivisionColor}
                onChange={this.onColorChange}
              />
            </div>
          </div>
          <div className={styles.sectionRowColumn}>
            <div>
              <Checkbox
                formLabel=""
                options={[
                  { label: 'Division Message', checked: this.state.hasMessage },
                ]}
                onChange={this.onHasMessageChange}
              />
            </div>
            <div className={styles.sectionItemLarge}>
              {this.state.hasMessage && (
                <Input
                  fullWidth={true}
                  multiline={true}
                  rows="5"
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
                    fullWidth={true}
                    endAdornment="Minutes"
                    label="Pregame Warmup"
                    value="0"
                  />
                  <span className={styles.innerSpanText}>&nbsp;+&nbsp;</span>
                  <Input
                    fullWidth={true}
                    endAdornment="Minutes"
                    label="Time Division Duration"
                    value="0"
                  />
                  <span className={styles.innerSpanText}>
                    &nbsp;(0)&nbsp;+&nbsp;
                  </span>
                  <Input
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
