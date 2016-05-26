import mixin from 'reactjs-mixin';
import {StoreMixin} from 'mesosphere-shared-reactjs';
/* eslint-disable no-unused-vars */
import React from 'react';
/* eslint-enable no-unused-vars */

import DeployStore from '../stores/DeployStore';
import InstallerStore from '../stores/InstallerStore';
import PostFlightStore from '../stores/PostFlightStore';
import StageProgress from '../components/StageProgress';

class Postflight extends mixin(StoreMixin) {
  constructor() {
    super();

    this.store_listeners = [
      {name: 'postFlight', events: ['stateChange', 'stateFinish']}
    ];
  }

  onPostFlightStoreStateFinish() {
    if (PostFlightStore.isCompleted() && !PostFlightStore.isFailed()) {
      this.goToSuccess();
    }
  }

  goToSuccess() {
    InstallerStore.processCurrentStage('success');
    this.context.router.push('/success');
  }

  render() {
    return (
      <StageProgress
        store={PostFlightStore}
        stageID="postflight"
        stateText="Post-Flight"
        runningText="Running Post-Flight..."
        nextButtonText="Continue"
        nextButtonAction={this.goToSuccess.bind(this)}
        nextStageText="Continue"
        nextStageAction={this.goToSuccess.bind(this)}
        router={this.context.router}
        />
    );
  }
}

Postflight.contextTypes = {
  router: React.PropTypes.object
};

module.exports = Postflight;
