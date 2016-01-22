import React from 'react';

import InstallerStore from '../stores/InstallerStore';
import Page from '../components/Page';
import PageContent from '../components/PageContent';
import PageSection from '../components/PageSection';
import SectionBody from '../components/SectionBody';
import SectionHeader from '../components/SectionHeader';
import SectionHeaderIcon from '../components/SectionHeaderIcon';
import SectionHeaderPrimary from '../components/SectionHeaderPrimary';
import SectionFooter from '../components/SectionFooter';

module.exports = class Success extends React.Component {
  render() {
    let totalMasters = InstallerStore.get('totalMasters');
    let totalSlaves = InstallerStore.get('totalSlaves');

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
                {`Successfully installed on ${totalSlaves} Slaves`}
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
