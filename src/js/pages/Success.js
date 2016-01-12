import React from 'react';

import PageSection from '../components/PageSection';
import Page from '../components/Page';
import SectionBody from '../components/SectionBody';
import SectionHeader from '../components/SectionHeader';
import SectionHeaderIcon from '../components/SectionHeaderIcon';
import SectionHeaderPrimary from '../components/SectionHeaderPrimary';
import SectionFooter from '../components/SectionFooter';

module.exports = class Success extends React.Component {
  render() {
    return (
      <Page hasNavigationBar={true}>
        <PageSection>
          <SectionHeader>
            <SectionHeaderIcon/>
            <SectionHeaderPrimary>
              Successfully installed on 382 Nodes
            </SectionHeaderPrimary>
          </SectionHeader>
          <SectionBody>
            Some content...
          </SectionBody>
          <SectionFooter>
            Actions
          </SectionFooter>
        </PageSection>
      </Page>
    );
  }
}
