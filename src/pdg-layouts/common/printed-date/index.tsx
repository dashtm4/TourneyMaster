import React from 'react';
import { Text, View } from '@react-pdf/renderer';
import moment from 'moment';
import { styles } from './styles';

const PrintedDate = () => (
  <View style={styles.printDate} fixed>
    <Text>Printed Date: {moment(new Date()).format('LLL')}</Text>
  </View>
);

export default PrintedDate;
