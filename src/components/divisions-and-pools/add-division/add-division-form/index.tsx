import React from 'react';
import Input from '../../../common/input';
import ColorPicker from '../../../common/color-picker';
import Checkbox from '../../../common/buttons/checkbox';
import styles from '../styles.module.scss';
type InputTargetValue = React.ChangeEvent<HTMLInputElement>;

const AddDivisionForm = ({ onChange }: any) => {
  const onLongNameChange = (e: InputTargetValue) =>
    onChange('long_name', e.target.value);

  const onShortNameChange = (e: InputTargetValue) =>
    onChange('short_name', e.target.value);

  const onTagChange = (e: InputTargetValue) =>
    onChange('division_tag', e.target.value);

  const onEntryFeeChange = (e: InputTargetValue) =>
    onChange('entry_fee', e.target.value);

  const onDescChange = (e: InputTargetValue) =>
    onChange('division_description', e.target.value);

  const onMaxNumOfTeamsChange = (e: InputTargetValue) =>
    onChange('max_num_teams', e.target.value);

  return (
    <div className={styles.sectionContainer}>
      <div className={styles.section}>
        <div className={styles.sectionRow}>
          <div className={styles.sectionItemLarge}>
            <Input
              width="351px"
              label="Long Name"
              // value={ || ''}
              onChange={onLongNameChange}
            />
          </div>
          <div className={styles.sectionItem}>
            <Input
              width="161px"
              label="Short Name"
              // value={ || ''}
              onChange={onShortNameChange}
            />
          </div>
          <div className={styles.sectionItem}>
            <Input
              width="161px"
              label="Division Tag"
              startAdornment="@"
              // value={ || ''}
              onChange={onTagChange}
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
              // value={data.entry_fee || ''}
              onChange={onEntryFeeChange}
            />
          </div>
          <div className={styles.sectionItem}>
            <Input
              width="161px"
              label="Division Description"
              // value={data.entry_fee || ''}
              onChange={onDescChange}
            />
          </div>
          <div className={styles.sectionItem}>
            <Input
              width="161px"
              label="Max # of Teams"
              type="number"
              // value={data.entry_fee || ''}
              onChange={onMaxNumOfTeamsChange}
            />
          </div>
          <div className={styles.sectionItemColorPicker}>
            <p className={styles.sectionLabel}>Color</p>
            <ColorPicker />
          </div>
        </div>
        <div className={styles.sectionRow}>
          <div>
            <Checkbox
              formLabel=""
              options={[{ label: 'Division Message', checked: Boolean(0) }]}
              onChange={() => {
                console.log('dsf');
              }}
            />
            <Input width="541px" multiline={true} rows="4" />
          </div>
        </div>
        <div className={styles.sectionRow}>
          <div>
            <Checkbox
              formLabel=""
              options={[
                {
                  label: 'Division has Unique Game Durations',
                  checked: Boolean(0),
                },
              ]}
              onChange={() => {
                console.log('dsf');
              }}
            />
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
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddDivisionForm;
