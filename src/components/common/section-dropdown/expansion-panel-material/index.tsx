import { ExpansionPanel } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';

const ExpansionPanelWrapped = withStyles({
  root: {
    width: '100%',
    backgroundColor: 'transparent',
    borderRadius: 0,
    boxShadow: 'none',
  },
})(ExpansionPanel);

export { ExpansionPanelWrapped };
