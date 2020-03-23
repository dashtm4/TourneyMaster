import React from 'react';
import { Page, Document, View, Text } from '@react-pdf/renderer';
import moment from 'moment';
import TableThead from './components/table-thead';
import TableTbody from './components/table-tbody';
import { HeaderSchedule, PrintedDate } from '../common';
import { IEventDetails } from 'common/models';
import { IGame } from 'components/common/matrix-table/helper';
import { IField } from 'common/models/schedule/fields';
import ITimeSlot from 'common/models/schedule/timeSlots';
import { IScheduleFacility } from 'common/models/schedule/facilities';
import { styles } from './styles';

interface Props {
  event: IEventDetails;
  games: IGame[];
  fields: IField[];
  timeSlots: ITimeSlot[];
  facilities: IScheduleFacility[];
}

const PDFScheduleTable = ({
  event,
  facilities,
  fields,
}: // games,
// timeSlots,
Props) => (
  <Document>
    {facilities.map(facility => {
      const filtredFields = fields.filter(
        field => field.facilityId === facility.id
      );

      return (
        <>
          {filtredFields.map(field => (
            <Page
              size="A4"
              orientation="landscape"
              style={styles.page}
              key={facility.id}
            >
              <HeaderSchedule event={event} />
              <PrintedDate />
              <View style={styles.tableWrapper}>
                <View style={styles.facilityTitle}>
                  <Text style={styles.scheduleDate}>
                    {moment(new Date()).format('l')}
                  </Text>
                  <Text>{facility.name}</Text>
                </View>
                <TableThead field={field} />
                <TableTbody />
              </View>
            </Page>
          ))}
        </>
      );
    })}
  </Document>
);

export default PDFScheduleTable;
