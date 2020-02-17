import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';

const useStyles = makeStyles(() => ({
  root: {
    padding: '12px',
    backgroundColor: '#F4F4F4',
    boxShadow: '0 1px 10px 0 rgba(0,0,0,0.1)',
  },
  sticky: {
    position: 'sticky',
    top: 0,
    zIndex: 1,
  },
}));

const LightPaper = ({ children, sticky }: any) => {
  const classes = useStyles();

  return (
    <Paper
      elevation={3}
      className={`${classes.root} ${sticky && classes.sticky}`}
    >
      {children}
    </Paper>
  );
};

export default LightPaper;
