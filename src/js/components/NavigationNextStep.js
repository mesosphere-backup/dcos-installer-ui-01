import classnames from 'classnames';
import React from 'react';

import IconChevron from '../components/icons/IconChevron';
import NavigationItem from '../components/NavigationItem';

module.exports = class NavigationNextStep extends React.Component {
  render() {
    let classes = classnames('navigation-item', 'navigation-item-next', {
      'is-disabled': false
    });

    return (
      <NavigationItem className={classes} link="next">
        Next: Some Step
        <IconChevron />
      </NavigationItem>
    );
  }
}
