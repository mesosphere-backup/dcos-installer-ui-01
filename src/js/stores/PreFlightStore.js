import {GetSetMixin, Store} from 'mesosphere-shared-reactjs';

import ActionTypes from '../constants/ActionTypes';
import AppDispatcher from '../events/AppDispatcher';
import getActionMixin from '../mixins/getActionMixin';
import EventTypes from '../constants/EventTypes';
import ProcessStageUtil from '../utils/ProcessStageUtil';

let requestInterval = null;

function startPolling() {
  if (requestInterval == null) {
    PreFlightStore.fetchStageStatus();
    requestInterval = setInterval(PreFlightStore.fetchStageStatus, 2000);
  }
}

function stopPolling() {
  clearInterval(requestInterval);
  requestInterval = null;
}

let PreFlightStore = Store.createStore({
  storeID: 'preFlight',

  mixins: [GetSetMixin, getActionMixin('preflight')],

  init: function () {
    let initialState = this.getInitialState();
    this.set(initialState);
    this.emit(EventTypes.PREFLIGHT_STATE_CHANGE, initialState);

    startPolling();
  },

  addChangeListener: function (eventName, callback) {
    this.on(eventName, callback);
  },

  removeChangeListener: function (eventName, callback) {
    this.removeListener(eventName, callback);
  },

  processUpdateError: function () {
    this.emit(EventTypes.PREFLIGHT_STATE_CHANGE);
  },

  processUpdateSuccess: function (data) {
    var processedState = ProcessStageUtil.processState(data);

    this.set(processedState);
    this.emit(EventTypes.PREFLIGHT_STATE_CHANGE, processedState);

    if (this.isCompleted()) {
      stopPolling();
      this.emit(EventTypes.PREFLIGHT_STATE_FINISH, processedState);
      return;
    }
  },

  dispatcherIndex: AppDispatcher.register(function (payload) {
    let {action} = payload;

    switch (action.type) {
      case ActionTypes.PREFLIGHT_UPDATE_ERROR:
        PreFlightStore.processUpdateError(action.data);
        break;
      case ActionTypes.PREFLIGHT_UPDATE_SUCCESS:
        PreFlightStore.processUpdateSuccess(action.data);
        break;
      case ActionTypes.PREFLIGHT_BEGIN_SUCCESS:
        PreFlightStore.emit(EventTypes.PREFLIGHT_BEGIN_SUCCESS);
        break;
      case ActionTypes.PREFLIGHT_BEGIN_ERROR:
        PreFlightStore.emit(EventTypes.PREFLIGHT_BEGIN_ERROR, action.data);
        break;
    }

    return true;
  })

});

module.exports = PreFlightStore;
