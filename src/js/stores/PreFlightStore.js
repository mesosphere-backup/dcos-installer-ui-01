import {GetSetMixin, Store} from 'mesosphere-shared-reactjs';

import ActionTypes from '../constants/ActionTypes';
import AppDispatcher from '../events/AppDispatcher';
import EventTypes from '../constants/EventTypes';
import StageActions from '../events/StageActions';

const stageID = 'preflight';

let PreFlighStore = Store.createStore({
  storeID: 'preFlight',

  mixins: [GetSetMixin],

  init: function () {
    this.set({
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
    });
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

  processUpdateError: function () {
    this.emit(EventTypes.PREFLIGHT_STATE_CHANGE);
  },

  processUpdateSuccess: function () {
    // TODO: Process update for masters and agents.
    this.emit(EventTypes.PREFLIGHT_STATE_CHANGE);
  },

  dispatcherIndex: AppDispatcher.register(function (payload) {
    let {action} = payload;

    switch (action.type) {
      case ActionTypes.PREFLIGHT_UPDATE_ERROR:
        PreFlighStore.processUpdateError(action.data);
        break;
      case ActionTypes.PREFLIGHT_UPDATE_SUCCESS:
        PreFlighStore.processUpdateSuccess(action.data);
        break;
      case ActionTypes.PREFLIGHT_BEGIN_SUCCESS:
        this.emit(EventTypes.PREFLIGHT_BEGIN_SUCCESS);
      case ActionTypes.PREFLIGHT_BEGIN_ERROR:
        this.emit(EventTypes.PREFLIGHT_BEGIN_ERROR, action.data);
    }

    return true;
  })

});

module.exports = PreFlighStore;
