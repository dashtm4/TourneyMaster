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

    flexDirection: 'row',
  },
  timeSlot: {
    width: 150,
    height: 30,

    marginBottom: 100,
    backgroundColor: 'red',
  },
  fieldList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  fieldName: {
    width: 150,
    height: 30,

    marginBottom: 100,
    marginRight: 15,
    padding: '0 15px',
  },
});

export { styles };
