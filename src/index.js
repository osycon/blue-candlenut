import React, { Component } from 'react';
import ReactDOM from 'react-dom';

import { Header, Map, Storelist } from './components/index';
import './styles.css';

import { places, defaultValues } from './store/centers';

class App extends Component {
  state = {};

  calculateDistance(pointA, pointB, place) {
    // http://www.movable-type.co.uk/scripts/latlong.html
    const lat1 = pointA.lat;
    const lng1 = pointA.lng;

    const lat2 = pointB.lat;
    const lng2 = pointB.lng;

    const earthRadius = 6378137; // earth radius in meters
    const φ1 = lat1 * (Math.PI / 180);
    const φ2 = lat2 * (Math.PI / 180);
    const Δφ = (lat2 - lat1) * (Math.PI / 180);
    const Δλ = (lng2 - lng1) * (Math.PI / 180);

    const a =
      Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
      Math.cos(φ1) * Math.cos(φ2) * (Math.sin(Δλ / 2) * Math.sin(Δλ / 2));

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    const distance = earthRadius * c;
    place.distance = distance;
    return place; // in meters
  }

  findClosest = coordinates => {
    // When someone searches we get the coordinates in the coordinates object.
    // Put calculation here.
    const centersWithDistance = places.map(place =>
      this.calculateDistance(
        coordinates,
        { lat: place.lat, lng: place.lng },
        place
      )
    );
    const sorted = centersWithDistance.sort((a, b) => a.distance - b.distance);
    this.setState({
      sortedCenters: sorted
    });
  };

  render() {
    const apikey = process.env.GMAPS_API_KEY
    const baseUrl = `https://maps.googleapis.com/maps/api/js?key=${apikey}&v=3.exp&libraries=geometry,drawing,places`
    return (
      <div className="App">
        <Header />
        <div className="map">
          <Map
            googleMapURL={baseUrl}
            loadingElement={<div style={{ height: `100%` }} />}
            containerElement={
              <div style={{ height: `600px`, maxWidth: `800px` }} />
            }
            mapElement={<div style={{ height: `100%` }} />}
            servicecenters={places}
            defaultValues={defaultValues}
            findClosest={this.findClosest}
          />
        </div>
        {this.state.sortedCenters ? (
          <Storelist places={this.state.sortedCenters} />
        ) : (
          ''
        )}
      </div>
    );
  }
}

const rootElement = document.getElementById('root');
ReactDOM.render(<App />, rootElement);
