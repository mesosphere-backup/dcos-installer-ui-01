import React from 'react';

import PageSection from '../components/PageSection';
import PageWithNavigation from '../modules/PageWithNavigation';
import SectionBody from '../components/SectionBody';
import SectionHeader from '../components/SectionHeader';
import SectionHeaderIcon from '../components/SectionHeaderIcon';
import SectionHeaderPrimary from '../components/SectionHeaderPrimary';
import SectionHeaderSecondary from '../components/SectionHeaderSecondary';
import SectionFooter from '../components/SectionFooter';

module.exports = class Preflight extends React.Component {
  render() {
    return (
      <PageWithNavigation hasNavigationBar={true}>
        <PageSection>
          <SectionHeader>
            <SectionHeaderIcon/>
            <SectionHeaderPrimary>
              Running Pre-Flight...
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
      </PageWithNavigation>
    );
  }
}
