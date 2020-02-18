import React from 'react';
import {
  DatePicker as InputDatePicker,
  TimePicker as InputTimePicker,
  KeyboardDatePicker,
  KeyboardTimePicker,
  MuiPickersUtilsProvider,
  DatePickerView,
} from '@material-ui/pickers';
import 'date-fns';
import DateFnsUtils from '@date-io/date-fns';
import styles from './style.module.scss';

// const defaultWidth = 100;

interface IDatePickerProps {
  label: string;
  value?: string;
  type: string;
  width?: string;
  onChange: any;
  views?: DatePickerView[];
  dateFormat?: string;
  viewType?: 'default' | 'input';
  fullWidth?: boolean;
}

const DatePicker: React.FC<IDatePickerProps> = ({
  label,
  value,
  onChange,
  type,
  width,
  views,
  dateFormat,
  viewType,
  fullWidth,
}) => {
  const renderInputDatePicker = () => (
    <InputDatePicker
      fullWidth={fullWidth}
      views={views}
      style={{ width }}
      variant="inline"
      size="small"
      inputVariant="outlined"
      value={value}
      format={dateFormat || 'yyyy/MM/dd'}
      onChange={onChange}
    />
  );
  const renderDatePicker = () => (
    <KeyboardDatePicker
      fullWidth={fullWidth}
      views={views}
      style={{ width }}
      variant="inline"
      size="small"
      inputVariant="outlined"
      value={value}
      format={dateFormat || 'yyyy/MM/dd'}
      onChange={onChange}
    />
  );
  const renderInputTimePicker = () => (
    <InputTimePicker
      fullWidth={fullWidth}
      style={{ width }}
      variant="inline"
      size="small"
      inputVariant="outlined"
      placeholder="08:00 AM"
      value={value}
      onChange={onChange}
    />
  );
  const renderTimePicker = () => (
    <KeyboardTimePicker
      fullWidth={fullWidth}
      style={{ width }}
      variant="inline"
      size="small"
      inputVariant="outlined"
      placeholder="08:00 AM"
      mask="__:__ _M"
      value={value}
      onChange={onChange}
    />
  );
  const chooseDatePicker = () =>
    viewType === 'input' ? renderInputDatePicker() : renderDatePicker();

  const chooseTimePicker = () =>
    viewType === 'input' ? renderInputTimePicker() : renderTimePicker();

  return (
    <div className={styles.container}>
      <span className={styles.label}>{label}</span>
      <MuiPickersUtilsProvider utils={DateFnsUtils}>
        {type === 'date' ? chooseDatePicker() : chooseTimePicker()}
      </MuiPickersUtilsProvider>
    </div>
  );
};

export default DatePicker;
