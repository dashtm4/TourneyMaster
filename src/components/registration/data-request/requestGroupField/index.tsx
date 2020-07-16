import React, { useEffect } from 'react';
import { useDrag, DragSourceMonitor } from 'react-dnd';
import { FormControlLabel, Radio as MuiRadio } from '@material-ui/core';
import { BindingCbWithOne } from 'common/models';
import { DndItems } from 'components/registration/data-request/types';
import moveIcon from 'assets/moveIcon.png';
import styles from '../styles.module.scss';

interface IRequestGroupFieldProps {
  data: any;
  updateRequestedIds: BindingCbWithOne<any>;
  updateOptions: BindingCbWithOne<any>;
  checkedValue: number | null;
  allRequested: boolean;
  allRequired: boolean;
}

enum defaultOptions {
  REQUIRED = 1,
  REQUESTED = 2,
  NONE = 0,
}

const RequestGroupField = ({
  data,
  checkedValue,
  updateRequestedIds,
  updateOptions,
  allRequested,
  allRequired,
}: IRequestGroupFieldProps) => {
  const [, drag] = useDrag({
    item: { type: DndItems.REGISTRANT_DATA_FIELD },
    end(_, monitor: DragSourceMonitor) {
      const dropResult = monitor.getDropResult();

      if (!dropResult) {
        return;
      }

      const { name } = dropResult;
      if (name === 'defaultGroup') {
        updateRequestedIds({
          id: data.data_field_id,
          status: 'remove',
        });
        updateOptions({
          id: data.data_field_id,
          value: null,
          status: 'remove',
        });
      }
    },
  });

  useEffect(() => {
    if (allRequested) {
      onChange(defaultOptions.REQUESTED);
    }
    if (allRequired) {
      onChange(defaultOptions.REQUIRED);
    }
  }, [allRequested, allRequired]);

  const onChange = (value: any) => {
    updateOptions({
      id: data.data_field_id,
      value,
      status: 'add',
    });
  };

  return (
    <div ref={drag} className={styles.fieldWrapper}>
      <div className={styles.field}>
        {data.data_field_id}
        {data.data_label}
      </div>
      <div className={styles.selectWrapper}>
        <FormControlLabel
          value={checkedValue === defaultOptions.REQUIRED}
          control={
            <MuiRadio
              checked={checkedValue === defaultOptions.REQUIRED}
              color="secondary"
            />
          }
          label=""
          onChange={() => onChange(defaultOptions.REQUIRED)}
        />
        <FormControlLabel
          value={checkedValue === defaultOptions.REQUESTED}
          control={
            <MuiRadio
              checked={checkedValue === defaultOptions.REQUESTED}
              color="secondary"
            />
          }
          label=""
          onChange={() => onChange(defaultOptions.REQUESTED)}
        />
        {/* <Radio
          options={defaultRadioOptions}
          formLabel=""
          checked={defaultRadioOptions[value]}
          onChange={onChange}
          row={true}
        /> */}
        {/* <Select options={requiredOptions} value={value} onChange={onChange} /> */}
      </div>
      <span className={styles.iconWrapper}>
        <img
          src={moveIcon}
          style={{
            width: '21px',
            height: '21px',
            alignSelf: 'center',
          }}
          alt=""
        />
      </span>
    </div>
  );
};

export default RequestGroupField;
