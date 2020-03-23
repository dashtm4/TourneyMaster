import React from 'react';
import { Text, View, Image } from '@react-pdf/renderer';
import TMLogo from 'assets/logo.png';
import { IEventDetails } from 'common/models';
import { styles } from './styles';

interface Props {
  event: IEventDetails;
}

const HeaderSchedule = ({ event }: Props) => (
  <View style={styles.header} fixed>
    <View>
      <Text>{event.event_name}</Text>
      <Text>Event Schedule ({'<< Schedule Name>>'})</Text>
    </View>
    <View style={styles.logoWrapper}>
      <Image src={event.event_logo_path || TMLogo} style={styles.logo} />
    </View>
  </View>
);

export default HeaderSchedule;
