import classnames from 'classnames';
import GeminiScrollbar from 'react-gemini-scrollbar';
import React from 'react';

import IconCircleCheckmarkSmall from './icons/IconCircleCheckmarkSmall';
import IconErrorSmall from './icons/IconErrorSmall';
import IconSpinnerSmall from './icons/IconSpinnerSmall';
import NodeRoles from '../constants/NodeRoles';
import NodeStatusDisplayText from '../constants/NodeStatusDisplayText';
import NodeStatuses from '../constants/NodeStatuses';

const MAX_HEIGHT = 200;
const METHODS_TO_BIND = ['checkScrollPosition', 'handleScroll'];
const NODE_LIMIT = 8;
const LIST_PADDING = 32;
const STATUS_ICONS = {
  [NodeStatuses.FAILED]: <IconErrorSmall />,
  [NodeStatuses.RUNNING]: <IconSpinnerSmall />,
  [NodeStatuses.SUCCESS]: <IconCircleCheckmarkSmall />,
  [NodeStatuses.TERMINATED]: <IconErrorSmall />
};

class NodesList extends React.Component {
  constructor() {
    super();

    this.state = {
      containerHeight: 0,
      shouldRenderTopMask: false,
      shouldRenderBottomMask: true
    };

    this.initialRender = true;

    METHODS_TO_BIND.forEach((method) => {
      this[method] = this[method].bind(this);
    });
  }

  componentDidUpdate() {
    if (!this.refs.nodesList) {
      return;
    }

    let {props, refs, state} = this;
    let containerHeight = Math.min(refs.nodesList.offsetHeight, MAX_HEIGHT);

    // The height of the element must be determined and set explicitly so that
    // we can animate the height with CSS.
    if (props.visible && state.containerHeight === 0) {
      /* eslint-disable */
      this.setState({containerHeight: containerHeight + LIST_PADDING});
      /* eslint-enable */
    } else if (!props.visible && state.containerHeight > 0) {
      /* eslint-disable */
      this.setState({containerHeight: 0});
      /* eslint-enable */
    }
  }

  componentWillUpdate(nextProps) {
    // When we are animating closed or open, we want to render the masks.
    if (nextProps.visible !== this.props.visible) {
      this.setState({
        shouldRenderTopMask: true,
        shouldRenderBottomMask: true
      });

      // If we will be animating open, then we need to run the
      // #checkScrollPosition method, which will remove masks if necessary (this
      // will usually be the top mask, because when the animation completes, the
      // list will be scrolled to the top of the page).
      if (nextProps.visible) {
        setTimeout(this.checkScrollPosition.bind(this), 250);
      }
    }
  }

  handleScroll() {
    this.checkScrollPosition();
  }

  checkScrollPosition() {
    let {props, refs, state} = this;
    let scrollView = refs['scroll-view'];

    if (!refs.gemini) {
      this.setState({
        shouldRenderBottomMask: false,
        shouldRenderTopMask: false
      });

      return;
    }

    if (!state.shouldRenderTopMask && scrollView.scrollTop > 0) {
      this.setState({shouldRenderTopMask: true});
    } else if (!state.shouldRenderBottomMask
      && scrollView.scrollTop + state.containerHeight
      < refs.nodesList.offsetHeight + LIST_PADDING) {
      this.setState({shouldRenderBottomMask: true});
    } else if (state.shouldRenderTopMask && scrollView.scrollTop <= 0) {
      this.setState({shouldRenderTopMask: false});
    } else if (state.shouldRenderTopMask
      && scrollView.scrollTop + state.containerHeight
      >= refs.nodesList.offsetHeight + LIST_PADDING) {
      this.setState({shouldRenderBottomMask: false});
    }
  }

  getNodesList(nodes) {
    let sortedNodes = nodes.sort(function (a, b) {
      // We want to sort master nodes to the top of the list. Otherwise,
      // we sort alphabetically the string "ip:port".
      if (a.role === NodeRoles.MASTER && b.role === NodeRoles.AGENT) {
        return -1;
      } else if (a.role === NodeRoles.AGENT && b.role === NodeRoles.MASTER) {
        return 1;
      }

      return `${a.ip}:${a.port}`.localeCompare(`${b.ip}:${b.port}`);
    });

    return sortedNodes.map((node, index) => {
      let badge = null;
      let icon = this.getNodeStatusIcon(node);
      let nodeClasses = classnames('nodes-list-item', {
        'is-erroneous': node.status === NodeStatuses.FAILED
          || node.status === NodeStatuses.TERMINATED
      });

      if (node.role === NodeRoles.MASTER) {
        badge = <span className="badge">Master</span>;
      }

      return (
        <li className={nodeClasses} key={index}>
          <div className="nodes-list-icon">
            {icon}
          </div>
          <div className="nodes-list-ip">
            {node.ip}:{node.port} {badge}
          </div>
          <div className="nodes-list-status">
            {NodeStatusDisplayText[node.status] || node.status}
          </div>
        </li>
      );
    });
  }

  getNodeStatusIcon(node) {
    return STATUS_ICONS[node.status] || STATUS_ICONS.running;
  }

  render() {
    // We only want to return null until the visibility of the list has been
    // toggled. After the visibility is toggled, we keep the list in the DOM and
    // toggle its visibility by animating its height from and to 0.
    if (!this.props.visible && this.initialRender) {
      return null;
    }

    this.initialRender = false;

    let isNodeListOverflowing = this.props.nodes.length > NODE_LIMIT;
    let containerClasses = classnames(
      'nodes-list-wrapper',
      {
        'is-overflowing': isNodeListOverflowing,
        'is-visible': this.props.visible,
        'is-masked-top': this.state.shouldRenderTopMask,
        'is-masked-bottom': this.state.shouldRenderBottomMask
      }
    );

    let nodesList = (
      <ul className="nodes-list list list-unstyled flush-bottom"
        ref="nodesList">
        {this.getNodesList(this.props.nodes)}
      </ul>
    );

    // The height of the element must be determined and set explicitly so that
    // we can animate the height with CSS.
    if (isNodeListOverflowing && this.props.visible) {
      let style = {height: `${this.state.containerHeight - LIST_PADDING}px`};

      nodesList = (
        <GeminiScrollbar autoshow={false} onScroll={this.handleScroll} ref="gemini" style={style}>
          {nodesList}
        </GeminiScrollbar>
      );
    }

    return (
      <div className={containerClasses} ref="container"
        style={{height: `${this.state.containerHeight}px`}}>
        {nodesList}
      </div>
    );
  }
}

NodesList.defaultProps = {
  nodes: [],
  visible: false
};

NodesList.propTypes = {
  nodes: React.PropTypes.array,
  visible: React.PropTypes.bool
};

module.exports = NodesList;
