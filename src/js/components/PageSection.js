import classnames from 'classnames';
import React from 'react';

export default class PageSection extends React.Component {
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

PageSection.defaultProps = {
  className: 'page-section',
  layoutClassName: ''
};

PageSection.propTypes = {
  children: React.PropTypes.node,
  className: React.PropTypes.string,
  layoutClassName: React.PropTypes.string
};
