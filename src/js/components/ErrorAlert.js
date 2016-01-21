import React from 'react';

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
          <span className="icon icon-alert">!</span>
          {this.props.content}
          <span className="icon icon-close" onClick={this.dismissError}>x</span>
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
