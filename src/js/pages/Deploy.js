import React from 'react';

import ErrorLabel from '../components/ErrorLabel';
import IconCircleCheckmark from '../components/icons/IconCircleCheckmark';
import Page from '../components/Page';
import PageSection from '../components/PageSection';
import ProgressBar from '../components/ProgressBar';
import SectionBody from '../components/SectionBody';
import SectionHeader from '../components/SectionHeader';
import SectionHeaderIcon from '../components/SectionHeaderIcon';
import SectionHeaderPrimary from '../components/SectionHeaderPrimary';
import SectionHeaderSecondary from '../components/SectionHeaderSecondary';
import SectionFooter from '../components/SectionFooter';

module.exports = class Deploy extends React.Component {
  render() {
    return (
      <Page hasNavigationBar={true}>
        <PageSection>
          <SectionHeader>
            <SectionHeaderIcon>
              <IconCircleCheckmark />
            </SectionHeaderIcon>
            <SectionHeaderPrimary>
              Deploy Complete
            </SectionHeaderPrimary>
            <SectionHeaderSecondary>
              <ErrorLabel step="deploy" />
            </SectionHeaderSecondary>
          </SectionHeader>
          <SectionBody>
            <ProgressBar label="Masters Deployed" progress={100}
              state="success" />
            <ProgressBar label="Agents Deployed" progress={100}
              state="success" />
          </SectionBody>
          <SectionFooter>
            Actions
          </SectionFooter>
        </PageSection>
      </Page>
    );
  }
}
