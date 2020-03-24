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
import { getFieldsByFacilityId, getGamesByFieldId } from '../helpers';
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
  timeSlots,
  games,
}: Props) => (
  <Document>
    {facilities.map(facility => {
      const fieldsByFacility = getFieldsByFacilityId(fields, facility);

      return fieldsByFacility.map(field => (
        <Page
          size="A4"
          orientation="portrait"
          style={styles.page}
          key={field.id}
        >
          <HeaderSchedule event={event} />
          <PrintedDate />
          <View style={styles.tableWrapper}>
            <View style={styles.facilityWrapper}>
              <Text style={styles.scheduleDate}>
                {moment(new Date()).format('l')}
              </Text>
              <Text style={styles.facilityName}>{facility.name}</Text>
            </View>
            <TableThead field={field} />
            <TableTbody
              timeSlots={timeSlots}
              games={getGamesByFieldId(games, field)}
            />
          </View>
          <PrintedDate />
          <Text
            style={styles.pageNumber}
            render={({ pageNumber, totalPages }) =>
              `${pageNumber} / ${totalPages}`
            }
            fixed
          />
        </Page>
      ));
    })}
  </Document>
);

export default PDFScheduleTable;
