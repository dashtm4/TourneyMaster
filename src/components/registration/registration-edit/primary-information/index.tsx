import React from 'react';
import styles from '../styles.module.scss';
import { Input, DatePicker, Checkbox, Tooltip } from 'components/common';
import { IRegistration } from 'common/models/registration';
import { BindingCbWithTwo, IDivision } from 'common/models';

interface IPrimaryInformationProps {
  data?: IRegistration;
  onChange: BindingCbWithTwo<string, string | number>;
  divisions: IDivision[];
}

const PrimaryInformation = ({
  data,
  onChange,
  divisions,
}: IPrimaryInformationProps) => {
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

  const onUpchargeProcessingFeesChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => onChange('upcharge_fees_on_registrations', Number(e.target.checked));

  const onFeesVaryByDivisionChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    onChange('fees_vary_by_division_YN', Number(e.target.checked));

  const onDivisionFeesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const divisionFees =
      data && data.division_fees ? JSON.parse(data.division_fees) : {};
    divisionFees[e.target.name] = e.target.value;
    onChange('division_fees', JSON.stringify(divisionFees));
  };

  const renderDivisionFeesCheckbox = () => {
    return (
      <div className={styles.sectionThirdRow}>
        <Checkbox
          onChange={onFeesVaryByDivisionChange}
          options={[
            {
              label: 'Division Fees Vary',
              checked: Boolean(data ? data.fees_vary_by_division_YN : false),
              disabled: !divisions.length,
            },
          ]}
        />
      </div>
    );
  };

  console.log(data?.division_fees);
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
            autofocus={true}
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
      <div className={styles.sectionThirdRow}>
        <Checkbox
          onChange={onUpchargeProcessingFeesChange}
          options={[
            {
              label: 'Upcharge Processing Fees',
              checked: Boolean(
                data ? data.upcharge_fees_on_registrations : false
              ),
            },
          ]}
        />
      </div>
      {divisions.length ? (
        renderDivisionFeesCheckbox()
      ) : (
        <Tooltip
          type="info"
          title="Divisions have not been created yet. Please, create your divisions first."
        >
          {renderDivisionFeesCheckbox()}
        </Tooltip>
      )}
      {data && data.fees_vary_by_division_YN ? (
        <div className={styles.sectionFourthRow}>
          {divisions.map(division => (
            <Input
              key={division.division_id}
              startAdornment="$"
              name={division.division_id}
              fullWidth={true}
              label={division.long_name}
              value={
                data && data.division_fees
                  ? JSON.parse(data.division_fees)[division.division_id]
                  : ''
              }
              onChange={onDivisionFeesChange}
            />
          ))}
        </div>
      ) : null}
    </div>
  );
};

export default PrimaryInformation;
