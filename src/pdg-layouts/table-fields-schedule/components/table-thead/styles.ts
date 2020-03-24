import { StyleSheet } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  thead: {
    flexDirection: 'column',
    marginLeft: 80,
  },
  theadWrapper: {
    flexDirection: 'row',
  },
  theadName: {
    marginBottom: 10,
    padding: 5,

    textAlign: 'center',
    color: '#ffffff',
    backgroundColor: 'dodgerblue',
  },

  gameDetailsWrapper: {
    flexDirection: 'column',
  },
  gameDetails: {
    marginBottom: 10,
    padding: 5,

    color: '#ffffff',
    backgroundColor: '#DCDCDC',
  },
  teamsWrapper: {
    flexDirection: 'row',
  },
  team: {
    padding: 5,

    color: '#ffffff',
    backgroundColor: '#696969',
  },
  scores: {
    padding: 5,

    color: '#ffffff',
    backgroundColor: '#DCDCDC',
  },
  initials: {
    padding: 5,

    color: '#ffffff',
    backgroundColor: '#DCDCDC',
  },
});

export { styles };
