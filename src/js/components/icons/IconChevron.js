import classnames from 'classnames';
import React from 'react';

class IconChevron extends React.Component {
  render() {
    let classes = classnames('icon icon-chevron', {
      'is-complete': this.props.isComplete,
      'reversed': this.props.reversed
    });

    return (
      <svg
        className={classes}
        height="10px"
        viewBox="0 0 7 10"
        width="7px"
        {...this.props}>
        <polygon points="1.71 0.29 0.29 1.71 3.59 5.01 0.29 8.29 1.71 9.71 6.41 5.01 1.71 0.29"/>
      </svg>
    );
  }
}

IconChevron.propTypes = {
  isComplete: React.PropTypes.bool,
  reversed: React.PropTypes.bool
};

module.exports = IconChevron;
