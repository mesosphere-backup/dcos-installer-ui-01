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
      if (nextStage !== currentStage && currentStage !== null) {
        this.context.router.push(`/${currentStage}`);
        return false;
      }
    }

    return true;
  }

  onInstallerStoreCurrentStageChange() {
    console.log('onInstallerStoreCurrentStageChange');
    this.currentStageChanges += 1;
    console.log('Current stage change');
    this.setState({receivedCurrentStage: true});
  }

  onSetupStoreConfigStatusChangeError() {
    console.log('onSetupStoreConfigStatusChangeError');
    this.setState({receivedCurrentConfigStatus: true});
    console.log('Config status change');
  }

  onSetupStoreConfigStatusChangeSuccess() {
    console.log('onSetupStoreConfigStatusChangeSuccess');
    this.setState({receivedCurrentConfigStatus: true});
    console.log('Config status change success');
  }

  onSetupStoreConfigTypeChangeSuccess() {
    console.log('onSetupStoreConfigTypeChangeSuccess');
    this.setState({
      configType: SetupStore.get('configType'),
      receivedConfigType: true
    });
    console.log('config type')
  }

  onSetupStoreCurrentConfigChangeError() {
    this.setState({serverError: true});
  }

  onSetupStoreCurrentConfigChangeSuccess() {
    console.log('onSetupStoreCurrentConfigChangeSuccess');
    this.setState({receivedCurrentConfig: true});
  }

  isLoading() {
    let state = this.state;

    return !state.receivedCurrentStage || !state.receivedCurrentConfig
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
    if (this.state.serverError) {
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
