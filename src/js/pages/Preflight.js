import mixin from 'reactjs-mixin';
import {StoreMixin} from 'mesosphere-shared-reactjs';
/* eslint-disable no-unused-vars */
import React from 'react';
/* eslint-enable no-unused-vars */

import DeployStore from '../stores/DeployStore';
import ErrorLabel from '../components/ErrorLabel';
import IconCircleCheckmark from '../components/icons/IconCircleCheckmark';
import IconSpinner from '../components/icons/IconSpinner';
import IconWarning from '../components/icons/IconWarning';
import InstallerStore from '../stores/InstallerStore';
import Page from '../components/Page';
import PageContent from '../components/PageContent';
import PageSection from '../components/PageSection';
import PreFlightStore from '../stores/PreFlightStore';
import ProgressBar from '../components/ProgressBar';
import SectionBody from '../components/SectionBody';
import SectionHeader from '../components/SectionHeader';
import SectionHeaderIcon from '../components/SectionHeaderIcon';
import SectionHeaderPrimary from '../components/SectionHeaderPrimary';
import SectionHeaderSecondary from '../components/SectionHeaderSecondary';
import SectionFooter from '../components/SectionFooter';
import StageActionButtons from '../components/StageActionButtons';
import StageLinks from '../components/StageLinks';

class Preflight extends mixin(StoreMixin) {
  constructor() {
    super();

    this.store_listeners = [
      {name: 'preFlight', events: ['stateChange']},
      {name: 'deploy', events: ['beginSuccess']},
    ];
  }

  componentWillMount() {
    PreFlightStore.init();
  }

  componentDidMount() {
    super.componentDidMount();
    InstallerStore.setNextStep({
      enabled: false,
      label: 'Deploy',
      link: '/deploy',
      visible: true
    });
  }

  onDeployStoreBeginSuccess() {
    this.context.router.push('/deploy');
  }

  getHeaderIcon(completed, failed, totalErrors) {
    if (completed && totalErrors === 0) {
      return <IconCircleCheckmark />;
    }

    if (completed && totalErrors > 0) {
      return <IconWarning />;
    }

    return <IconSpinner />;
  }

  getHeaderContent(completed, failed, totalErrors) {
    if (completed) {
      if (failed) {
        return 'Pre-Flight Failed';
      }

      if (totalErrors > 0) {
        return 'Pre-Flight Completed with Errors';
      }

      return 'Pre-Flight Complete';
    }

    return 'Running Pre-Flight';
  }

  getProgressBarDetail(status, completed, total) {
    if (completed) {
      return '';
    }

    let hostCount = status.totalStarted;
    return `Checking ${hostCount} of ${total}`;
  }

  getProgressBarLabel(type, completed, errors) {
    if (errors > 0 && completed) {
      return `Errors with ${errors} ${type}`;
    }

    if (completed) {
      return `${type} Check Complete`;
    }

    return `Checking ${type}`;
  }

  getProgressBar(type, completed, status, totalOfType) {
    let progress = ((status.totalStarted / totalOfType) * 100) || 0;
    let state = 'ongoing';

    if (completed && status.errors > 0) {
      state = 'error';
    } else if (completed) {
      state = 'success';
    }

    return (
      <ProgressBar
        detail={this.getProgressBarDetail(status, completed, totalOfType)}
        label={this.getProgressBarLabel(type, completed, status.errors)}
        progress={progress} state={state} />
    );
  }

  render() {
    let masterStatus = PreFlightStore.get('masters');
    let agentStatus = PreFlightStore.get('agents');

    let completed = PreFlightStore.isCompleted();
    let failed = masterStatus.errors > 0;
    let totalErrors = masterStatus.errors + agentStatus.errors;
    let totalMasters = masterStatus.totalMasters;
    let totalAgents = agentStatus.totalAgents;

    return (
      <Page hasNavigationBar={true}>
        <PageContent>
          <PageSection>
            <SectionHeader>
              <SectionHeaderIcon>
                {this.getHeaderIcon(completed, failed, totalErrors)}
              </SectionHeaderIcon>
              <SectionHeaderPrimary>
                {this.getHeaderContent(completed, failed, totalErrors)}
              </SectionHeaderPrimary>
              <SectionHeaderSecondary>
                <ErrorLabel step="preflight" />
              </SectionHeaderSecondary>
            </SectionHeader>
            <SectionBody>
              {
                this.getProgressBar(
                  'Masters',
                  PreFlightStore.isMasterCompleted(),
                  masterStatus,
                  totalMasters
                )
              }
              {
                this.getProgressBar(
                  'Agents',
                  PreFlightStore.isAgentCompleted(),
                  agentStatus,
                  totalAgents
                )
              }
            </SectionBody>
          </PageSection>
          <PageSection>
            <SectionFooter>
              <StageActionButtons
                completed={completed}
                failed={failed}
                nextText="Deploy"
                onNextClick={DeployStore.beginStage.bind(DeployStore)}
                onRetryClick={PreFlightStore.init.bind(PreFlightStore)}
                showDisabled={true}
                totalErrors={totalErrors} />
              <StageLinks
                completed={completed}
                disabledDisplay={true}
                failed={failed}
                stage="preflight"
                totalErrors={totalErrors} />
            </SectionFooter>
          </PageSection>
        </PageContent>
      </Page>
    );
  }
}

Preflight.contextTypes = {
  router: React.PropTypes.object
};

module.exports = Preflight;
