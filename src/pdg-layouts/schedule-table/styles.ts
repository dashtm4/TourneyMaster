import { StyleSheet } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: {
    padding: 15,
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
  printDate: {
    position: 'absolute',
    left: 15,
    bottom: 15,
  },
});

export { styles };
