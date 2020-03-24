import { StyleSheet } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  timeSlotRow: {
    flexDirection: 'row',
    alignItems: 'center',

    padding: '0 10px',
  },
  timeSlot: {
    marginRight: 10,

    fontSize: 10,
  },
  gameWrapper: {
    flexDirection: 'column',

    width: 95,
    minHeight: 30,

    padding: '5px 15px',
  },
  gameTeamName: {
    flexDirection: 'row',
    maxLines: 1,
  },
  teamNameWrapper: {
    width: 20,
    textOverflow: 'hidden',
    color: 'red',
  },
});

export { styles };
