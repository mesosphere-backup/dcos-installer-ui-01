import React from 'react';

import PostFlightStore from '../stores/PostFlightStore';
import Page from '../components/Page';
import PageContent from '../components/PageContent';
import PageSection from '../components/PageSection';
import SectionBody from '../components/SectionBody';
import SectionHeader from '../components/SectionHeader';
import SectionHeaderIcon from '../components/SectionHeaderIcon';
import SectionHeaderPrimary from '../components/SectionHeaderPrimary';
import SectionFooter from '../components/SectionFooter';

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
              Actions
            </SectionFooter>
          </PageSection>
        </PageContent>
      </Page>
    );
  }
}
