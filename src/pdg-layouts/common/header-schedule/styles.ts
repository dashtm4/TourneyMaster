import { StyleSheet } from '@react-pdf/renderer';

const styles = StyleSheet.create({
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
});

export { styles };
