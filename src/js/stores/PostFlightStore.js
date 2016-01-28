import {GetSetMixin, Store} from 'mesosphere-shared-reactjs';

import ActionTypes from '../constants/ActionTypes';
import AppDispatcher from '../events/AppDispatcher';
import EventTypes from '../constants/EventTypes';
import getActionMixin from '../mixins/getActionMixin';
import ProcessStageUtil from '../utils/ProcessStageUtil';

let requestInterval = null;

function startPolling() {
  stopPolling();
  PostFlightStore.fetchStageStatus();
  requestInterval = setInterval(PostFlightStore.fetchStageStatus, 2000);
}

function stopPolling() {
  clearInterval(requestInterval);
  requestInterval = null;
}

let PostFlightStore = Store.createStore({
  storeID: 'postFlight',

  mixins: [GetSetMixin, getActionMixin('postflight')],

  init: function () {
    let initialState = this.getInitialState();
    this.set(initialState);
    this.emit(EventTypes.POSTFLIGHT_STATE_CHANGE, initialState);

    startPolling();
  },

  addChangeListener: function (eventName, callback) {
    this.on(eventName, callback);
  },

  removeChangeListener: function (eventName, callback) {
    this.removeListener(eventName, callback);
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
