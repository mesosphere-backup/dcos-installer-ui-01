import classnames from 'classnames';
import React from 'react';

class FormLabel extends React.Component {
  render() {
    let classes = classnames(this.props.className, this.props.layoutClassName);

    return (
      <span className={classes}>
        {this.props.children}
      </span>
    );
  }
}

FormLabel.defaultProps = {
  className: 'form-label',
  layoutClassName: ''
};

FormLabel.propTypes = {
  children: React.PropTypes.node,
  className: React.PropTypes.string,
  layoutClassName: React.PropTypes.string
};

module.exports = FormLabel;
