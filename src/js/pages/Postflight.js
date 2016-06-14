import mixin from 'reactjs-mixin';
import {StoreMixin} from 'mesosphere-shared-reactjs';
/* eslint-disable no-unused-vars */
import React from 'react';
/* eslint-enable no-unused-vars */

import IconStagePostflight from '../components/icons/IconStagePostflight';
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
    if (PostFlightStore.isCompleted() && PostFlightStore.get('masterErrorCount') === 0 &&  PostFlightStore.get('agentErrorCount') === 0) {
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
        nextButtonAction={this.goToSuccess.bind(this)}
        nextButtonText="Continue"
        nextStageAction={this.goToSuccess.bind(this)}
        nextStageText="Continue"
        router={this.context.router}
        runningText="Running Post-Flight..."
        stageIcon={<IconStagePostflight />}
        stageID="postflight"
        stateText="Post-Flight"
        store={PostFlightStore}
        />
    );
  }
}

Postflight.contextTypes = {
  router: React.PropTypes.object
};

module.exports = Postflight;
