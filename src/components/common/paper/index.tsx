import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';

const useStyles = makeStyles(() => ({
  root: {
    padding: '12px',
  },
}));

const LightPaper = ({ children }: any) => {
  const classes = useStyles();

  return (
    <Paper elevation={3} className={classes.root}>
      {children}
    </Paper>
  );
};

export default LightPaper;
