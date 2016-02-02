import {GetSetMixin, Store} from 'mesosphere-shared-reactjs';

import ActionTypes from '../constants/ActionTypes';
import AppDispatcher from '../events/AppDispatcher';
import EventTypes from '../constants/EventTypes';
import getActionMixin from '../mixins/getActionMixin';
import ProcessStageUtil from '../utils/ProcessStageUtil';

let requestInterval = null;

function startPolling() {
  stopPolling();
  DeployStore.fetchStageStatus();
  requestInterval = setInterval(DeployStore.fetchStageStatus, 4000);
}

function stopPolling() {
  clearInterval(requestInterval);
  requestInterval = null;
}

let DeployStore = Store.createStore({
  storeID: 'deploy',

  mixins: [GetSetMixin, getActionMixin('deploy')],

  init: function () {
    let initialState = this.getInitialState();
    this.set(initialState);
    this.emit(EventTypes.DEPLOY_STATE_CHANGE, initialState);

    startPolling();
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

  processUpdateSuccess: function (data) {
    var processedState = ProcessStageUtil.processState(data);

    this.set(processedState);
    this.emit(EventTypes.DEPLOY_STATE_CHANGE, processedState);

    if (this.isCompleted()) {
      stopPolling();
      this.emit(EventTypes.POSTFLIGHT_STATE_FINISH, processedState);
      return;
    }

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
      case ActionTypes.DEPLOY_BEGIN_SUCCESS:
        DeployStore.emit(EventTypes.DEPLOY_BEGIN_SUCCESS);
        break;
      case ActionTypes.DEPLOY_BEGIN_ERROR:
        DeployStore.emit(EventTypes.DEPLOY_BEGIN_ERROR, action.data);
        break;
    }

    return true;
  })

});

module.exports = DeployStore;
