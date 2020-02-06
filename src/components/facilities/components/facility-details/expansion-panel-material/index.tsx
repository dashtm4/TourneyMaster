import {
  ExpansionPanel,
  ExpansionPanelSummary,
  ExpansionPanelDetails,
} from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';

const ExpansionPanelWrapped = withStyles({
  root: {
    width: '100%',
    backgroundColor: 'transparent',
    borderRadius: 0,
    boxShadow: 'none',
  },
})(ExpansionPanel);

const ExpansionPanelSummaryWrapped = withStyles({
  root: {
    padding: 0,
    margin: 0,
    '&$expanded': {
      minHeight: 'unset',
    },
  },
  content: {
    margin: 0,
    '&$expanded': {
      margin: 0,
    },
  },
  expanded: {},
})(ExpansionPanelSummary);

const ExpansionPanelDetailsWrapped = withStyles({
  root: {
    padding: '8px 0 24px',
  },
})(ExpansionPanelDetails);

export {
  ExpansionPanelWrapped,
  ExpansionPanelSummaryWrapped,
  ExpansionPanelDetailsWrapped,
};
