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
    <View style={styles.thead}>
      <Text style={styles.theadName}>{field.name}</Text>
      <View style={styles.theadWrapper}>
        <View style={styles.gameDetailsWrapper}>
          <View style={styles.gameDetails}>
            <Text>Game Details</Text>
          </View>
          <View style={styles.teamsWrapper}>
            <Text style={styles.team}>Away Team</Text>
            <Text style={styles.team}>Home Team</Text>
          </View>
        </View>
        <Text style={styles.scores}>Final Scores</Text>
        <Text style={styles.initials}>Initials</Text>
      </View>
    </View>
  </>
);

export default TableThead;
