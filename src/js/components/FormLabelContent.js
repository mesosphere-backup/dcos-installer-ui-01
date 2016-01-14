import React from 'react';

class FormLabelContent extends React.Component {
  render() {
    return (
      <span className={`${this.props.className}-${this.props.position}`}>
        {this.props.children}
      </span>
    );
  }
}

FormLabelContent.defaultProps = {
  className: 'form-label',
  position: 'left'
};

FormLabelContent.propTypes = {
  children: React.PropTypes.node,
  className: React.PropTypes.string,
  position: React.PropTypes.oneOf(['left', 'right'])
};

module.exports = FormLabelContent;
