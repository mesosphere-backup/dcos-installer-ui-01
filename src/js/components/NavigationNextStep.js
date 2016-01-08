import classnames from 'classnames';
import mixin from 'reactjs-mixin';
/* eslint-disable no-unused-vars */
import React from 'react';
/* eslint-enable no-unused-vars */
import {StoreMixin} from 'mesosphere-shared-reactjs'

import IconChevron from '../components/icons/IconChevron';
import NavigationItem from '../components/NavigationItem';

const METHODS_TO_BIND = [
  'onInstallerStoreNextStepChange'
];

module.exports = class NavigationNextStep extends mixin(StoreMixin) {
  constructor() {
    super();

    this.state = {
      enabled: false,
      label: null,
      link: null,
      visible: false
    };

    this.store_listeners = [
      {
        name: 'installer',
        events: ['nextStepChange']
      }
    ];

    METHODS_TO_BIND.forEach((method) => {
      this[method] = this[method].bind(this);
    });
  }

  onInstallerStoreNextStepChange() {
    // Get the next step button info...
    // Set the next step button info...
  }

  render() {
    if (!this.state.visible) {
      return null;
    }

    let classes = classnames('navigation-item', 'navigation-item-next', {
      'is-disabled': false
    });

    return (
      <NavigationItem className={classes} link={this.state.link}>
        <span className="navigation-item-mobile">
          Next: {this.state.label}
        </span>
        <span className="navigation-item-desktop">
          Continue
        </span>
        <IconChevron />
      </NavigationItem>
    );
  }
}
