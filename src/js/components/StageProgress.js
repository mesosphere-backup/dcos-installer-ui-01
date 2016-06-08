import React from 'react';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';

import ErrorLabel from '../components/ErrorLabel';
import IconCircleCheckmark from '../components/icons/IconCircleCheckmark';
import IconWarning from '../components/icons/IconWarning';
import InstallerStore from '../stores/InstallerStore';
import NodesList from '../components/NodesList';
import Page from '../components/Page';
import PageContent from '../components/PageContent';
import PageSection from '../components/PageSection';
import ProgressBar from '../components/ProgressBar';
import SectionBody from '../components/SectionBody';
import SectionHeader from '../components/SectionHeader';
import SectionHeaderIcon from '../components/SectionHeaderIcon';
import SectionHeaderPrimary from '../components/SectionHeaderPrimary';
import SectionHeaderSecondary from '../components/SectionHeaderSecondary';
import SectionFooter from '../components/SectionFooter';
import StageActionButtons from '../components/StageActionButtons';
import StageLinks from '../components/StageLinks';
import StringUtil from '../utils/StringUtil';

const METHODS_TO_BIND = ['handleDetailsActionClick'];

class StageProgress extends React.Component {
  constructor() {
    super();

    this.state = {
      nodeListOpen: false
    };

    METHODS_TO_BIND.forEach((method) => {
      this[method] = this[method].bind(this);
    });
  }

  componentWillMount() {
    this.props.store.init();
  }

  componentDidMount() {
    InstallerStore.setNextStep({
      enabled: false,
      label: this.props.nextButtonText,
      link: null,
      clickHandler: this.props.nextButtonAction,
      visible: true
    });
  }

  handleDetailsActionClick() {
    this.setState({nodeListOpen: !this.state.nodeListOpen});
  }

  handleRetryClick() {
    this.refs.progressBar.refs.timer.resetTimer();
    this.props.store.beginStage({retry: true});
    this.props.store.init();
  }

  getHeaderIcon(progressState = {}) {
    if (progressState.completed && progressState.errorCount === 0) {
      return (
        <IconCircleCheckmark
          classNames="icon-padded"
          key="icon-circle-checkmark" />
      );
    }

    if (progressState.completed && progressState.errorCount > 0) {
      return <IconWarning className="icon-padded" key="icon-warning" />;
    }

    return this.props.stageIcon;
  }

  getHeaderContent(progressState = {}) {
    if (progressState.completed) {
      if (progressState.failed) {
        return `${this.props.stateText} Failed`;
      }

      if (progressState.errorCount > 0) {
        return `${this.props.stateText} Completed with Errors`;
      }

      return `${this.props.stateText} Complete`;
    }

    return this.props.runningText;
  }

  getProgressBarLabel(progressState = {}) {
    if (progressState.completed) {
      return 'Check Complete';
    }

    let nodeCount = progressState.runningCount;
    let nodeText = StringUtil.pluralize('Node', nodeCount);

    return (
      <span>
        {`${this.props.nodeAction} ${nodeCount} ${nodeText} `}
        <span className="progress-bar-label-precentage-complete">
          ({progressState.percentComplete}% Complete)
        </span>
      </span>
    );
  }

  render() {
    let {store} = this.props;

    let completed = store.isCompleted();
    let detailsAction = 'Show';
    let errorCount = store.get('errorCount') || 0;
    let errors = store.get('errorDetails');
    let failed = store.isFailed();
    let nodes = store.get('nodes');
    let runningCount = store.get('runningCount');
    let successCount = store.get('successCount');
    let totalHosts = store.get('totalHosts') || 0;

    let percentSuccess = 0;
    let percentError = 0;

    if (totalHosts !== 0) {
      percentSuccess = Number((successCount / totalHosts * 100).toFixed(0));
      percentError = Number((errorCount / totalHosts * 100).toFixed(0));
    }

    let percentComplete = percentSuccess + percentError;

    if (this.state.nodeListOpen) {
      detailsAction = 'Hide';
    }

    let progressBarLabel = this.getProgressBarLabel({
      completed,
      runningCount,
      percentComplete
    });

    if (completed || (totalHosts > 0 && totalHosts === errorCount)) {
      this.refs.progressBar.refs.timer.stopTimer();
    }

    return (
      <Page hasNavigationBar={true}>
        <PageContent>
          <PageSection>
            <SectionHeader>
              <SectionHeaderIcon
                layoutClassName="section-header-icon-stage-status">
                <ReactCSSTransitionGroup
                  transitionAppearTimeout={500}
                  transitionEnterTimeout={500}
                  transitionLeaveTimeout={500}
                  transitionName="section-header-icon">
                  {this.getHeaderIcon({completed, failed, errorCount})}
                </ReactCSSTransitionGroup>
              </SectionHeaderIcon>
              <SectionHeaderPrimary layoutClassName="flush-bottom flush-top">
                {this.getHeaderContent({completed, failed, errorCount})}
              </SectionHeaderPrimary>
              <SectionHeaderSecondary className="section-header-secondary
                section-header-secondary-stage-state">
                <ErrorLabel step={this.props.stageID} errors={errors} />
              </SectionHeaderSecondary>
            </SectionHeader>
            <SectionBody>
              <ProgressBar
                label={
                  <span>
                    {progressBarLabel}
                    <span
                      className="clickable"
                      onClick={this.handleDetailsActionClick}>
                      {detailsAction} Details
                    </span>
                  </span>
                }
                percentComplete={percentComplete}
                progress={{percentSuccess, percentError}}
                ref="progressBar" />
            </SectionBody>
            <SectionBody>
              <NodesList nodes={nodes} visible={this.state.nodeListOpen} />
            </SectionBody>
          </PageSection>
          <PageSection>
            <SectionFooter>
              <StageActionButtons
                completed={completed}
                failed={failed}
                nextText={this.props.nextStageText}
                onNextClick={this.props.nextStageAction}
                onRetryClick={this.handleRetryClick.bind(this)}
                showDisabled={true}
                totalErrors={errorCount} />
            </SectionFooter>
            <SectionFooter>
              <StageLinks
                completed={completed}
                disabledDisplay={true}
                failed={failed}
                stage={this.props.stageID}
                totalErrors={errorCount} />
            </SectionFooter>
          </PageSection>
        </PageContent>
      </Page>
    );
  }
}

StageProgress.defaultProps = {
  nodeAction: 'Checking'
};

StageProgress.propTypes = {
  nextButtonAction: React.PropTypes.func.isRequired,
  nextButtonText: React.PropTypes.string.isRequired,
  nextStageAction: React.PropTypes.func.isRequired,
  nextStageText: React.PropTypes.string.isRequired,
  nodeAction: React.PropTypes.string,
  router: React.PropTypes.object,
  runningText: React.PropTypes.string.isRequired,
  stageIcon: React.PropTypes.node.isRequired,
  stageID: React.PropTypes.string.isRequired,
  stateText: React.PropTypes.string.isRequired,
  store: React.PropTypes.object.isRequired
};

module.exports = StageProgress;
