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
        completed: true,
        errors: 0,
        totalStarted: 0,
        totalAgents: 0
      },
      errorDetails: [],
      masters: {
        completed: true,
        errors: 0,
        totalStarted: 0,
        totalMasters: 0
      }
    };
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

  isCompleted: function () {
    let data = this.getSet_data;

    if (Object.keys(data).length === 0) {
      return false;
    }

    return data.agents.completed && data.masters.completed
      && (data.agents.totalAgents > 0 || data.masters.totalMasters > 0);
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
