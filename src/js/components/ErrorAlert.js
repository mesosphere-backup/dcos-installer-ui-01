import React from 'react';

import IconCloseSmall from './icons/IconCloseSmall';
import IconWarningSmallInverse from './icons/IconWarningSmallInverse';

const METHODS_TO_BIND = ['dismissError'];

class ErrorAlert extends React.Component {
  constructor() {
    super();

    this.state = {
      isVisible: true
    };

    METHODS_TO_BIND.forEach((method) => {
      this[method] = this[method].bind(this);
    });
  }

  dismissError() {
    this.setState({isVisible: false});
  }

  render() {
    if (this.state.isVisible) {
      return (
        <div className="error-alert">
          <IconWarningSmallInverse />
          {this.props.content}
          <IconCloseSmall onClick={this.dismissError} />
        </div>
      );
    }

    return null;
  }
}

ErrorAlert.defaultProps = {
  content: 'Please fix the errors below before proceeding.'
};

ErrorAlert.propTypes = {
  content: React.PropTypes.node
};

module.exports = ErrorAlert;
