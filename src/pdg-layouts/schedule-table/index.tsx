import React from 'react';
import {
  Page,
  Text,
  View,
  Document,
  Image,
  PDFDownloadLink,
  PDFViewer,
} from '@react-pdf/renderer';
import moment from 'moment';
import Api from 'api/api';
import { Loader } from 'components/common';
import { IEventDetails, IFacility, IField } from 'common/models';
import TMLogo from 'assets/logo.png';
import { styles } from './styles';

interface IPDFProps {
  event: IEventDetails | null;
  fields: IField[];
  facilities: IFacility[];
}

const MyDocument = ({ event, fields, facilities }: IPDFProps) => {
  if (!event) return null;

  const takeFacilityByFieldId = (facilityId: string) =>
    facilities.find(facility => facility.facilities_id === facilityId);

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
        <View style={styles.tableWrapper}>
          <View style={styles.timeSlots}>
            {Array.from(new Array(5), (_, idx) => (
              <View style={styles.timeSlot} key={idx} />
            ))}
          </View>
          <View style={styles.fieldList}>
            {fields.map(it => (
              <Text key={it.field_id} style={styles.fieldName}>
                {`${it.field_name} - ${
                  takeFacilityByFieldId(it.facilities_id)?.facilities_abbr
                }`}
              </Text>
            ))}
          </View>
        </View>
        <View>
          <Text fixed>Printed Date: {moment(new Date()).format('LLL')}</Text>
        </View>
      </Page>
    </Document>
  );
};

class PDF extends React.Component<any, IPDFProps> {
  constructor(props: null) {
    super(props);

    this.state = {
      event: null,
      fields: [],
      facilities: [],
    };
  }

  async componentDidMount() {
    const event = await Api.get('/events?event_id=ADLNT001');
    const facilities = await Api.get(`/facilities?event_id=ADLNT001`);
    const fields = (
      await Promise.all(
        facilities.map((it: IFacility) =>
          Api.get(`/fields?facilities_id=${it.facilities_id}`)
        )
      )
    ).flat();

    this.setState({ event: event[0], fields, facilities });
  }

  render() {
    const { event, fields, facilities } = this.state;

    if (!event) {
      return <Loader />;
    }

    const WrappedPDF = () => (
      <MyDocument event={event} fields={fields} facilities={facilities} />
    );

    return (
      <>
        <p>
          <PDFViewer width="500" height="400">
            <WrappedPDF />
          </PDFViewer>
        </p>
        <p>
          <PDFDownloadLink document={<WrappedPDF />} fileName="somename.pdf">
            {event.event_name}
          </PDFDownloadLink>
        </p>
      </>
    );
  }
}

export default PDF;
