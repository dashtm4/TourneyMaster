import React from 'react';
import {
  Page,
  Text,
  View,
  Document,
  Image,
  StyleSheet,
  PDFDownloadLink,
  PDFViewer,
} from '@react-pdf/renderer';
import Api from 'api/api';
import { Loader } from 'components/common';
import { IEventDetails } from 'common/models';
import logo from 'assets/tournamentLogoExample.svg';

const styles = StyleSheet.create({
  page: {
    padding: 25,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  section: {
    margin: 10,
    padding: 10,
  },
});

interface IPDFProps {
  event: IEventDetails;
}

const MyDocument = ({ event }: IPDFProps) => {
  return (
    <Document>
      <Page size="A4" orientation="landscape" style={styles.page}>
        <View style={styles.header}>
          <View>
            <Text>{event.event_name}</Text>
            <Text>Event Schedule ({'<< Schedule Name>>'})</Text>
          </View>
          <View>
            <Image src={logo} />
            <Text>Img</Text>
          </View>
        </View>
      </Page>
    </Document>
  );
};

interface IPageState {
  event: IEventDetails | null;
}

class PDF extends React.Component<any, IPageState> {
  constructor(props: null) {
    super(props);

    this.state = {
      event: null,
    };
  }

  async componentDidMount() {
    const event = await Api.get('/events?event_id=ADLNT001');

    this.setState({ event: event[0] });
  }

  render() {
    const { event } = this.state;

    if (!event) {
      return <Loader />;
    }

    const WrappedPDF = () => <MyDocument event={event} />;

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
