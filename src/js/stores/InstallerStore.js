import {GetSetMixin, Store} from 'mesosphere-shared-reactjs';

import ActionTypes from '../constants/ActionTypes';
import AppDispatcher from '../events/AppDispatcher';
import HostActions from '../events/HostActions';
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
      },
      totalSlaves: 0,
      totalMasters: 0
    });

    this.fetchCurrentStage();
    this.fetchTotalSlaves();
    this.fetchTotalMasters();
  },

  fetchDCOSURL: SuccessActions.fetchDCOSURL,

  fetchCurrentStage: StageActions.fetchCurrentStage,

  fetchTotalSlaves: HostActions.fetchTotalSlaves,

  fetchTotalMasters: HostActions.fetchTotalMasters,

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
      case ActionTypes.TOTAL_SLAVES_SUCCESS:
        this.set({totalSlaves: action.data});
        this.emit(TOTAL_SLAVES_SUCCESS, action.data);
        break;
      case ActionTypes.TOTAL_SLAVES_ERROR:
        this.emit(TOTAL_SLAVES_ERROR);
        break;
      case ActionTypes.TOTAL_MASTERS_SUCCESS:
        this.set({totalMasters: action.data});
        this.emit(TOTAL_MASTERS_SUCCESS, action.data);
        break;
      case ActionTypes.TOTAL_MASTERS_ERROR:
        this.emit(TOTAL_MASTERS_ERROR);
        break;
    }

    return true;
  })

});

module.exports = InstallerStore;
