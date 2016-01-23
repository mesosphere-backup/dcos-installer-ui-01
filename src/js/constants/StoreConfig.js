import DeployStore from '../stores/DeployStore';
import EventTypes from './EventTypes';
import InstallerStore from '../stores/InstallerStore';
import PostFlightStore from '../stores/PostFlightStore';
import PreFlightStore from '../stores/PreFlightStore';
import SetupStore from '../stores/SetupStore';

const ListenersDescription = {
  deploy: {
    store: DeployStore,
    events: {
      stateChange: EventTypes.DEPLOY_STATE_CHANGE,
      stateFinish: EventTypes.DEPLOY_STATE_FINISH,
      beginSuccess: EventTypes.DEPLOY_BEGIN_SUCCESS
    },
    unmountWhen: function () {
      return true;
    },
    listenAlways: true
  },

  installer: {
    store: InstallerStore,
    events: {
      currentStageChange: EventTypes.CURRENT_STAGE_CHANGE,
      installInProgressChange: EventTypes.GLOBAL_INSTALL_IN_PROGRESS_CHANGE,
      nextStepChange: EventTypes.GLOBAL_NEXT_STEP_CHANGE,
      totalAgentsChange: EventTypes.TOTAL_AGENTS_SUCCESS,
      totalMastersChange: EventTypes.TOTAL_MASTERS_SUCCESS,
    },
    unmountWhen: function () {
      return true;
    },
    listenAlways: true
  },

  postFlight: {
    store: PostFlightStore,
    events: {
      stateChange: EventTypes.POSTFLIGHT_STATE_CHANGE,
      stateFinish: EventTypes.POSTFLIGHT_STATE_FINISH,
      beginSuccess: EventTypes.POSTFLIGHT_BEGIN_SUCCESS
    },
    unmountWhen: function () {
      return true;
    },
    listenAlways: true
  },

  preFlight: {
    store: PreFlightStore,
    events: {
      stateChange: EventTypes.PREFLIGHT_STATE_CHANGE,
      stateFinish: EventTypes.PREFLIGHT_STATE_FINISH,
      beginSuccess: EventTypes.PREFLIGHT_BEGIN_SUCCESS,
      beginError: EventTypes.PREFLIGHT_BEGIN_ERROR
    },
    unmountWhen: function () {
      return true;
    },
    listenAlways: true
  },

  setup: {
    store: SetupStore,
    events: {
      configStatusChangeError: EventTypes.CONFIGURE_STATUS_CHANGE_ERROR,
      configStatusChangeSuccess: EventTypes.CONFIGURE_STATUS_CHANGE_SUCCESS,
      configTypeChangeError: EventTypes.CONFIGURE_TYPE_CHANGE_ERROR,
      configTypeChangeSuccess: EventTypes.CONFIGURE_TYPE_CHANGE_SUCCESS,
      configUpdateError: EventTypes.CONFIGURE_UPDATE_ERROR,
      configUpdateSuccess: EventTypes.CONFIGURE_UPDATE_SUCCESS,
      currentConfigChangeError: EventTypes.CONFIGURE_CHANGE_ERROR,
      currentConfigChangeSuccess: EventTypes.CONFIGURE_CHANGE_SUCCESS,
      validateUserInput: EventTypes.SETUP_USER_INPUT_VALIDATED
    },
    unmountWhen: function () {
      return true;
    },
    listenAlways: true
  }
};

module.exports = ListenersDescription;
