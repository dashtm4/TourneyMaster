import { StyleSheet } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  timeSlotRow: {
    flexDirection: 'row',
  },
  timeSlot: {
    padding: '18px 15px 0 10px',

    fontSize: 10,
  },
  gameWrapper: {
    flexDirection: 'column',

    width: 95,
    height: 40,

    padding: '5px 15px',
  },
  gameTeamName: {
    height: 20,
    textOverflow: 'ellipsis',
    maxLines: 1,
  },
});

export { styles };
