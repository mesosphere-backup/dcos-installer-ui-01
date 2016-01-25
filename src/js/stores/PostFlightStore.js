import {GetSetMixin, Store} from 'mesosphere-shared-reactjs';

import ActionTypes from '../constants/ActionTypes';
import AppDispatcher from '../events/AppDispatcher';
import EventTypes from '../constants/EventTypes';
import ProcessStageUtil from '../utils/ProcessStageUtil';
import StageActions from '../events/StageActions';

const stageID = 'postflight';
let requestInterval = null;

function startPolling() {
  if (requestInterval == null) {
    PostFlightStore.fetchStageStatus();
    requestInterval = setInterval(PostFlightStore.fetchStageStatus, 2000);
  }
}

function stopPolling() {
  clearInterval(requestInterval);
  requestInterval = null;
}

let PostFlightStore = Store.createStore({
  storeID: 'postFlight',

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
    this.emit(EventTypes.POSTFLIGHT_STATE_CHANGE, initialState);

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
    this.emit(EventTypes.POSTFLIGHT_STATE_CHANGE);
  },

  processUpdateSuccess: function (data) {
    var processedState = ProcessStageUtil.processState(data);

    this.set(processedState);
    this.emit(EventTypes.POSTFLIGHT_STATE_CHANGE);

    if (this.isCompleted()) {
      stopPolling();
      this.emit(EventTypes.DEPLOY_STATE_FINISH, processedState);
      return;
    }
  },

  dispatcherIndex: AppDispatcher.register((payload) => {
    let {action} = payload;

    switch (action.type) {
      case ActionTypes.POSTFLIGHT_UPDATE_ERROR:
        PostFlightStore.processUpdateError(action.data);
        break;
      case ActionTypes.POSTFLIGHT_UPDATE_SUCCESS:
        PostFlightStore.processUpdateSuccess(action.data);
        break;
      case ActionTypes.POSTFLIGHT_BEGIN_SUCCESS:
        PostFlightStore.emit(EventTypes.POSTFLIGHT_BEGIN_SUCCESS);
      case ActionTypes.POSTFLIGHT_BEGIN_ERROR:
        PostFlightStore.emit(EventTypes.POSTFLIGHT_BEGIN_ERROR, action.data);
    }

    return true;
  })

});

module.exports = PostFlightStore;
