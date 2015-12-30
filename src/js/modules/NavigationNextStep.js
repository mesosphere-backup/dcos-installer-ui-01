import classnames from 'classnames';
import React from 'react';

import IconChevron from '../components/icons/IconChevron';
import NavigationItem from '../components/NavigationItem';

export default class NavigationNextStep extends React.Component {
  render() {
    let classes = classnames({
      'navigation-item': true,
      'navigation-item-next': true,
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
