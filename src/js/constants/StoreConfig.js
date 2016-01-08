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
      stateChange: EventTypes.DEPLOY_STATE_CHANGE
    },
    unmountWhen: function () {
      return true;
    },
    listenAlways: true
  },

  installer: {
    store: InstallerStore,
    events: {
      installInProgressChange: EventTypes.GLOBAL_INSTALL_IN_PROGRESS_CHANGE,
      nextStepChange: EventTypes.GLOBAL_NEXT_STEP_CHANGE
    },
    unmountWhen: function () {
      return true;
    },
    listenAlways: true
  },

  postFlight: {
    store: PostFlightStore,
    events: {
      stateChange: EventTypes.POSTFLIGHT_STATE_CHANGE
    },
    unmountWhen: function () {
      return true;
    },
    listenAlways: true
  },

  preFlight: {
    store: PreFlightStore,
    events: {
      stateChange: EventTypes.PREFLIGHT_STATE_CHANGE
    },
    unmountWhen: function () {
      return true;
    },
    listenAlways: true
  },

  setup: {
    store: SetupStore,
    events: {
      validateUserInput: EventTypes.SETUP_USER_INPUT_VALIDATED
    },
    unmountWhen: function () {
      return true;
    },
    listenAlways: true
  }

};

module.exports = ListenersDescription;
