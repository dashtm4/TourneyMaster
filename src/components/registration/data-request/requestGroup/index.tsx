import React from 'react';
import { useDrop } from 'react-dnd';
import { BindingCbWithTwo, BindingCbWithThree } from 'common/models';
import { DndItems } from 'components/divisions-and-pools/common';
import RequestGroupField from '../requestGroupField';
import styles from '../styles.module.scss';

interface IRequestGroupProps {
  fields: any[];
  updateRequestIds: BindingCbWithTwo<any, string>;
  updateOptions: BindingCbWithThree<number | string, number, boolean>;
}

const RequestGroup = ({
  fields,
  updateRequestIds,
  updateOptions,
}: IRequestGroupProps) => {
  const [, drop] = useDrop({
    accept: DndItems.REGISTRANT_DATA_FIELD,
  });

  return (
    <div ref={drop} className={styles.fieldGroup}>
      {fields.map((field: any, index: number) => (
        <RequestGroupField
          key={index}
          data={field}
          updateRequestIds={updateRequestIds}
          updateOptions={updateOptions}
        />
      ))}
    </div>
  );
};

export default RequestGroup;
