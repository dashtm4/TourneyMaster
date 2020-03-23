import React from 'react';
import { View, Text } from '@react-pdf/renderer';
// import { IGame } from 'components/common/matrix-table/helper';
import { IField } from 'common/models/schedule/fields';
// import ITimeSlot from 'common/models/schedule/timeSlots';
import { styles } from './styles';

interface Props {
  field: IField;
  // games: IGame[];
  // timeSlots: ITimeSlot[];
}

const TableThead = ({ field }: Props) => (
  <>
    <View style={styles.thead} debug>
      <Text>{field.name}</Text>
    </View>
    <View style={styles.gameDetails}>
      <Text>Game Details</Text>
      <View style={styles.teamsWrapper}>
        <Text>Away Team</Text>
        <Text>Home Team</Text>
      </View>
    </View>
  </>
);

export default TableThead;
