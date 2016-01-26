import mixin from 'reactjs-mixin';
import {StoreMixin} from 'mesosphere-shared-reactjs';
/* eslint-disable no-unused-vars */
import React from 'react';
/* eslint-enable no-unused-vars */

import IconArrow from '../components/icons/IconArrow';
import IconSpinner from '../components/icons/IconSpinner';
import IconCircleCheckmark from '../components/icons/IconCircleCheckmark';
import InstallerStore from '../stores/InstallerStore';
import PostFlightStore from '../stores/PostFlightStore';
import Page from '../components/Page';
import PageContent from '../components/PageContent';
import PageSection from '../components/PageSection';
import SectionHeader from '../components/SectionHeader';
import SectionHeaderIcon from '../components/SectionHeaderIcon';
import SectionHeaderPrimary from '../components/SectionHeaderPrimary';
import SectionHeaderSecondary from '../components/SectionHeaderSecondary';
import SectionFooter from '../components/SectionFooter';
import StageLinks from '../components/StageLinks';

module.exports = class Success extends mixin(StoreMixin) {
  constructor() {
    super();

    this.store_listeners = [
      {name: 'installer', events: ['DCOSUrlChange']}
    ];
    InstallerStore.fetchDCOSURL();
  }

  componentDidMount() {
    InstallerStore.setNextStep({
      enabled: false,
      visible: false
    });
  }

  getLaunchButton() {
    let url = InstallerStore.get('dcosURL');

    if (!url) {
      return (
        <IconSpinner />
      );
    }

    return (
      <a href={url}
        className="button button-large button-rounded button-primary">
        Launch DCOS
        <IconArrow />
      </a>
    );
  }

  render() {
    let totalMasters = 0;
    let totalAgents = 0;

    let masterStatus = PostFlightStore.get('masters');
    let agentStatus = PostFlightStore.get('agents');

    if (masterStatus != null && agentStatus != null) {
      totalMasters = masterStatus.totalMasters;
      totalAgents = agentStatus.totalAgents;
    }

    let totalNodes = totalMasters + totalAgents;

    return (
      <Page hasNavigationBar={true} pageName="success" size="medium">
        <PageContent>
          <PageSection>
            <SectionHeader>
              <SectionHeaderIcon>
                <IconCircleCheckmark size="large" />
              </SectionHeaderIcon>
              <SectionHeaderPrimary>
                Successfully Installed on <span className="success-node-count">{totalNodes}</span> Nodes
              </SectionHeaderPrimary>
              <SectionHeaderSecondary>
                Congratulations! The DCOS was successfully installed
                on {totalNodes} nodes and is ready to be launched.
              </SectionHeaderSecondary>
            </SectionHeader>
          </PageSection>
          <PageSection>
            <SectionFooter>
              {this.getLaunchButton()}
            </SectionFooter>
            <SectionFooter>
              <StageLinks
                completed={true}
                disabledDisplay={false}
                failed={false}
                stage="postflight"
                totalErrors={0} />
            </SectionFooter>
          </PageSection>
        </PageContent>
      </Page>
    );
  }
}
