import classnames from 'classnames';
import React from 'react';

export default class SectionBody extends React.Component {
  render() {
    let classes = classnames({
      [this.props.className]: true,
      [this.props.layoutClassName]: true
    });

    return (
      <div className={classes}>
        {this.props.children}
      </div>
    );
  }
}

SectionBody.defaultProps = {
  className: 'section-body',
  layoutClassName: ''
};

SectionBody.propTypes = {
  children: React.PropTypes.node,
  className: React.PropTypes.string,
  layoutClassName: React.PropTypes.string
};
