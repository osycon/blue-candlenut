import React from 'react';
import _ from 'lodash';
import { compose, withStateHandlers, lifecycle } from 'recompose';
import {
  GoogleMap,
  withGoogleMap,
  withScriptjs,
  Marker,
  InfoWindow
} from 'react-google-maps';
import { SearchBox } from 'react-google-maps/lib/components/places/SearchBox';

import ServiceInfo from './ServiceInfo';

const ServiceMap = compose(
  withStateHandlers(
    () => ({
      isOpen: {}
    }),
    {
      onToggleOpen: ({ isOpen }) => props => {
        return {
          isOpen: {
            [props]: !isOpen[props]
          }
        };
      }
    }
  ),
  lifecycle({
    componentWillMount() {
      const refs = {};

      this.setState({
        bounds: null,
        center: {
          lat: this.props.defaultValues.center.lat,
          lng: this.props.defaultValues.center.lng
        },
        markers: [],
        onMapMounted: ref => {
          refs.map = ref;
        },
        onBoundsChanged: () => {
          this.setState({
            bounds: refs.map.getBounds(),
            center: refs.map.getCenter()
          });
        },
        onSearchBoxMounted: ref => {
          refs.searchBox = ref;
        },
        onPlacesChanged: () => {
          const places = refs.searchBox.getPlaces();
          const bounds = new window.google.maps.LatLngBounds();
          // the place coordinates.
          const lnglat = JSON.stringify(places[0].geometry.location);
          const cleaned = JSON.parse(lnglat);
          // Send object with coordinates to parent component.
          this.props.findClosest(cleaned);
          places.forEach(place => {
            if (place.geometry.viewport) {
              bounds.union(place.geometry.viewport);
            } else {
              bounds.extend(place.geometry.location);
            }
          });
          const nextMarkers = places.map(place => ({
            position: place.geometry.location
          }));
          // Next markers coordinates.
          const nextCenter = _.get(
            nextMarkers,
            '0.position',
            this.state.center
          );

          this.setState({
            center: nextCenter,
            markers: nextMarkers
          });
          refs.map.fitBounds(bounds);
        }
      });
    }
  }),
  withScriptjs,
  withGoogleMap
)(props => {
  const servicecentermarkers = props.servicecenters.map(servicecenter => (
    <Marker
      key={servicecenter.id}
      position={{ lat: servicecenter.lat, lng: servicecenter.lng }}
      onClick={() => props.onToggleOpen(servicecenter.id)}
    >
      {props.isOpen[servicecenter.id] && (
        <InfoWindow onCloseClick={props.onToggleOpen}>
          <ServiceInfo servicecenter={servicecenter} />
        </InfoWindow>
      )}
    </Marker>
  ));
  return (
    <GoogleMap
      defaultZoom={props.defaultValues.zoom}
      center={props.center}
      ref={props.onMapMounted}
    >
      <SearchBox
        ref={props.onSearchBoxMounted}
        bounds={props.bounds}
        controlPosition={window.google.maps.ControlPosition.TOP_LEFT}
        onPlacesChanged={props.onPlacesChanged}
      >
        <input
          type="text"
          placeholder="Input your address"
          style={{
            boxSizing: `border-box`,
            border: `1px solid transparent`,
            width: `260px`,
            height: `45px`,
            marginTop: `25px`,
            padding: `0 12px`,
            borderRadius: `3px`,
            boxShadow: `0 2px 6px rgba(0, 0, 0, 0.3)`,
            fontSize: `14px`,
            outline: `none`,
            textOverflow: `ellipses`
          }}
        />
      </SearchBox>
      {props.markers.map((marker, index) => (
        <Marker key={index} position={marker.position} />
      ))}
      {servicecentermarkers}
    </GoogleMap>
  );
});

export default ServiceMap;
