import { StyleSheet } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  headerWrapper: {
    flexGrow: 1,

    marginRight: 50,
  },
  eventName: {
    marginBottom: 5,

    fontSize: 16,
    borderBottom: 2,

    borderColor: '#333',
  },
  logoWrapper: {
    width: 100,
  },
  logo: {
    objectFit: 'cover',
  },
});

export { styles };
