import React from 'react';

import InstallerStore from '../stores/InstallerStore';
import PostFlightStore from '../stores/PostFlightStore';
import Page from '../components/Page';
import PageContent from '../components/PageContent';
import PageSection from '../components/PageSection';
import SectionBody from '../components/SectionBody';
import SectionHeader from '../components/SectionHeader';
import SectionHeaderIcon from '../components/SectionHeaderIcon';
import SectionHeaderPrimary from '../components/SectionHeaderPrimary';
import SectionFooter from '../components/SectionFooter';
import StageLinks from '../components/StageLinks';

module.exports = class Success extends React.Component {
  componentDidMount() {
    InstallerStore.setNextStep({
      enabled: false,
      visible: false
    });
  }

  render() {
    let totalMasters = PostFlightStore.get('masters').totalMasters;
    let totalAgents = PostFlightStore.get('agents').totalAgents;

    return (
      <Page hasNavigationBar={true}>
        <PageContent>
          <PageSection>
            <SectionHeader>
              <SectionHeaderIcon/>
              <SectionHeaderPrimary>
                {`Successfully installed on ${totalMasters} Masters`}
              </SectionHeaderPrimary>
              <SectionHeaderPrimary>
                {`Successfully installed on ${totalAgents} Agents`}
              </SectionHeaderPrimary>
            </SectionHeader>
            <SectionBody>
              Some content...
            </SectionBody>
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
