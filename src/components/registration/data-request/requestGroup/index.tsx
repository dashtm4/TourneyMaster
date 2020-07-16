import React, { useState } from 'react';
import { useDrop } from 'react-dnd';
import { BindingCbWithOne } from 'common/models';
import { Checkbox as MuiCheckbox } from '@material-ui/core';
import { DndItems } from 'components/registration/data-request/types';
import RequestGroupField from '../requestGroupField';
import styles from '../styles.module.scss';

interface IRequestGroupProps {
  fields: any[];
  options: any;
  updateRequestedIds: BindingCbWithOne<any>;
  updateOptions: BindingCbWithOne<any>;
}

const RequestGroup = ({
  fields,
  options,
  updateRequestedIds,
  updateOptions,
}: IRequestGroupProps) => {
  const [allRequired, setAllRequired] = useState(false);
  const [allRequested, setAllRequested] = useState(false);

  const [, drop] = useDrop({
    accept: DndItems.REGISTRANT_DATA_FIELD,
    drop: () => ({ name: 'requestGroup' }),
  });

  const toggleAllRequired = () => {
    if (!allRequired) {
      setAllRequested(false);
    }
    setAllRequired(!allRequired);
  };

  const toggleAllRequested = () => {
    if (!allRequested) {
      setAllRequired(false);
    }
    setAllRequested(!allRequested);
  };

  return (
    <div ref={drop} className={styles.requestGroup}>
      <div className={styles.requestGroupHeader}>
        <div className={styles.requestGroupHeaderTitle}>Ordered List</div>
        <div className={styles.requestGroupHeaderLabel}>
          <div className={styles.leftHeaderLabel}>Required</div>
          <MuiCheckbox
            color="secondary"
            checked={allRequired}
            onChange={toggleAllRequired}
          />
        </div>
        <div className={styles.requestGroupHeaderLabel}>
          <div className={styles.rightHeaderLabel}>Requested</div>
          <MuiCheckbox
            color="secondary"
            checked={allRequested}
            onChange={toggleAllRequested}
          />
        </div>
      </div>
      {fields.map((field: any, index: number) => (
        <RequestGroupField
          key={index}
          data={field}
          checkedValue={options[field.data_field_id] || null}
          updateRequestedIds={updateRequestedIds}
          updateOptions={updateOptions}
          allRequested={allRequested}
          allRequired={allRequired}
        />
      ))}
    </div>
  );
};

export default RequestGroup;
