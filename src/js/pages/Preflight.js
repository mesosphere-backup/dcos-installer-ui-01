import mixin from 'reactjs-mixin';
import {StoreMixin} from 'mesosphere-shared-reactjs';
/* eslint-disable no-unused-vars */
import React from 'react';
/* eslint-enable no-unused-vars */

import DeployStore from '../stores/DeployStore';
import IconSpinnerLarge from '../components/icons/IconSpinnerLarge';
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
        nextButtonAction={DeployStore.beginStage}
        nextButtonText="Deploy"
        nextStageAction={DeployStore.beginStage.bind(DeployStore)}
        nextStageText="Deploy"
        router={this.context.router}
        runningText="Running Pre-Flight..."
        stageIcon={<IconSpinnerLarge />}
        stageID="preflight"
        stateText="Pre-Flight"
        store={PreFlightStore}
        />
    );
  }
}

Postflight.contextTypes = {
  router: React.PropTypes.object
};

module.exports = Postflight;
