import {GetSetMixin, Store} from 'mesosphere-shared-reactjs';

import EventTypes from '../constants/EventTypes';
import StageActions from '../events/StageActions';
import SuccessActions from '../events/SuccessActions';

let InstallerStore = Store.createStore({
  storeID: 'installer',

  mixins: [GetSetMixin],

  init: function () {
    this.set({
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
    InstallerStore.set({
      installInProgress: installInProgress
    });
    InstallerStore.emit(EventTypes.GLOBAL_INSTALL_IN_PROGRESS_CHANGE);
  },

  setNextStep: function (stepData) {
    InstallerStore.set({
      enabled: stepData.enabled,
      label: stepData.label,
      link: stepData.link,
      visible: stepData.visible
    });
    InstallerStore.emit(EventTypes.GLOBAL_NEXT_STEP_CHANGE);
  },

  dispatcherIndex: AppDispatcher.register(function (payload) {
    let {action} = payload;

    switch (action.type) {
      case ActionTypes.CURRENT_STAGE_CHANGE_SUCCESS:
        InstallerStore.processCurrentStage(action.data);
        break;
    }

    return true;
  })

});

module.exports = InstallerStore;
