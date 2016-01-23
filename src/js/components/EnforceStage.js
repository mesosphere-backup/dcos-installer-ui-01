import mixin from 'reactjs-mixin';
import React from 'react';
import {StoreMixin} from 'mesosphere-shared-reactjs';

import IconSpinner from './icons/IconSpinner';
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
  }

  componentWillMount() {
    super.componentWillMount();
    InstallerStore.init();
    SetupStore.init();
  }

  // Uncomment this to force user to be on current stage.
  // shouldComponentUpdate(nextProps) {
  //   let nextStage = nextProps.routes[nextProps.routes.length - 1].path;
  //   let sameStage = nextStage === this.state.currentStage;

  //   if (!sameStage) {
  //     global.window.location.hash = this.state.currentStage;
  //   }

  //   return sameStage;
  // }

  onInstallerStoreCurrentStageChange(currentStage) {
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

  getAdvancedConfigurationWarning() {
    return 'You cannot modify this configuration.';
  }

  getLoadingScreen() {
    return (
      <div className="spinner-wrapper flex-box flex-box-align-vertical-center
        flex-box-align-horizontal-center">
        <IconSpinner />
      </div>
    );
  }

  getServerError() {
    return 'Server error.'
  }

  render() {
    // TODO: Uncomment all of this.
    // if (this.state.serverError) {
    //   return this.getServerError();
    // }

    // if (this.state.configType.type === 'advanced') {
    //   return this.getAdvancedConfigurationWarning();
    // }

    // let state = this.state;
    // if (state.currentStage == null || !state.receivedTotalAgents
    //   || !state.receivedTotalMasters || !state.receivedCurrentConfig
    //   || !state.receivedCurrentConfigStatus || !state.receivedConfigType) {
    //   return this.getLoadingScreen();
    // }

    return this.props.children;
  }
}

EnforceStage.propTypes = {
  children: React.PropTypes.node
};

module.exports = EnforceStage;
