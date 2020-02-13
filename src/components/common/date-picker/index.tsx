import React from 'react';
import {
  KeyboardDatePicker,
  KeyboardTimePicker,
  MuiPickersUtilsProvider,
  DatePickerView,
} from '@material-ui/pickers';
import 'date-fns';
import DateFnsUtils from '@date-io/date-fns';
import styles from './style.module.scss';

const defaultWidth = 100;

interface IDatePickerProps {
  label: string;
  value?: string;
  type: string;
  width?: string;
  onChange: any;
  views?: DatePickerView[];
  dateFormat?: string;
}

const DatePicker: React.FC<IDatePickerProps> = ({
  label,
  value,
  onChange,
  type,
  width,
  views,
  dateFormat,
}) => {
  const renderDatePicker = () => (
    <KeyboardDatePicker
      views={views}
      style={{ width: width || defaultWidth }}
      variant="inline"
      size="small"
      inputVariant="outlined"
      value={value}
      format={dateFormat || 'yyyy/MM/dd'}
      onChange={onChange}
    />
  );
  const renderTimePicker = () => (
    <KeyboardTimePicker
      style={{ width: width || defaultWidth }}
      variant="inline"
      size="small"
      inputVariant="outlined"
      placeholder="08:00 AM"
      mask="__:__ _M"
      value={value}
      onChange={onChange}
    />
  );
  return (
    <div className={styles.container}>
      <span className={styles.label}>{label}</span>
      <MuiPickersUtilsProvider utils={DateFnsUtils}>
        {type === 'date' ? renderDatePicker() : renderTimePicker()}
      </MuiPickersUtilsProvider>
    </div>
  );
};

export default DatePicker;
