import {GetSetMixin, Store} from 'mesosphere-shared-reactjs';

import ActionTypes from '../constants/ActionTypes';
import AppDispatcher from '../events/AppDispatcher';
import EventTypes from '../constants/EventTypes';
import ProcessStageUtil from '../utils/ProcessStageUtil';
import StageActions from '../events/StageActions';

const stageID = 'deploy';
let requestInterval = null;

function startPolling() {
  if (requestInterval == null) {
    DeployStore.fetchStageStatus();
    requestInterval = setInterval(DeployStore.fetchStageStatus, 4000);
  }
}

function stopPolling() {
  clearInterval(requestInterval);
  requestInterval = null;
}

let DeployStore = Store.createStore({
  storeID: stageID,

  mixins: [GetSetMixin],

  init: function () {
    let initialState = {
      agents: {
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
    }
    this.set(initialState);
    this.emit(EventTypes.DEPLOY_STATE_CHANGE, initialState);

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
    return data.agents.completed && data.masters.completed;
  },

  processUpdateError: function () {
    this.emit(EventTypes.DEPLOY_STATE_CHANGE);
  },

  processUpdateSuccess: function (data) {
    var processedState = ProcessStageUtil.processState(data);

    if (this.isCompleted(processedState)) {
      stopPolling();
      this.set(processedState);
      this.emit(EventTypes.POSTFLIGHT_STATE_FINISH, processedState);
      return;
    }

    this.set(processedState);
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
        this.emit(EventTypes.DEPLOY_BEGIN_SUCCESS);
        break;
      case ActionTypes.DEPLOY_BEGIN_ERROR:
        this.emit(EventTypes.DEPLOY_BEGIN_ERROR, action.data);
        break;
    }

    return true;
  })

});

module.exports = DeployStore;
