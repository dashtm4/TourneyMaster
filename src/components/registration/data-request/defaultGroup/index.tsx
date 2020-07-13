import React from 'react';
import { BindingCbWithTwo } from 'common/models';
import DefaultGroupField from '../defaultGroupField';
import { ButtonVariant, ButtonColors } from 'common/enums';
import { Button } from 'components/common';
import styles from '../styles.module.scss';

interface IDefaultGroupProps {
  fields: any[];
  updateRequestIds: BindingCbWithTwo<any, string>;
  onAddNewField: () => void;
}

const DefaultGroup = ({
  fields,
  updateRequestIds,
  onAddNewField,
}: IDefaultGroupProps) => {
  return (
    <div className={styles.fieldGroup}>
      <Button
        onClick={onAddNewField}
        variant={ButtonVariant.TEXT}
        color={ButtonColors.SECONDARY}
        label="+ Add New Field"
      />
      {fields.map((field: any, index: number) => (
        <DefaultGroupField
          data={field}
          updateRequestIds={updateRequestIds}
          key={index}
        />
      ))}
    </div>
  );
};

export default DefaultGroup;
