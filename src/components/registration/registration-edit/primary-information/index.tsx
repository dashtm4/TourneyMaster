import React from 'react';
import styles from '../styles.module.scss';
import { Input, DatePicker } from 'components/common';
import { IRegistration } from 'common/models/registration';
import { BindingCbWithTwo } from 'common/models';

interface IPrimaryInformationProps {
  data?: IRegistration;
  onChange: BindingCbWithTwo<string, string>;
}

const PrimaryInformation = ({ data, onChange }: IPrimaryInformationProps) => {
  const onOpenDateChange = (e: Date | string) =>
    !isNaN(Number(e)) &&
    onChange('registration_start', new Date(e).toISOString());

  const onCloseDateChange = (e: Date | string) =>
    !isNaN(Number(e)) &&
    onChange('registration_end', new Date(e).toISOString());

  const onEntryFeeChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    onChange('entry_fee', e.target.value);

  const onDepositFeeChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    onChange('entry_deposit', e.target.value);

  const onEarlyBirdDiscountChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    onChange('early_bird_discount', e.target.value);

  const onDiscountEndDateChange = (e: Date | string) =>
    !isNaN(Number(e)) &&
    onChange('discount_enddate', new Date(e).toISOString());

  return (
    <div className={styles.section}>
      <div className={styles.sectionFirstRow}>
        <div className={styles.sectionItem} />
        <div className={styles.sectionItem} />
        <div className={styles.sectionItem}>
          <DatePicker
            fullWidth={true}
            label="Open Date"
            type="date"
            value={data ? data.registration_start : new Date()}
            onChange={onOpenDateChange}
          />
        </div>
        <div className={styles.sectionItem}>
          <DatePicker
            fullWidth={true}
            label="Close Date"
            type="date"
            value={data ? data.registration_end : new Date()}
            onChange={onCloseDateChange}
          />
        </div>
      </div>
      <div className={styles.sectionSecondRow}>
        <div className={styles.sectionItem}>
          <Input
            fullWidth={true}
            label="Entry Fee"
            startAdornment="$"
            type="number"
            value={data ? data.entry_fee : ''}
            onChange={onEntryFeeChange}
          />
        </div>
        <div className={styles.sectionItem}>
          <Input
            fullWidth={true}
            label="Deposit Fee"
            startAdornment="$"
            type="number"
            value={data ? data.entry_deposit : ''}
            onChange={onDepositFeeChange}
          />
        </div>
        <div className={styles.sectionItem}>
          <Input
            fullWidth={true}
            label="Early Bird Discount"
            startAdornment="$"
            type="number"
            value={data ? data.early_bird_discount : ''}
            onChange={onEarlyBirdDiscountChange}
          />
        </div>
        <div className={styles.sectionItem}>
          <DatePicker
            fullWidth={true}
            label="Discount End Date"
            type="date"
            value={data ? data.discount_enddate : new Date()}
            onChange={onDiscountEndDateChange}
          />
        </div>
      </div>
    </div>
  );
};

export default PrimaryInformation;
