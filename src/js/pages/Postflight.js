import React from 'react';

import ErrorLabel from '../components/ErrorLabel';
import IconWarning from '../components/icons/IconWarning';
import Page from '../components/Page';
import PageSection from '../components/PageSection';
import ProgressBar from '../components/ProgressBar';
import SectionBody from '../components/SectionBody';
import SectionHeader from '../components/SectionHeader';
import SectionHeaderIcon from '../components/SectionHeaderIcon';
import SectionHeaderPrimary from '../components/SectionHeaderPrimary';
import SectionHeaderSecondary from '../components/SectionHeaderSecondary';
import SectionFooter from '../components/SectionFooter';

module.exports = class Postflight extends React.Component {
  render() {
    return (
      <Page hasNavigationBar={true}>
        <PageSection>
          <SectionHeader>
            <SectionHeaderIcon>
              <IconWarning />
            </SectionHeaderIcon>
            <SectionHeaderPrimary>
              Running Post-Flight...
            </SectionHeaderPrimary>
            <SectionHeaderSecondary>
              <ErrorLabel step="postflight" />
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
      </Page>
    );
  }
}
