import {GetSetMixin, Store} from 'mesosphere-shared-reactjs';

import ActionTypes from '../constants/ActionTypes';
import AppDispatcher from '../events/AppDispatcher';
import EventTypes from '../constants/EventTypes';

let DeployStore = Store.createStore({
  storeID: 'deploy',

  mixins: [GetSetMixin],

  init: function () {
    this.set({
      agents: {
        error: false,
        status: 'Deploying to Agents',
        detail: null
      },
      completed: false,
      masters: {
        error: false,
        status: 'Deploying to Masters',
        detail: null
      },
      status: 'Deploying DCOS...'
    });
  },

  addChangeListener: function (eventName, callback) {
    this.on(eventName, callback);
  },

  removeChangeListener: function (eventName, callback) {
    this.removeListener(eventName, callback);
  },

  processUpdateError: function () {
    this.emit(EventTypes.DEPLOY_STATE_CHANGE);
  },

  processUpdateSuccess: function () {
    // TODO: Process update for masters and agents.
    this.emit(EventTypes.DEPLOY_STATE_CHANGE);
  },

  dispatcherIndex: AppDispatcher.register(function (payload) {
    let {action} = payload;

    switch (action.type) {
      case ActionTypes.DEPLOY_UPDATE_ERROR:
        DeployStore.processUpdateError(action.data);
        break;
      case ActionTypes.DEPLOY_UPDATE_SUCCESS:
        DeployStore.processUpdateSuccess(action.data);
        break;
    }

    return true;
  })

});

module.exports = DeployStore;
