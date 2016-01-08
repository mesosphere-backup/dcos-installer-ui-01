import {GetSetMixin, Store} from 'mesosphere-shared-reactjs';

import EventTypes from '../constants/EventTypes';

let InstallerStore = Store.createStore({
  storeID: 'installer',

  mixins: [GetSetMixin],

  init: function () {
    this.set({
      dcosURL: null,
      installInProgress: false,
      nextStep: {
        enabled: false,
        label: null,
        link: null,
        visible: false
      }
    });
  },

  addChangeListener: function (eventName, callback) {
    this.on(eventName, callback);
  },

  removeChangeListener: function (eventName, callback) {
    this.removeListener(eventName, callback);
  },

  setInstallInProgress: function (installInProgress) {
    InstallerStore.set({
      installInProgress: installInProgress
    });
    InstallerStore.emitChange(EventTypes.GLOBAL_INSTALL_IN_PROGRESS_CHANGE);
  },

  setNextStep: function (stepData) {
    InstallerStore.set({
      enabled: stepData.enabled,
      label: stepData.label,
      link: stepData.link,
      visible: stepData.visible
    });
    InstallerStore.emitChange(EventTypes.GLOBAL_NEXT_STEP_CHANGE);
  }
});

module.exports = InstallerStore;
