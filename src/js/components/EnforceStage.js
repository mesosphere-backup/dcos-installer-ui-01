import mixin from 'reactjs-mixin';
import React from 'react';
import {StoreMixin} from 'mesosphere-shared-reactjs';

import AdvancedConfigurationWarning from './AdvancedConfigurationWarning';
import AlertPanel from './AlertPanel';
import IconLoadingIndicator from './icons/IconLoadingIndicator';
import IconLostPlanet from './icons/IconLostPlanet';
import InstallerStore from '../stores/InstallerStore';
import PreFlightStore from '../stores/PreFlightStore';
import SetupStore from '../stores/SetupStore';

const METHODS_TO_BIND = ['handleServerError', 'handleServerSuccess'];
const MONITORED_STAGE_STORES = ['deploy', 'preFlight', 'postFlight'];
const MONITORED_STAGE_ERROR_EVENTS = ['stateError'];
const MONITORED_STAGE_SUCCESS_EVENTS = ['beginSuccess', 'stateChange'];

function getEventsFromStoreListeners() {
  let errorEventHandlers = [];
  let successEventHandlers = [];

  MONITORED_STAGE_STORES.forEach((store) => {
    MONITORED_STAGE_ERROR_EVENTS.forEach((storeEvent) => {
      errorEventHandlers.push(this.store_getChangeFunctionName(store, storeEvent));
    });
    MONITORED_STAGE_SUCCESS_EVENTS.forEach((storeEvent) => {
      successEventHandlers.push(this.store_getChangeFunctionName(store, storeEvent));
    });
  });

  return {errorEventHandlers, successEventHandlers};
}

class EnforceStage extends mixin(StoreMixin) {
  constructor() {
    super();

    this.state = {
      configType: {
        type: null,
        message: null
      },
      currentStage: null,
      receivedConfigType: false,
      receivedCurrentConfig: false,
      receivedCurrentConfigStatus: false,
      serverErrorCount: 0
    };

    this.store_listeners = [
      {
        name: 'installer',
        events: [
          'currentStageChange',
          'totalAgentsChange',
          'totalMastersChange'
        ]
      },
      {
        name: 'setup',
        events: [
          'configStatusChangeError',
          'configStatusChangeSuccess',
          'configTypeChangeSuccess',
          'currentConfigChangeSuccess',
          'currentConfigChangeError'
        ]
      },
      {
        name: 'deploy',
        events: [
          'stateError',
          'beginSuccess',
          'stateChange'
        ]
      },
      {
        name: 'postFlight',
        events: [
          'stateError',
          'beginSuccess',
          'stateChange'
        ]
      },
      {
        name: 'preFlight',
        events: [
          'stateError',
          'beginSuccess',
          'stateChange'
        ]
      }
    ];

    this.firstMount = true;
    this.currentStageChanges = 0;

    METHODS_TO_BIND.forEach((method) => {
      this[method] = this[method].bind(this);
    });

    let {errorEventHandlers, successEventHandlers} =
      getEventsFromStoreListeners.call(this);

    errorEventHandlers.forEach((event) => {
      this[event] = this.handleServerError;
    });

    successEventHandlers.forEach((event) => {
      this[event] = this.handleServerSuccess;
    });
  }

  componentDidMount() {
    super.componentDidMount();
    InstallerStore.init();
    SetupStore.init();
  }

  shouldComponentUpdate(nextProps) {
    if (this.firstMount) {
      this.firstMount = false;
      this.context.router.push('/');
    }

    if (this.currentStageChanges >= 2) {
      let stageState = {
        nextStage: nextProps.routes[nextProps.routes.length - 1].path,
        currentClientStage: this.props.routes[this.props.routes.length - 1].path,
        currentStage: InstallerStore.get('currentStage') || null
      };

      if (this.isNavigationPrevented(stageState)) {
        this.context.router.push(`/${stageState.currentStage}`);
        return false;
      }
    }

    return true;
  }

  isNavigationPrevented(stageState) {
    if (stageState.currentClientStage === 'pre-flight'
      && stageState.nextStage === 'setup' && PreFlightStore.isCompleted()) {
      return false;
    }

    if (stageState.nextStage !== stageState.currentStage
      && stageState.currentStage != null) {
      return true;
    }
  }

  onInstallerStoreCurrentStageChange() {
    this.currentStageChanges += 1;
    this.setState({receivedCurrentStage: true});
  }

  onSetupStoreConfigStatusChangeError() {
    this.setState({receivedCurrentConfigStatus: true});
  }

  onSetupStoreConfigStatusChangeSuccess() {
    this.setState({receivedCurrentConfigStatus: true});
  }

  onSetupStoreConfigTypeChangeSuccess() {
    this.setState({
      configType: SetupStore.get('configType'),
      receivedConfigType: true
    });
  }

  onSetupStoreCurrentConfigChangeError() {
    this.handleServerError();
  }

  onSetupStoreCurrentConfigChangeSuccess() {
    this.setState({receivedCurrentConfig: true});
  }

  isLoading() {
    let state = this.state;

    return !state.receivedCurrentStage || !state.receivedCurrentConfig
      || !state.receivedCurrentConfigStatus || !state.receivedConfigType;
  }

  getAdvancedConfigurationWarning() {
    return <AdvancedConfigurationWarning />;
  }

  getLoadingScreen() {
    return (
      <div className="spinner-wrapper flex-box flex-box-align-vertical-center
        flex-box-align-horizontal-center">
        <IconLoadingIndicator />
      </div>
    );
  }

  getServerError() {
    return (
      <AlertPanel content="Please try again later."
        heading="Cannot Connect to Server"
        icon={<IconLostPlanet />} />
    );
  }

  handleServerSuccess() {
    this.setState({serverErrorCount: 0});
  }

  handleServerError() {
    this.setState({serverErrorCount: this.state.serverErrorCount + 1});
  }

  hasError() {
    return this.state.serverErrorCount >= 3;
  }

  render() {
    if (this.hasError()) {
      return this.getServerError();
    }

    if (this.state.configType.type === 'advanced') {
      return this.getAdvancedConfigurationWarning();
    }

    if (this.isLoading()) {
      return this.getLoadingScreen();
    }

    return this.props.children;
  }
}

EnforceStage.contextTypes = {
  router: React.PropTypes.object
};

EnforceStage.propTypes = {
  children: React.PropTypes.node
};

module.exports = EnforceStage;
