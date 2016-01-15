import {GetSetMixin, Store} from 'mesosphere-shared-reactjs';

import ActionTypes from '../constants/ActionTypes';
import AppDispatcher from '../events/AppDispatcher';
import EventTypes from '../constants/EventTypes';
import StageActions from '../events/StageActions';

const stageID = 'deploy';

let DeployStore = Store.createStore({
  storeID: stageID,

  mixins: [GetSetMixin],

  init: function () {
    this.set({
      agents: {
        error: false,
        status: 'Deploying to Agents',
        detail: null
      },
      completed: false,
      masters: {
        error: false,
        status: 'Deploying to Masters',
        detail: null
      },
      status: 'Deploying DCOS...'
    });
  },

  beginDeploy: StageActions.beginStage.bind(null, stageID),

  fetchLogs: StageActions.fetchLogs.bind(null, stageID),

  fetchDeployStatus: StageActions.fetchStageStatus.bind(null, stageID),

  addChangeListener: function (eventName, callback) {
    this.on(eventName, callback);
  },

  removeChangeListener: function (eventName, callback) {
    this.removeListener(eventName, callback);
  },

  processUpdateError: function () {
    this.emit(EventTypes.DEPLOY_STATE_CHANGE);
  },

  processUpdateSuccess: function () {
    // TODO: Process update for masters and agents.
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
