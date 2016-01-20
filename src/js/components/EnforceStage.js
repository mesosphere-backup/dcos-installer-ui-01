import mixin from 'reactjs-mixin';
import React from 'react/addons';
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
      receivedTotalSlaves: false,
      receivedTotalMasters: false,
      serverError: false
    };

    this.store_listeners = [
      {
        name: 'installer',
        events: [
          'currentStageChange',
          'totalSlavesChange',
          'totalMastersChange'
        ]
      },
      {
        name: 'setup',
        events: [
          'configTypeChangeSuccess',
          'currentConfigChangeError'
        ]
      }
    ];
  }

  componentDidMount() {
    super.componentDidMount();

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

  onSetupStoreConfigTypeChangeSuccess() {
    this.setState({configType: SetupStore.get('configType')});
  }

  onSetupStoreCurrentConfigChangeError() {
    this.setState({serverError: true});
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
    if (this.state.serverError) {
      return this.getServerError();
    }

    if (this.state.configType.type === 'advanced') {
      return this.getAdvancedConfigurationWarning();
    }

    // Uncomment this to force user to be on current stage.
    // let state = this.state;
    // if (state.currentStage == null || !state.receivedTotalSlaves
    //   || !state.receivedTotalMasters) {
    //   return this.getLoadingScreen();
    // }

    return this.props.children;
  }
}

EnforceStage.propTypes = {
  children: React.PropTypes.node
};

module.exports = EnforceStage;
