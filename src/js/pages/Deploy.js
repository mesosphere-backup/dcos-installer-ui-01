import mixin from 'reactjs-mixin';
import {StoreMixin} from 'mesosphere-shared-reactjs';
/* eslint-disable no-unused-vars */
import React from 'react';
/* eslint-enable no-unused-vars */

import Config from '../config/Config';
import DeployStore from '../stores/DeployStore';
import PostFlightStore from '../stores/PostFlightStore';
import StageProgress from '../components/StageProgress';

class Postflight extends mixin(StoreMixin) {
  constructor() {
    super();

    this.store_listeners = [
      {name: 'deploy', events: ['stateChange']},
      {name: 'postFlight', events: ['beginSuccess']}
    ];
  }

  onPostFlightStoreBeginSuccess() {
    this.context.router.push('/post-flight');
  }

  render() {
    return (
      <StageProgress
        store={DeployStore}
        stageID="deploy"
        stateText="Deploy"
        runningText={`Deploying ${Config.productName}...`}
        nextButtonText="Run Post-Flight"
        nextButtonAction={PostFlightStore.beginStage}
        nextStageText="Run Post-Flight"
        nextStageAction={PostFlightStore.beginStage.bind(PostFlightStore)}
        router={this.context.router}
        />
    );
  }
}

Postflight.contextTypes = {
  router: React.PropTypes.object
};

module.exports = Postflight;
