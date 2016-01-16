import classnames from 'classnames';
import {Link} from 'react-router';
import React from 'react';

class SectionAction extends React.Component {
  render() {
    let props = this.props;
    let enabled = props.enabled;

    let classes = classnames(props.className, {
      'button-primary': props.type === 'primary' && enabled,
      'button-default button-stroke disabled': !enabled,
      'button-default button-stroke': props.type === 'secondary'
    });

    return (
      <Link className={classes} onClick={props.onClick} to={props.linkTo}>
        {this.props.children}
      </Link>
    );
  }
}

SectionAction.defaultProps = {
  className: 'section-action button button-large button-rounded'
};

SectionAction.propTypes = {
  children: React.PropTypes.node,
  className: React.PropTypes.string,
  linkTo: React.PropTypes.string,
  onClick: React.PropTypes.func,
  type: React.PropTypes.oneOf(['primary', 'secondary'])
};

module.exports = SectionAction;
