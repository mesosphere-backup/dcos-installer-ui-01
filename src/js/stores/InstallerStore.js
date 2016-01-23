import {GetSetMixin, Store} from 'mesosphere-shared-reactjs';

import ActionTypes from '../constants/ActionTypes';
import AppDispatcher from '../events/AppDispatcher';
import EventTypes from '../constants/EventTypes';
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
    this.set({
      enabled: stepData.enabled,
      label: stepData.label,
      link: stepData.link,
      visible: stepData.visible
    });
    this.emit(EventTypes.GLOBAL_NEXT_STEP_CHANGE);
  },

  dispatcherIndex: AppDispatcher.register(function (payload) {
    let {action} = payload;

    switch (action.type) {
      case ActionTypes.CURRENT_STAGE_CHANGE_SUCCESS:
        InstallerStore.processCurrentStage(action.data);
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
    }

    return true;
  })

});

module.exports = InstallerStore;
