import React from 'react';

import Page from '../components/Page';
import PageSection from '../components/PageSection';
import SectionBody from '../components/SectionBody';
import SectionHeader from '../components/SectionHeader';
import SectionHeaderIcon from '../components/SectionHeaderIcon';
import SectionHeaderPrimary from '../components/SectionHeaderPrimary';
import SectionHeaderSecondary from '../components/SectionHeaderSecondary';
import SectionFooter from '../components/SectionFooter';

export default class Success extends React.Component {
  render() {
    return (
      <Page hasNavigationBar={true}>
        <PageSection>
          <SectionHeader>
            <SectionHeaderIcon/>
            <SectionHeaderPrimary>
              Success!
            </SectionHeaderPrimary>
            <SectionHeaderSecondary>
              No Errors Found
            </SectionHeaderSecondary>
          </SectionHeader>
          <SectionBody>
            Masters Progress<br />
            Agents Progress
          </SectionBody>
          <SectionFooter>
            Actions
          </SectionFooter>
        </PageSection>
      </Page>
    );
  }
}
