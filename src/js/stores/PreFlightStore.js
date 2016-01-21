import {GetSetMixin, Store} from 'mesosphere-shared-reactjs';

import ActionTypes from '../constants/ActionTypes';
import AppDispatcher from '../events/AppDispatcher';
import EventTypes from '../constants/EventTypes';
import ProcessStageUtil from '../utils/ProcessStageUtil';
import StageActions from '../events/StageActions';

const stageID = 'preflight';
let requestInterval = null;

function startPolling() {
  if (requestInterval == null) {
    requestInterval = setInterval(PreFlightStore.fetchStageStatus, 2000);
  }
}

function stopPolling() {
  clearInterval(requestInterval);
  requestInterval = null;
}

let PreFlightStore = Store.createStore({
  storeID: 'preFlight',

  mixins: [GetSetMixin],

  init: function () {
    let initialState = {
      slaves: {
        errors: 0,
        totalStarted: 0,
        completed: false
      },
      errorDetails: [],
      masters: {
        errors: 0,
        totalStarted: 0,
        completed: false
      }
    };
    this.set(initialState);
    this.emit(EventTypes.PREFLIGHT_STATE_CHANGE, initialState);

    startPolling();
  },

  beginStage: StageActions.beginStage.bind(null, stageID),

  fetchLogs: StageActions.fetchLogs.bind(null, stageID),

  fetchStageStatus: StageActions.fetchStageStatus.bind(null, stageID),

  addChangeListener: function (eventName, callback) {
    this.on(eventName, callback);
  },

  removeChangeListener: function (eventName, callback) {
    this.removeListener(eventName, callback);
  },

  isCompleted: function (data) {
    return data.slaves.completed && data.masters.completed;
  },

  processUpdateError: function () {
    this.emit(EventTypes.PREFLIGHT_STATE_CHANGE);
  },

  processUpdateSuccess: function (data) {
    var processedState = ProcessStageUtil.processState(data);

    if (this.isCompleted(processedState)) {
      stopPolling();
      this.set(processedState);
      this.emit(EventTypes.PREFLIGHT_STATE_FINISH, processedState);
      return;
    }

    this.set(processedState);
    this.emit(EventTypes.PREFLIGHT_STATE_CHANGE, processedState);
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
        this.emit(EventTypes.PREFLIGHT_BEGIN_SUCCESS);
      case ActionTypes.PREFLIGHT_BEGIN_ERROR:
        this.emit(EventTypes.PREFLIGHT_BEGIN_ERROR, action.data);
    }

    return true;
  })

});

module.exports = PreFlightStore;
