import mixin from 'reactjs-mixin';
import {StoreMixin} from 'mesosphere-shared-reactjs';
/* eslint-disable no-unused-vars */
import React from 'react';
/* eslint-enable no-unused-vars */

import ErrorLabel from '../components/ErrorLabel';
import IconCircleCheckmark from '../components/icons/IconCircleCheckmark';
import IconSpinner from '../components/icons/IconSpinner';
import IconWarning from '../components/icons/IconWarning';
import InstallerStore from '../stores/InstallerStore';
import Page from '../components/Page';
import PageContent from '../components/PageContent';
import PageSection from '../components/PageSection';
import PostFlightStore from '../stores/PostFlightStore';
import ProgressBar from '../components/ProgressBar';
import SectionBody from '../components/SectionBody';
import SectionHeader from '../components/SectionHeader';
import SectionHeaderIcon from '../components/SectionHeaderIcon';
import SectionHeaderPrimary from '../components/SectionHeaderPrimary';
import SectionHeaderSecondary from '../components/SectionHeaderSecondary';
import SectionFooter from '../components/SectionFooter';
import StageActionButtons from '../components/StageActionButtons';
import StageLinks from '../components/StageLinks';

class Postflight extends mixin(StoreMixin) {
  constructor() {
    super();

    this.store_listeners = [
      {name: 'postFlight', events: ['stateChange', 'stateFinish']}
    ];
  }

  componentWillMount() {
    super.componentWillMount();
    PostFlightStore.init();
  }

  componentDidMount() {
    super.componentDidMount();
    InstallerStore.setNextStep({
      enabled: false,
      label: 'Success',
      link: '/success',
      visible: true
    });
  }

  handleRetryClick() {
    PostFlightStore.beginStage({retry: true});
    PostFlightStore.init();
  }

  goToSuccess() {
    InstallerStore.processCurrentStage(null);
    this.context.router.push('/success');
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
        return 'Post-Flight Failed';
      }

      if (totalErrors > 0) {
        return 'Post-Flight Completed with Errors';
      }

      return 'Post-Flight Complete';
    }

    return 'Running Post-Flight...';
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

  onPostflightStoreStateFinish() {
    if (!PostFlightStore.isFailed()) {
      this.goToSuccess();
    }
  }

  render() {
    let masterStatus = PostFlightStore.get('masters');
    let agentStatus = PostFlightStore.get('agents');

    let completed = PostFlightStore.isCompleted();
    let failed = PostFlightStore.isFailed();
    let totalErrors = masterStatus.errors + agentStatus.errors;
    let totalAgents = agentStatus.totalAgents;
    let totalMasters = masterStatus.totalMasters;

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
                <ErrorLabel step="postflight" />
              </SectionHeaderSecondary>
            </SectionHeader>
            <SectionBody>
              {
                this.getProgressBar(
                  'Masters',
                  PostFlightStore.isMasterCompleted(),
                  masterStatus,
                  totalMasters
                )
              }
              {
                this.getProgressBar(
                  'Agents',
                  PostFlightStore.isAgentCompleted(),
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
                nextText="Continue"
                onNextClick={this.goToSuccess.bind(this)}
                onRetryClick={this.handleRetryClick.bind(this)}
                totalErrors={totalErrors} />
              <StageLinks
                completed={completed}
                disableEditSetup={true}
                failed={failed}
                stage="postflight"
                totalErrors={totalErrors} />
            </SectionFooter>
          </PageSection>
        </PageContent>
      </Page>
    );
  }
}

Postflight.contextTypes = {
  router: React.PropTypes.object
};

module.exports = Postflight;
