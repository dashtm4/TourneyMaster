import React from 'react';
import { Page, Document } from '@react-pdf/renderer';
import { HeaderSchedule, PrintedDate } from '../common';
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
}: // fields,
// facilities,
// games,
// timeSlots,
IPDFProps) => (
  <Document>
    <Page size="A4" orientation="landscape" style={styles.page}>
      <HeaderSchedule event={event} />
      <PrintedDate />
    </Page>
  </Document>
);

export default PDFScheduleTable;
