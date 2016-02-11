import React from 'react';

class FormLabelContent extends React.Component {
  render() {
    return (
      <span className={`${this.props.supplementalClassName} ${this.props.className}-${this.props.position}`}>
        {this.props.children}
      </span>
    );
  }
}

FormLabelContent.defaultProps = {
  className: 'form-label',
  position: 'left',
  supplementalClassName: ''
};

FormLabelContent.propTypes = {
  children: React.PropTypes.node,
  className: React.PropTypes.string,
  position: React.PropTypes.oneOf(['left', 'right']),
  supplementalClassName: React.PropTypes.string
};

module.exports = FormLabelContent;
