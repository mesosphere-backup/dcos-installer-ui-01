import React from 'react';

import AlertPanel from '../components/AlertPanel';
import IconLostPlanet from '../components/icons/IconLostPlanet';

module.exports = class NotFound extends React.Component {
  handleBackClick() {
    window.history.back();
  }

  render() {
    let alertContent = (
      <span>
        <a onClick={this.handleBackClick} href="#">Go back</a> to the previous page.
      </span>
    );

    return (
      <AlertPanel content={alertContent}
        heading="Page Not Found"
        icon={<IconLostPlanet />} />
    );
  }
}
