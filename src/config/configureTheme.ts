import { createMuiTheme } from '@material-ui/core';

const defaultWidth = 100;

export default () =>
  createMuiTheme({
    typography: {
      fontFamily: 'Open Sans',
      fontSize: 14,
    },
    palette: {
      primary: {
        main: '#1C315F',
      },
      secondary: {
        main: '#00A3EA',
      },
    },
    overrides: {
      MuiTextField: {
        root: {
          backgroundColor: '#FFFFFF',
          borderRadius: '4px',
          minWidth: defaultWidth,
          borderColor: '#dddedf',
          boxShadow: 'none',
          border: '1px solid #CDCFD2',
          '&:hover .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline': {
            borderColor: '#00A3EA',
          },
        },
      },
      MuiOutlinedInput: {
        root: {
          color: '#6A6A6A',
        },
      },
      MuiButton: {
        root: {
          borderRadius: '21px',
          textTransform: 'none',
        },
      },
      MuiFormControlLabel: {
        root: {
          color: '#6A6A6A',
        },
      },
    },
  });
