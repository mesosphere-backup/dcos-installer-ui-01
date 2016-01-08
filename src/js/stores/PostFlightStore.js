import {GetSetMixin, Store} from 'mesosphere-shared-reactjs';

import ActionTypes from '../constants/ActionTypes';
import AppDispatcher from '../events/AppDispatcher';
import EventTypes from '../constants/EventTypes';

let PostFlightStore = Store.createStore({
  storeID: 'postFlight',

  mixins: [GetSetMixin],

  init: function () {
    this.set({
      agents: {
        error: false,
        status: 'Checking Agents',
        detail: null
      },
      completed: false,
      masters: {
        error: false,
        status: 'Checking Masters',
        detail: null
      },
      status: 'Running Post-Flight...'
    });
  },

  addChangeListener: function (eventName, callback) {
    this.on(eventName, callback);
  },

  removeChangeListener: function (eventName, callback) {
    this.removeListener(eventName, callback);
  },

  processUpdateError: function () {
    this.emit(EventTypes.POSTFLIGHT_STATE_CHANGE);
  },

  processUpdateSuccess: function () {
    // TODO: Process update for masters and agents.
    this.emit(EventTypes.POSTFLIGHT_STATE_CHANGE);
  },

  dispatcherIndex: AppDispatcher.register(function (payload) {
    let {action} = payload;

    switch (action.type) {
      case ActionTypes.POSTFLIGHT_UPDATE_ERROR:
        PostFlightStore.processUpdateError(action.data);
        break;
      case ActionTypes.POSTFLIGHT_UPDATE_SUCCESS:
        PostFlightStore.processUpdateSuccess(action.data);
        break;
    }

    return true;
  })

});

module.exports = PostFlightStore;
