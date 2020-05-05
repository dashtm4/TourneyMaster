import React from 'react';
import styles from '../../styles.module.scss';
import { Input, Select, Loader } from 'components/common';
import { BindingCbWithTwo } from 'common/models';
import { IIndivisualsRegister } from 'common/models/register';
import { CardElement } from '@stripe/react-stripe-js';
import stripeLogo from 'assets/stripeLogo.png';
import CardHelp from '../../card-help';

interface IPaymentProps {
  data: Partial<IIndivisualsRegister>;
  onChange: BindingCbWithTwo<string, string | number>;
  processing: boolean;
  purchasing: boolean;
}

const paymentMethodOptions = [
  { label: 'Check', value: 'Check' },
  { label: 'Credit Card', value: 'Credit Card' },
  { label: 'ACH', value: 'ACH' },
];
const paymentSelectionOptions = [
  { label: 'Full', value: 'Full' },
  { label: 'Partial', value: 'Partial' },
  { label: 'Deposit', value: 'Deposit' },
];

const Payment = ({ data, onChange, processing }: IPaymentProps) => {
  const onPaymentMethodChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    onChange('payment_method', e.target.value);

  const onDiscountCodeChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    onChange('discount_code', e.target.value);

  const onPaymentSelectionChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    onChange('payment_selection', e.target.value);

  const onPaymentAmountChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    onChange('payment_amount', e.target.value);

  const paymentForm = (
    <div className={styles.section}>
      <div className={styles.sectionRow}>
        <div className={styles.sectionItem}>
          <Select
            options={paymentMethodOptions}
            label="Payment Method"
            value={data.payment_method || ''}
            onChange={onPaymentMethodChange}
          />
        </div>
        <div className={styles.sectionItem}>
          <Input
            fullWidth={true}
            label="Discount Code"
            value={data.discount_code || ''}
            onChange={onDiscountCodeChange}
          />
        </div>
        <div className={styles.sectionItem}>
          <Select
            options={paymentSelectionOptions}
            label="Payment Selection"
            value={data.payment_selection || ''}
            disabled={true}
            onChange={onPaymentSelectionChange}
          />
        </div>
        <div className={styles.sectionItem}>
          <Input
            fullWidth={true}
            type="number"
            label="Payment Amount"
            value={data.payment_amount || ''}
            disabled={true}
            onChange={onPaymentAmountChange}
          />
        </div>
      </div>
      <div style={{ display: 'flex' }}>
        <div style={{ display: 'flex', flexDirection: 'column', width: '48%' }}>
          <div className={styles.sectionTitle}>Card Details</div>
          <CardElement
            className={styles.stripeElement}
            options={{
              disabled:
                data.payment_method !== 'Credit Card' || processing
                  ? true
                  : false,
              iconStyle: 'solid',
              style: {
                base: {
                  iconColor: '#1c315f',
                  fontSize: '16px',
                  color: '#6a6a6a',
                  '::placeholder': {
                    color: '#aab7c4',
                  },
                },
                invalid: {
                  color: '#9e2146',
                },
              },
            }}
          />
          <CardHelp />
        </div>
        <img
          src={stripeLogo}
          style={{
            marginLeft: '46px',
            width: '150px',
            height: '75px',
          }}
          alt="Stripe logo"
        />
      </div>
    </div>
  );

  return processing ? <Loader /> : paymentForm;
};

export default Payment;
