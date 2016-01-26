import mixin from 'reactjs-mixin';
import {StoreMixin} from 'mesosphere-shared-reactjs';
/* eslint-disable no-unused-vars */
import React from 'react';
/* eslint-enable no-unused-vars */

import IconArrow from '../components/icons/IconArrow';
import IconSpinner from '../components/icons/IconSpinner';
import IconCircleCheckmark from '../components/icons/IconCircleCheckmark';
import IconDownload from '../components/icons/IconDownload';
import InstallerStore from '../stores/InstallerStore';
import PostFlightStore from '../stores/PostFlightStore';
import Page from '../components/Page';
import PageContent from '../components/PageContent';
import PageSection from '../components/PageSection';
import SectionBody from '../components/SectionBody';
import SectionHeader from '../components/SectionHeader';
import SectionHeaderIcon from '../components/SectionHeaderIcon';
import SectionHeaderPrimary from '../components/SectionHeaderPrimary';
import SectionHeaderSecondary from '../components/SectionHeaderSecondary';
import SectionFooter from '../components/SectionFooter';
import StageLinks from '../components/StageLinks';
import StageActionButtons from '../components/StageActionButtons';

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
    // let totalMasters = PostFlightStore.get('masters').totalMasters;
    // let totalAgents = PostFlightStore.get('agents').totalAgents;
    let totalMasters = 382;
    let totalAgents = 0;
    let durationMinutes = 22;

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
                Successfully Installed on <span className="success-node-count">{totalMasters}</span> Nodes
              </SectionHeaderPrimary>
              <SectionHeaderSecondary>
                Congratulations! The DCOS was successfully installed
                on {totalNodes} nodes in {durationMinutes} minutes and is ready
                to be launched.
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
