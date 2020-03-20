import React from 'react';
import { Page, Text, View, Document, Image } from '@react-pdf/renderer';
import moment from 'moment';
import { formatTimeSlot } from 'helpers';
import { IEventDetails } from 'common/models';
import { IGame } from 'components/common/matrix-table/helper';
import { IField } from 'common/models/schedule/fields';
import ITimeSlot from 'common/models/schedule/timeSlots';
import { IScheduleFacility } from 'common/models/schedule/facilities';
import TMLogo from 'assets/logo.png';
import { styles } from './styles';

import { selectProperGamesPerTimeSlot } from 'components/common/matrix-table/helper';

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
        <View style={styles.header} fixed>
          <View>
            <Text>{event.event_name}</Text>
            <Text>Event Schedule ({'<< Schedule Name>>'})</Text>
          </View>
          <View style={styles.logoWrapper}>
            <Image src={event.event_logo_path || TMLogo} style={styles.logo} />
          </View>
        </View>
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
                  if (idx !== 0) splitIdx += idx;

                  return [
                    ...acc,
                    <View key={field.id}>
                      <View style={styles.thead}>
                        {filtredFields
                          .map(field => (
                            <Text key={field.id} style={styles.fieldName}>
                              {`${field.name} ${facility.abbr}`}
                            </Text>
                          ))
                          .slice(splitIdx, splitIdx + 4)}
                      </View>
                      <View style={styles.tbody}>
                        {timeSlots.map((timeSlot: ITimeSlot) => (
                          <View
                            key={timeSlot.id}
                            style={styles.timeSlotRow}
                            wrap={false}
                          >
                            <Text style={styles.timeSlot}>
                              {formatTimeSlot(timeSlot.time)}
                            </Text>
                            {selectProperGamesPerTimeSlot(timeSlot, games)
                              .reduce((acc, game) => {
                                return game.facilityId === facility.id
                                  ? [
                                      ...acc,
                                      <View
                                        style={styles.gameWrapper}
                                        key={game.id}
                                      >
                                        <Text style={styles.gameTeamName}>
                                          {game.awayTeam?.name &&
                                            `${game.awayTeam?.name}(${game.awayTeam?.divisionShortName})`}
                                        </Text>
                                        <Text style={styles.gameTeamName}>
                                          {game.homeTeam?.name &&
                                            `${game.homeTeam?.name}(${game.homeTeam?.divisionShortName})`}
                                        </Text>
                                      </View>,
                                    ]
                                  : acc;
                              }, [] as JSX.Element[])
                              .slice(splitIdx, splitIdx + 4)}
                          </View>
                        ))}
                      </View>
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
