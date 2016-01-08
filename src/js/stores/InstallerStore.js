import {GetSetMixin, Store} from 'mesosphere-shared-reactjs';

import ActionTypes from '../constants/ActionTypes';
import AppDispatcher from '../events/AppDispatcher';
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

  dispatcherIndex: AppDispatcher.register(function (payload) {
    let {action} = payload;

    switch (action.type) {
      case ActionTypes.GLOBAL_SET_INSTALL_IN_PROGRESS:
        InstallerStore.set({
          installInProgress: action.data.installInProgress
        });
        InstallerStore.emitChange(EventTypes.GLOBAL_INSTALL_IN_PROGRESS_CHANGE);
        break;
      case ActionTypes.GLOBAL_SET_NEXT_STEP:
        InstallerStore.set({
          enabled: action.data.enabled,
          label: action.data.label,
          link: action.data.link,
          visible: action.data.visible
        });
        InstallerStore.emitChange(EventTypes.GLOBAL_NEXT_STEP_CHANGE);
        break;
    }

    return true;
  })

});

module.exports = InstallerStore;
