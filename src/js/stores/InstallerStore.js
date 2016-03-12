import _ from 'lodash';
import {GetSetMixin, Store} from 'mesosphere-shared-reactjs';

import ActionTypes from '../constants/ActionTypes';
import AppDispatcher from '../events/AppDispatcher';
import DeployStore from './DeployStore';
import EventTypes from '../constants/EventTypes';
import PostFlightStore from './PostFlightStore';
import PreFlightStore from './PreFlightStore';
import StageActions from '../events/StageActions';
import SuccessActions from '../events/SuccessActions';

let InstallerStore = Store.createStore({
  storeID: 'installer',

  mixins: [GetSetMixin],

  init: function () {
    this.set({
      configStatus: null,
      currentConfig: null,
      currentConfigError: null,
      currentStage: null,
      dcosURL: null,
      installInProgress: false,
      nextStep: {
        enabled: false,
        label: null,
        link: null,
        clickHandler: null,
        visible: false
      }
    });

    this.fetchCurrentStage();
  },

  fetchDCOSURL: SuccessActions.fetchDCOSURL,

  fetchCurrentStage: StageActions.fetchCurrentStage,

  addChangeListener: function (eventName, callback) {
    this.on(eventName, callback);
  },

  removeChangeListener: function (eventName, callback) {
    this.removeListener(eventName, callback);
  },

  processCurrentStage: function (stage) {
    this.set({currentStage: stage});
    this.emit(EventTypes.CURRENT_STAGE_CHANGE, stage);
  },

  setInstallInProgress: function (installInProgress) {
    this.set({
      installInProgress: installInProgress
    });
    this.emit(EventTypes.GLOBAL_INSTALL_IN_PROGRESS_CHANGE);
  },

  setNextStep: function (stepData) {
    let nextStep = _.extend({}, this.get('nextStep'), stepData);

    this.set({nextStep});
    this.emit(EventTypes.GLOBAL_NEXT_STEP_CHANGE);
  },

  dispatcherIndex: AppDispatcher.register(function (payload) {
    let {action} = payload;

    switch (action.type) {
      case ActionTypes.CURRENT_STAGE_CHANGE_SUCCESS:
        InstallerStore.processCurrentStage(action.data.current_action);
        break;
      case ActionTypes.TOTAL_AGENTS_SUCCESS:
        InstallerStore.set({totalAgents: action.data});
        InstallerStore.emit(EventTypes.TOTAL_AGENTS_SUCCESS, action.data);
        break;
      case ActionTypes.TOTAL_AGENTS_ERROR:
        InstallerStore.emit(EventTypes.TOTAL_AGENTS_ERROR);
        break;
      case ActionTypes.TOTAL_MASTERS_SUCCESS:
        InstallerStore.set({totalMasters: action.data});
        InstallerStore.emit(EventTypes.TOTAL_MASTERS_SUCCESS, action.data);
        break;
      case ActionTypes.TOTAL_MASTERS_ERROR:
        InstallerStore.emit(EventTypes.TOTAL_MASTERS_ERROR);
        break;
      case ActionTypes.DCOS_UI_URL_CHANGE:
        InstallerStore.set({dcosURL: action.data.success});
        InstallerStore.emit(EventTypes.DCOS_URL_CHANGE, action.data);
        break;
      case ActionTypes.PREFLIGHT_UPDATE_SUCCESS:
        AppDispatcher.waitFor([PreFlightStore.dispatcherIndex]);
        if (PreFlightStore.isCompleted() && !PreFlightStore.isFailed()) {
          InstallerStore.setNextStep({
            enabled: true
          });
        }
        break;
      case ActionTypes.POSTFLIGHT_UPDATE_SUCCESS:
        AppDispatcher.waitFor([PostFlightStore.dispatcherIndex]);
        if (PostFlightStore.isCompleted() && !PostFlightStore.isFailed()) {
          InstallerStore.setNextStep({
            enabled: true
          });
        }
        break;
      case ActionTypes.DEPLOY_UPDATE_SUCCESS:
        AppDispatcher.waitFor([DeployStore.dispatcherIndex]);
        if (DeployStore.isCompleted() && !DeployStore.isFailed()) {
          InstallerStore.setNextStep({
            enabled: true
          });
        }
        break;
      case ActionTypes.PREFLIGHT_BEGIN_SUCCESS:
        AppDispatcher.waitFor([PreFlightStore.dispatcherIndex]);
        InstallerStore.processCurrentStage('pre-flight');
        break;
      case ActionTypes.POSTFLIGHT_BEGIN_SUCCESS:
        AppDispatcher.waitFor([PostFlightStore.dispatcherIndex]);
        InstallerStore.processCurrentStage('post-flight');
        break;
      case ActionTypes.DEPLOY_BEGIN_SUCCESS:
        AppDispatcher.waitFor([DeployStore.dispatcherIndex]);
        InstallerStore.processCurrentStage('deploy');
        break;
    }

    return true;
  })

});

module.exports = InstallerStore;
