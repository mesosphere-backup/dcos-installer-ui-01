import mixin from 'reactjs-mixin';
import React from 'react';
import {StoreMixin} from 'mesosphere-shared-reactjs';

import AlertPanel from './AlertPanel';
import IconLoadingIndicator from './icons/IconLoadingIndicator';
import InstallerStore from '../stores/InstallerStore';
import SetupStore from '../stores/SetupStore';

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
      receivedTotalAgents: false,
      receivedTotalMasters: false,
      serverError: false
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
      }
    ];

    this.firstMount = true;
    this.currentStageChanges = 0;
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
      let nextStage = nextProps.routes[nextProps.routes.length - 1].path;
      let currentStage = InstallerStore.get('currentStage') || null;
      if (nextStage !== currentStage) {
        this.context.router.push(`/${currentStage}`);
        return false;
      }
    }

    return true;
  }

  onInstallerStoreCurrentStageChange(currentStage) {
    this.currentStageChanges += 1;
    this.setState({currentStage});
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
    this.setState({serverError: true});
  }

  onSetupStoreCurrentConfigChangeSuccess() {
    this.setState({receivedCurrentConfig: true});
  }

  isLoading() {
    let state = this.state;

    return state.currentStage == null || !state.receivedTotalAgents
      || !state.receivedTotalMasters || !state.receivedCurrentConfig
      || !state.receivedCurrentConfigStatus || !state.receivedConfigType;
  }

  getAdvancedConfigurationWarning() {
    return (
      <AlertPanel content="Please use the command line to install DCOS."
        heading="Advanced Configuration Detected" />
    );
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
        heading="Cannot Connect to Server" />
    );
  }

  render() {
    // TODO: Uncomment all of this.
    // if (this.state.serverError) {
    //   return this.getServerError();
    // }

    if (this.state.configType.type === 'advanced') {
      return this.getAdvancedConfigurationWarning();
    }

    // let state = this.state;
    // if (this.isLoading()) {
    //   return this.getLoadingScreen();
    // }

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
