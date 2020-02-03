import React from 'react';
import LinearProgress from '@material-ui/core/LinearProgress';
import { makeStyles, withStyles } from '@material-ui/core/styles';

interface Props {
  completed: number
}

const useStyles = makeStyles({
  root: {
    width: '100%'
  }
});

const LinearProgressWrapped = withStyles({
  root: {
    height: 10,
    backgroundColor: '#ffffff',
    borderRadius: 6
  },
  bar: {
    borderRadius: 20,
    backgroundColor: '#00CC47',
  },
})(LinearProgress);

const ProgressBar = ({ completed }: Props) => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <LinearProgressWrapped
        variant="determinate"
        value={completed} />
    </div>
  );
};

export default ProgressBar;
