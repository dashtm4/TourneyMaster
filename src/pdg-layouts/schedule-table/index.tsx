import React from 'react';
import { Page, Text, View, Document } from '@react-pdf/renderer';
import moment from 'moment';
import Header from './components/header';
import TableThead from './components/table-thead';
import TableTbody from './components/table-tbody';
import { IEventDetails } from 'common/models';
import { IGame } from 'components/common/matrix-table/helper';
import { IField } from 'common/models/schedule/fields';
import ITimeSlot from 'common/models/schedule/timeSlots';
import { IScheduleFacility } from 'common/models/schedule/facilities';
import { styles } from './styles';

interface IPDFProps {
  event: IEventDetails;
  games: IGame[];
  fields: IField[];
  timeSlots: ITimeSlot[];
  facilities: IScheduleFacility[];
}

const PDFScheduleTable = ({
  event,
  fields,
  facilities,
  games,
  timeSlots,
}: IPDFProps) => {
  return (
    <Document>
      <Page size="A4" orientation="landscape" style={styles.page}>
        <Header event={event} />
        {facilities.map(facility => {
          const filtredFields = fields.filter(
            field => field.facilityId === facility.id
          );

          return (
            <View style={styles.tableWrapper} key={facility.id}>
              <View style={styles.facilityTitle}>
                <Text style={styles.scheduleDate}>
                  {moment(new Date()).format('l')}
                </Text>
                <Text>{facility.name}</Text>
              </View>
              {filtredFields.reduce((acc, field, idx) => {
                let splitIdx = 0;

                if (idx % 4 === 0 || idx === 0) {
                  if (idx > 0) splitIdx += idx;

                  return [
                    ...acc,
                    <View key={field.id}>
                      <TableThead
                        facility={facility}
                        fields={filtredFields}
                        splitIdx={splitIdx}
                      />
                      <TableTbody
                        facility={facility}
                        timeSlots={timeSlots}
                        games={games}
                        splitIdx={splitIdx}
                      />
                    </View>,
                  ];
                } else {
                  return acc;
                }
              }, [] as JSX.Element[])}
            </View>
          );
        })}
        <View style={styles.printDate} fixed>
          <Text>Printed Date: {moment(new Date()).format('LLL')}</Text>
        </View>
      </Page>
    </Document>
  );
};

export default PDFScheduleTable;
