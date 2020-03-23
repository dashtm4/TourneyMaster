import React from 'react';
import { Text, View } from '@react-pdf/renderer';
import { IScheduleFacility } from 'common/models/schedule/facilities';
import { IField } from 'common/models/schedule/fields';
import { styles } from './styles';

interface Props {
  facility: IScheduleFacility;
  fields: IField[];
  splitIdx: number;
}

const TableThead = ({ facility, fields, splitIdx }: Props) => (
  <View style={styles.thead} fixed>
    {fields
      .map(field => (
        <Text key={field.id} style={styles.fieldName}>
          {`${field.name} ${facility.abbr}`}
        </Text>
      ))
      .slice(splitIdx, splitIdx + 8)}
  </View>
);

export default TableThead;
