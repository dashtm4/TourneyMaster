import React, { Component } from 'react';
import {
  withGoogleMap,
  GoogleMap,
  withScriptjs,
  Marker,
} from 'react-google-maps';

class Map extends Component {
  render() {
    const GoogleMapExample = withScriptjs(
      withGoogleMap((_props: any) => (
        <GoogleMap
          defaultCenter={{ lat: 49.842957, lng: 24.031111 }}
          defaultZoom={13}
        >
          <Marker position={{ lat: 49.842957, lng: 24.031111 }} />
        </GoogleMap>
      ))
    );
    return (
      <GoogleMapExample
        googleMapURL={`https://maps.googleapis.com/maps/api/js?key=${process.env.REACT_APP_GOOGLE_API_KEY}`}
        loadingElement={<div style={{ height: `100%` }} />}
        containerElement={<div style={{ height: `100%`, width: '100%' }} />}
        mapElement={<div style={{ height: `100%` }} />}
      />
    );
  }
}
export default Map;
