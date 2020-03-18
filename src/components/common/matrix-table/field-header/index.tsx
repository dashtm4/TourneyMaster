import React from 'react';
import styles from '../styles.module.scss';
import { IField } from 'common/models/schedule/fields';
import { IScheduleFacility } from 'common/models/schedule/facilities';

interface IProps {
  field: IField;
  facility?: IScheduleFacility;
}

const RenderFieldHeader = (props: IProps) => {
  const { field, facility } = props;

  return (
    <th
      key={field.id}
      className={styles.fieldTh}
      style={{ opacity: field.isUnused ? 0.4 : 1 }}
    >
      {field.isPremier ? '*' : ''} {field.name} ({facility?.abbr})
    </th>
  );
};

export default RenderFieldHeader;
