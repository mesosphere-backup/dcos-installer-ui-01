import {GetSetMixin, Store} from 'mesosphere-shared-reactjs';

import ActionTypes from '../constants/ActionTypes';
import AppDispatcher from '../events/AppDispatcher';
import EventTypes from '../constants/EventTypes';
import StageActions from '../events/StageActions';

const stageID = 'postflight';

let PostFlightStore = Store.createStore({
  storeID: 'postFlight',

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
    this.emit(EventTypes.POSTFLIGHT_STATE_CHANGE);
  },

  processUpdateSuccess: function () {
    // TODO: Process update for masters and agents.
    this.emit(EventTypes.POSTFLIGHT_STATE_CHANGE);
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
