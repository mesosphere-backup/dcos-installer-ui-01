import classnames from 'classnames';
import React from 'react';

export default class SectionHeader extends React.Component {
  render() {
    let classes = classnames({
      [this.props.className]: true,
      [this.props.layoutClassName]: true
    });

    return (
      <h2 className={classes}>
        {this.props.children}
      </h2>
    );
  }
}

SectionHeader.defaultProps = {
  className: 'section-header',
  layoutClassName: 'text-align-center'
};

SectionHeader.propTypes = {
  children: React.PropTypes.node,
  className: React.PropTypes.string,
  layoutClassName: React.PropTypes.string
};
