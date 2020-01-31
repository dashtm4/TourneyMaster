import React from 'react';
import { createMuiTheme } from '@material-ui/core/styles';
import { ThemeProvider } from '@material-ui/core/styles';
import {
  KeyboardDatePicker,
  KeyboardTimePicker,
  MuiPickersUtilsProvider,
} from '@material-ui/pickers';
import 'date-fns';
import DateFnsUtils from '@date-io/date-fns';

const theme = createMuiTheme({
  typography: {
    fontFamily: 'Open Sans',
  },
  palette: {
    primary: {
      main: '#00A3EA',
    },
  },
  overrides: {
    MuiTextField: {
      root: {
        minWidth: 300,
        '&:hover .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline': {
          borderColor: '#00A3EA',
        },
      },
    },
  },
});

interface IDatePickerProps {
  label: string;
  value: string;
  type: string;
  onChange: () => {};
}

const DatePicker: React.FC<IDatePickerProps> = ({
  label,
  value,
  onChange,
  type,
}) => {
  const renderDatePicker = () => (
    <KeyboardDatePicker
      label={label}
      variant="inline"
      inputVariant="outlined"
      value={value}
      format="yyyy/MM/dd"
      // onChange={date => onChange(date)}
      onChange={onChange}
    />
  );
  const renderTimePicker = () => (
    <KeyboardTimePicker
      label={label}
      variant="inline"
      inputVariant="outlined"
      placeholder="08:00 AM"
      mask="__:__ _M"
      value={value}
      // onChange={date => handleDateChange(date)}
      onChange={onChange}
    />
  );
  return (
    <ThemeProvider theme={theme}>
      <MuiPickersUtilsProvider utils={DateFnsUtils}>
        {type === 'date' ? renderDatePicker() : renderTimePicker()}
      </MuiPickersUtilsProvider>
    </ThemeProvider>
  );
};

export default DatePicker;
