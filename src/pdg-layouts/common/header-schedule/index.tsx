import React from 'react';
import { Text, View, Image } from '@react-pdf/renderer';
import TMLogo from 'assets/logo.png';
import { IEventDetails, ISchedule } from 'common/models';
import { styles } from './styles';

interface Props {
  event: IEventDetails;
  schedule: ISchedule;
}

const HeaderSchedule = ({ event, schedule }: Props) => (
  <View style={styles.header} fixed>
    <View style={styles.headerWrapper}>
      <Text style={styles.eventName}>{event.event_name}</Text>
      <Text>Event Schedule ({`${schedule.schedule_name}`})</Text>
    </View>
    <View style={styles.logoWrapper}>
      <Image src={event.event_logo_path || TMLogo} style={styles.logo} />
    </View>
  </View>
);

export default HeaderSchedule;
