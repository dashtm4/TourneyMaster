import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { IIndividualsRegister } from 'common/models/register';
import { Input, Select, CardMessage } from 'components/common';
import {
  BindingCbWithTwo,
  BindingCbWithOne,
  ISelectOption,
} from 'common/models';
import { CardMessageTypes } from 'components/common/card-message/types';
import { loadRegistrantData } from './logic/actions';
import styles from '../../styles.module.scss';

enum fieldType {
  INPUT = 0,
  SELECT = 1,
}

enum defaultOptions {
  REQUIRED = 1,
  REQUESTED = 2,
  NONE = 0,
}

interface IPlayerStatsProps {
  data: Partial<IIndividualsRegister>;
  onChange: BindingCbWithTwo<string, string | number>;
  jerseyNumberRequired: boolean;
  loadRegistrantData: BindingCbWithOne<string>;
  registrantDataFields: any;
  eventId: string | undefined;
}

const PlayerStats = ({
  data,
  onChange,
  jerseyNumberRequired,
  registrantDataFields,
  eventId,
  loadRegistrantData,
}: IPlayerStatsProps) => {
  useEffect(() => {
    if (eventId) {
      loadRegistrantData(eventId);
    }
  }, []);
  const checkFieldType = (value: string | null) => {
    try {
      if (!value) {
        return { type: fieldType.INPUT, value };
      }

      const parsedArray = JSON.parse(value);
      if (Array.isArray(parsedArray) && parsedArray.length === 1) {
        const parsedObject = parsedArray[0];

        const options = Object.entries(parsedObject).map(el => ({
          value: el[0],
          label: el[1],
        }));
        return {
          type: fieldType.SELECT,
          value: options,
        };
      }
      return { type: fieldType.INPUT, value };
    } catch {
      return { type: fieldType.INPUT, value };
    }
  };

  const renderField = (field: {
    data_defaults: string | null;
    data_label: string;
    is_default_YN: number | null;
  }) => {
    const { value, type } = checkFieldType(field.data_defaults);
    const label = field.data_label;
    const dataType = label.toLowerCase().replace(' ', '_');

    if (type === fieldType.INPUT) {
      return (
        <Input
          fullWidth={true}
          label={
            field.is_default_YN === defaultOptions.REQUIRED
              ? `${field.data_label} *`
              : field.data_label
          }
          isRequired={
            field.is_default_YN === defaultOptions.REQUIRED ? true : false
          }
          value={data[dataType]}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            onChange(dataType, e.target.value)
          }
        />
      );
    } else {
      return (
        <Select
          options={value as ISelectOption[]}
          label={
            field.is_default_YN === defaultOptions.REQUIRED
              ? `${field.data_label} *`
              : field.data_label
          }
          value={data[dataType]}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            onChange(dataType, e.target.value)
          }
        />
      );
    }
  };

  console.log('Player stats', registrantDataFields, jerseyNumberRequired);
  return (
    <div className={styles.section}>
      <div className={styles.sectionRow}>
        {registrantDataFields.map((el: any, index: number) => (
          <div className={styles.sectionItem} key={index}>
            {renderField(el)}
          </div>
        ))}
      </div>
      <div className={styles.toolTipMessage}>
        <CardMessage type={CardMessageTypes.EMODJI_OBJECTS}>
          Omitting data will eliminate it from any coaches books that might be
          distributed.
        </CardMessage>
      </div>
    </div>
  );
};

const mapStateToProps = (state: {
  playerStatsReducer: { registrantDataFields: any };
}) => ({
  registrantDataFields: state.playerStatsReducer.registrantDataFields,
});

const mapDispatchToProps = {
  loadRegistrantData,
};

export default connect(mapStateToProps, mapDispatchToProps)(PlayerStats);
