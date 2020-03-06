import React from 'react';
import styles from '../styles.module.scss';
import { IField } from 'components/schedules';

interface IProps {
  field: IField;
}

const RenderFieldHeader = (props: IProps) => {
  const { field } = props;

  return (
    <th
      key={field.id}
      className={styles.fieldTh}
      style={{ opacity: field.isUnused ? 0.4 : 1 }}
    >
      {field.isPremier ? '*' : ''} {field.name} ({field.facilityId})
    </th>
  );
};

export default RenderFieldHeader;
