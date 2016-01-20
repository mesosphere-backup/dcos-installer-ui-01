import {GetSetMixin, Store} from 'mesosphere-shared-reactjs';

import ActionTypes from '../constants/ActionTypes';
import AppDispatcher from '../events/AppDispatcher';
import EventTypes from '../constants/EventTypes';
import ProcessStageUtil from '../utils/ProcessStageUtil';
import StageActions from '../events/StageActions';

const stageID = 'postflight';
let requestInterval = null;

function startPolling() {
  requestInterval = setInterval(PreFlightStore.fetchStageStatus, 2000);
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
    this.emit(EventTypes.POSTFLIGHT_STATE_CHANGE, initialState);

    // startPolling();
    var x = setInterval(() => {
      let currentSlaves = this.get('slaves');
      let currentMasters = this.get('masters');
      var fakeData = {
        slaves: {
          errors: 0,
          totalStarted: currentSlaves.totalStarted + 1,
          completed: false,
          totalSlaves: 10
        },
        errorDetails: [{host: '123.521.54', message: 'command not found'}],
        masters: {
          errors: 0,
          totalStarted: currentMasters.totalStarted + 1,
          completed: false,
          totalMasters: 10
        },
      };
      this.set(fakeData);
      this.emit(EventTypes.POSTFLIGHT_STATE_CHANGE, fakeData);
    }, 2000);

    setTimeout(() => {
      clearInterval(x);
      var fakeData = {
        slaves: {
          errors: 1,
          totalStarted: 10,
          completed: true,
          totalSlaves: 10
        },
        errorDetails: [],
        masters: {
          errors: 0,
          totalStarted: 10,
          completed: true,
          totalMasters: 10
        },
      };
      this.set(fakeData);
      this.emit(EventTypes.POSTFLIGHT_STATE_CHANGE, fakeData);
    }, 20000);
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
    this.emit(EventTypes.POSTFLIGHT_STATE_CHANGE);
  },

  processUpdateSuccess: function (data) {
    var processedState = ProcessStageUtil.processState(data);

    if (this.isCompleted(processedState)) {
      stopPolling();
    }

    this.set(processedState);
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
      case ActionTypes.POSTFLIGHT_BEGIN_SUCCESS:
        this.emit(EventTypes.POSTFLIGHT_BEGIN_SUCCESS);
      case ActionTypes.POSTFLIGHT_BEGIN_ERROR:
        this.emit(EventTypes.POSTFLIGHT_BEGIN_ERROR, action.data);
    }

    return true;
  })

});

module.exports = PostFlightStore;
