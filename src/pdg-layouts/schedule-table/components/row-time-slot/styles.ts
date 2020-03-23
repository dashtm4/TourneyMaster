import { StyleSheet } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  timeSlotRow: {
    flexDirection: 'row',
  },
  timeSlot: {
    marginRight: 40,
    paddingTop: 10,
  },
  gameWrapper: {
    flexDirection: 'column',

    width: 160,
    height: 40,

    margin: '0 15 15 0',
    padding: '0 15px',
  },
  gameTeamName: {
    height: 20,
    textOverflow: 'ellipsis',
    maxLines: 1,
  },
});

export { styles };
