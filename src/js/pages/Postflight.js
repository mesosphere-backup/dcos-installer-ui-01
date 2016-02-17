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
import ProgressBarUtil from '../utils/ProgressBarUtil';
import SectionBody from '../components/SectionBody';
import SectionHeader from '../components/SectionHeader';
import SectionHeaderIcon from '../components/SectionHeaderIcon';
import SectionHeaderPrimary from '../components/SectionHeaderPrimary';
import SectionHeaderSecondary from '../components/SectionHeaderSecondary';
import SectionFooter from '../components/SectionFooter';
import StageActionButtons from '../components/StageActionButtons';
import StageLinks from '../components/StageLinks';
import StringUtil from '../utils/StringUtil';

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
      label: 'Continue',
      link: null,
      clickHandler: this.goToSuccess.bind(this),
      visible: true
    });
  }

  handleRetryClick() {
    PostFlightStore.beginStage({retry: true});
    PostFlightStore.init();
  }

  goToSuccess() {
    InstallerStore.processCurrentStage('success');
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
      let errorsText = StringUtil.pluralize('Error', errors);
      let typeText = StringUtil.pluralize(type, errors);
      return `${errorsText} with ${errors} ${typeText}`;
    }

    if (completed) {
      let {errors, totalStarted} = PostFlightStore.get(`${type.toLowerCase()}s`);
      let nodeCount = totalStarted - errors;

      if (nodeCount < 0) {
        nodeCount = 0;
      }

      let typeText = StringUtil.pluralize(type, nodeCount);

      return `${nodeCount} ${typeText} Check Complete`;
    }

    return `Checking ${type}s`;
  }

  getProgressBar(type, completed, status, totalOfType) {
    let progress = ProgressBarUtil.getPercentage(
      status.totalStarted, totalOfType, type, PostFlightStore
    );
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

  onPostFlightStoreStateFinish() {
    let masterStatus = PostFlightStore.get('masters');
    let agentStatus = PostFlightStore.get('agents');
    let totalErrors = masterStatus.errors + agentStatus.errors;

    if (PostFlightStore.isCompleted() && totalErrors === 0) {
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
                  'Master',
                  PostFlightStore.isMasterCompleted(),
                  masterStatus,
                  totalMasters
                )
              }
              {
                this.getProgressBar(
                  'Agent',
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
                showDisabled={true}
                totalErrors={totalErrors} />
            </SectionFooter>
            <SectionFooter>
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
