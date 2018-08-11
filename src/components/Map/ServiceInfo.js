import React, { Fragment } from 'react';

const ServiceInfo = props => {
  const { name, phone, email, address, zip, city, send } = props.servicecenter;
  return (
    <Fragment>
      <h3>{name}</h3>
      <p>Phone: {phone}</p>
      <p>Email: {email}</p>
      <p>Address: {address}</p>
      <p>
        {zip} {city}
      </p>
      <p>Possible to send in: {send ? 'Yes' : 'No'}</p>
    </Fragment>
  );
};

export default ServiceInfo;
