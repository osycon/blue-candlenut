import React, { Fragment } from 'react';

const Storelist = props => (
  <Fragment>
    <h2 className="store-heading">Service centers sorted by distance</h2>
    <ul className="store-list">
      {props.places.map(place => (
        <li key={place.id} className="store">
          <div>
            <h3 className="store-title">{place.name}</h3>
            <p className="store-phone store-text">
              Phone: <span>{place.phone}</span>
            </p>
            <p className="store-email store-text">
              Email: <span>{place.email}</span>
            </p>
            <p className="store-address store-text">
              Address: <span>{place.address}</span>
            </p>
            <p className="store-city store-text">
              <span>{place.zip}</span> <span>{place.city}</span>
            </p>
          </div>
          <div>
            <p className="store-distance store-text">
              From you:{' '}
              <span className="store-meters">
                {(place.distance / 1000).toFixed(2)}
              </span>{' '}
              km
            </p>
            <p className="store-text">
              Able to send in:{' '}
              <span className="store-send">{place.send ? 'Yes' : 'No'}</span>
            </p>
          </div>
        </li>
      ))}
    </ul>
  </Fragment>
);

export default Storelist;
