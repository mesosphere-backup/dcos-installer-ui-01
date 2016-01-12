import classnames from 'classnames';
import React from 'react';

import IconTooltip from './icons/IconTooltip';

const METHODS_TO_BIND = [
  'getIdealPosition',
  'handleMouseEnter',
  'handleMouseLeave'
];

const FIXED_BAR_HEIGHT = 60;

class Tooltip extends React.Component {
  constructor() {
    super();

    this.state = {isOpen: false};

    METHODS_TO_BIND.forEach((method) => {
      this[method] = this[method].bind(this);
    });
  }

  getIdealPosition() {
    // Get the anchor and position from state if possible. If not, get it from
    // the props.
    let anchor = this.state.anchor || this.props.anchor;
    let position = this.state.position || this.props.position;

    if (this.refs.tooltipContent) {
      let viewportHeight = global.window.innerHeight;
      let viewportWidth = global.window.innerWidth;
      let tooltipContent = React.findDOMNode(this.refs.tooltipContent);
      let tooltipPosition = tooltipContent.getBoundingClientRect();

      // Change the position if the tooltip will be rendered off the screen.
      if (position === 'right' && tooltipPosition.right > viewportWidth) {
        position = 'left';
      } else if (position === 'left' && tooltipPosition.left < 0) {
        position = 'right';
      } else if (position === 'top' && tooltipPosition.top < FIXED_BAR_HEIGHT) {
        position = 'bottom';
      } else if (position === 'bottom' &&
        tooltipPosition.bottom > viewportHeight) {
        position = 'top';
      }

      // Change the anchor if the tooltip will be rendered off the screen.
      if (position === 'right' || position === 'left') {
        if (tooltipPosition.top < FIXED_BAR_HEIGHT) {
          anchor = 'top';
        } else if (tooltipPosition.bottom > viewportHeight) {
          anchor = 'bottom';
        }
      } else if (position === 'top' || position === 'bottom') {
        if (tooltipPosition.right > viewportWidth) {
          anchor = 'right';
        } else if (tooltipPosition.left < 0) {
          anchor = 'left';
        }
      }
    }

    return {anchor, position};
  }

  handleMouseEnter() {
    let {anchor, position} = this.getIdealPosition();
    this.setState({anchor, isOpen: true, position});
  }

  handleMouseLeave() {
    this.setState({isOpen: false});
  }

  render() {
    let {props, state} = this;

    // Get the anchor and position from state if possible. If not, get it from
    // the props.
    let anchor = state.anchor || props.anchor;
    let position = state.position || props.position;

    let tooltipClasses = classnames(props.className, `anchor-${anchor}`,
      `position-${position}`, {
        'is-open': state.isOpen,
        'wrap-text': props.wrapText
      }
    );

    let tooltipStyle = null;

    if (props.width) {
      tooltipStyle = {
        width: `${props.width}px`
      };
    }

    let tooltipTrigger = props.children || <IconTooltip />

    return (
      <div className={props.tooltipWrapperClassName}
        onMouseEnter={this.handleMouseEnter}
        onMouseLeave={this.handleMouseLeave}>
        {tooltipTrigger}
        <div className={tooltipClasses} ref="tooltipContent"
          style={tooltipStyle}>
          {props.content}
        </div>
      </div>
    );
  }
}

Tooltip.defaultProps = {
  anchor: 'center',
  className: 'tooltip',
  position: 'top',
  tooltipWrapperClassName: 'tooltip-wrapper',
  wrapText: false
};

Tooltip.propTypes = {
  // Anchor the tooltip to an edge of the tooltip trigger. Default is center.
  anchor: React.PropTypes.oneOf(['start', 'center', 'end']),
  // If present, the children will be used as the trigger.
  children: React.PropTypes.node,
  className: React.PropTypes.string,
  content: React.PropTypes.node.isRequired,
  // Position the tooltip on an edge of the tooltip trigger. Default is top.
  position: React.PropTypes.oneOf(['top', 'bottom', 'right', 'left']),
  tooltipWrapperClassName: React.PropTypes.string,
  width: React.PropTypes.number,
  // Allow the text content to wrap. Default is false. This should be used with
  // the width property, because otherwise the width of the content will be the
  // same as the trigger.
  wrapText: React.PropTypes.bool
};

module.exports = Tooltip;
