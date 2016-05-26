import mixin from 'reactjs-mixin';
import {StoreMixin} from 'mesosphere-shared-reactjs';
/* eslint-disable no-unused-vars */
import React from 'react';
/* eslint-enable no-unused-vars */

import DeployStore from '../stores/DeployStore';
import PreFlightStore from '../stores/PreFlightStore';
import StageProgress from '../components/StageProgress';

class Postflight extends mixin(StoreMixin) {
  constructor() {
    super();

    this.store_listeners = [
      {name: 'preFlight', events: ['stateChange']},
      {name: 'deploy', events: ['beginSuccess']},
    ];
  }

  onDeployStoreBeginSuccess() {
    this.context.router.push('/deploy');
  }

  render() {
    return (
      <StageProgress
        store={PreFlightStore}
        stageID="preflight"
        stateText="Pre-Flight"
        runningText="Running Pre-Flight..."
        nextButtonText="Deploy"
        nextButtonAction={DeployStore.beginStage}
        nextStageText="Deploy"
        nextStageAction={DeployStore.beginStage.bind(DeployStore)}
        router={this.context.router}
        />
    );
  }
}

Postflight.contextTypes = {
  router: React.PropTypes.object
};

module.exports = Postflight;
