import classnames from 'classnames';
import mixin from 'reactjs-mixin';
/* eslint-disable no-unused-vars */
import React from 'react';
/* eslint-enable no-unused-vars */
import {StoreMixin} from 'mesosphere-shared-reactjs'

import IconChevron from '../components/icons/IconChevron';
import InstallerStore from '../stores/InstallerStore';
import NavigationItem from '../components/NavigationItem';

module.exports = class NavigationNextStep extends mixin(StoreMixin) {
  constructor() {
    super();

    this.state = {
      disabled: true,
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
  }

  render() {
    let nextStep = InstallerStore.get('nextStep');
    if (nextStep == null) {
      return null;
    }
    let {enabled, label, link, clickHandler, visible} = nextStep;

    if (!visible) {
      return null;
    }

    if (!enabled) {
      link = null;
      clickHandler = null;
    }

    let classes = classnames('navigation-item', 'navigation-item-next', {
      'is-disabled': !enabled
    });

    return (
      <NavigationItem className={classes} link={link} clickHandler={clickHandler}>
        <span className="navigation-item-mobile">
          Next: {label}
        </span>
        <span className="navigation-item-desktop">
          Continue
        </span>
        <IconChevron />
      </NavigationItem>
    );
  }
}
