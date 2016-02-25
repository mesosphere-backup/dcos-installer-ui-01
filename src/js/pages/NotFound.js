import {Link} from 'react-router';
import React from 'react';

import AlertPanel from '../components/AlertPanel';
import IconLostPlanet from '../components/icons/IconLostPlanet';

module.exports = class NotFound extends React.Component {
  render() {
    let alertContent = (
      <span>
        Please return to <Link to="/">the beginning</Link>.
      </span>
    );

    return (
      <AlertPanel content={alertContent}
        heading="Page Not Found"
        icon={<IconLostPlanet />} />
    );
  }
}
