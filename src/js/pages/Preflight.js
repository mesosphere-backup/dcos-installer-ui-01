import React from 'react';

import IconSpinner from '../components/icons/IconSpinner';
import PageSection from '../components/PageSection';
import PageWithNavigation from '../components/PageWithNavigation';
import ProgressBar from '../components/ProgressBar';
import SectionBody from '../components/SectionBody';
import SectionHeader from '../components/SectionHeader';
import SectionHeaderIcon from '../components/SectionHeaderIcon';
import SectionHeaderPrimary from '../components/SectionHeaderPrimary';
import SectionHeaderSecondary from '../components/SectionHeaderSecondary';
import SectionFooter from '../components/SectionFooter';

module.exports = class Preflight extends React.Component {
  render() {
    return (
      <PageWithNavigation>
        <PageSection>
          <SectionHeader>
            <SectionHeaderIcon>
              <IconSpinner />
            </SectionHeaderIcon>
            <SectionHeaderPrimary>
              Running Pre-Flight...
            </SectionHeaderPrimary>
            <SectionHeaderSecondary>
              No Errors Found
            </SectionHeaderSecondary>
          </SectionHeader>
          <SectionBody>
            <ProgressBar detail="Checking 1 of 2" label="Checking Masters"
              progress={80.32483} state="ongoing" />
            <ProgressBar detail="Checking 0 of 2" label="Checking Agents"
              progress={10.32483} state="error" />
          </SectionBody>
          <SectionFooter>
            Actions
          </SectionFooter>
        </PageSection>
      </PageWithNavigation>
    );
  }
}
