import {GetSetMixin, Store} from 'mesosphere-shared-reactjs';

import ActionTypes from '../constants/ActionTypes';
import AppDispatcher from '../events/AppDispatcher';
import EventTypes from '../constants/EventTypes';
import ConfigActions from '../events/ConfigActions';

let SetupStore = Store.createStore({
  storeID: 'setup',

  mixins: [GetSetMixin],

  init: function () {
    this.set({
      completed: false,
      errors: null,
      success: null,
      warning: null
    });
  },

  fetchConfig: ConfigActions.fetchConfig,

  fetchConfigState: ConfigActions.fetchConfigState,

  updateConfig: ConfigActions.updateConfig,

  addChangeListener: function (eventName, callback) {
    this.on(eventName, callback);
  },

  removeChangeListener: function (eventName, callback) {
    this.removeListener(eventName, callback);
  },

  validateUserInput: function () {
    // TODO: Send user input to server.
    // TODO: Determine successful & erroneous fields, display as such.
    this.emit(EventTypes.SETUP_USER_INPUT_VALIDATED);
  },

  dispatcherIndex: AppDispatcher.register(function (payload) {
    let {action} = payload;

    switch (action.type) {
      case ActionTypes.SETUP_RECEIVE_USER_INPUT:
        SetupStore.validateUserInput(action.data);
        break;
    }

    return true;
  })

});

module.exports = SetupStore;
