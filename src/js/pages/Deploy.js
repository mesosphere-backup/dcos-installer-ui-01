import mixin from 'reactjs-mixin';
import {StoreMixin} from 'mesosphere-shared-reactjs';
/* eslint-disable no-unused-vars */
import React from 'react';
/* eslint-enable no-unused-vars */

import Config from '../config/Config';
import DeployStore from '../stores/DeployStore';
import IconStageDeploy from '../components/icons/IconStageDeploy';
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
        nextButtonAction={PostFlightStore.beginStage}
        nextButtonText="Run Post-Flight"
        nextStageAction={PostFlightStore.beginStage.bind(PostFlightStore)}
        nextStageText="Run Post-Flight"
        router={this.context.router}
        runningText={`Deploying ${Config.productName}...`}
        stageIcon={<IconStageDeploy />}
        stageID="deploy"
        stateText="Deploy"
        store={DeployStore}
        />
    );
  }
}

Postflight.contextTypes = {
  router: React.PropTypes.object
};

module.exports = Postflight;
