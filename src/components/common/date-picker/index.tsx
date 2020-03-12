import React from 'react';
import {
  DatePicker as InputDatePicker,
  TimePicker as InputTimePicker,
  KeyboardDatePicker,
  KeyboardTimePicker,
  MuiPickersUtilsProvider,
  DatePickerView,
  DateTimePicker,
} from '@material-ui/pickers';
import 'date-fns';
import DateFnsUtils from '@date-io/date-fns';
import styles from './style.module.scss';

// const defaultWidth = 100;

interface IDatePickerProps {
  label: string;
  value?: string | Date;
  type: string;
  width?: string;
  minWidth?: string;
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
  minWidth,
  views,
  dateFormat,
  viewType,
  fullWidth,
}) => {
  const renderInputDatePicker = () => (
    <InputDatePicker
      autoOk={true}
      fullWidth={fullWidth}
      views={views}
      style={{ width, minWidth }}
      variant="inline"
      size="small"
      inputVariant="outlined"
      value={value}
      format={dateFormat || 'MM/dd/yyyy'}
      onChange={onChange}
    />
  );
  const renderDatePicker = () => (
    <KeyboardDatePicker
      autoOk={true}
      fullWidth={fullWidth}
      views={views}
      style={{ width, minWidth }}
      variant="inline"
      size="small"
      inputVariant="outlined"
      value={value}
      format={dateFormat || 'MM/dd/yyyy'}
      onChange={onChange}
    />
  );
  const renderInputTimePicker = () => (
    <InputTimePicker
      autoOk={true}
      fullWidth={fullWidth}
      style={{ width, minWidth }}
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
      autoOk={true}
      fullWidth={fullWidth}
      style={{ width, minWidth }}
      variant="inline"
      size="small"
      inputVariant="outlined"
      placeholder="08:00 AM"
      mask="__:__ _M"
      value={value}
      onChange={onChange}
    />
  );

  const renderDateTimePicker = () => (
    <DateTimePicker
      autoOk={true}
      fullWidth={fullWidth}
      views={views}
      style={{ width, minWidth }}
      variant="inline"
      size="small"
      inputVariant="outlined"
      value={value}
      onChange={onChange}
    />
  );

  const chooseDatePicker = () =>
    viewType === 'input' ? renderInputDatePicker() : renderDatePicker();

  const chooseTimePicker = () =>
    viewType === 'input' ? renderInputTimePicker() : renderTimePicker();

  const renderPicker = () => {
    switch (type) {
      case 'date':
        return chooseDatePicker();
      case 'date-time':
        return renderDateTimePicker();
      default:
        return chooseTimePicker();
    }
  };

  return (
    <div className={styles.container}>
      <span className={styles.label}>{label}</span>
      <MuiPickersUtilsProvider utils={DateFnsUtils}>
        {renderPicker()}
      </MuiPickersUtilsProvider>
    </div>
  );
};

export default DatePicker;
