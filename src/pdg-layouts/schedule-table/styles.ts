import { StyleSheet } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: {
    padding: 15,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  logoWrapper: {
    width: 100,
  },
  logo: {
    objectFit: 'cover',
  },
  tableWrapper: {
    flexGrow: 1,
    marginBottom: 15,
  },
  facilityTitle: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  scheduleDate: {
    marginRight: 20,
  },
  thead: {
    flexDirection: 'row',
    marginLeft: 100,
  },
  tbody: {},
  fieldName: {
    width: 160,
    height: 30,

    margin: '0 15 0 0',
    padding: '0 15px',
  },
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
  printDate: {
    position: 'absolute',
    left: 15,
    bottom: 15,
  },
});

export { styles };
