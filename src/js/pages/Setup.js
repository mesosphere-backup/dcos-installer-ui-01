import React from 'react';

import IconError from '../components/icons/IconError';
import PageSection from '../components/PageSection';
import Page from '../components/Page';
import SectionBody from '../components/SectionBody';
import SectionHeader from '../components/SectionHeader';
import SectionHeaderIcon from '../components/SectionHeaderIcon';
import SectionHeaderPrimary from '../components/SectionHeaderPrimary';
import SectionFooter from '../components/SectionFooter';
import Tooltip from '../components/Tooltip';

module.exports = class Setup extends React.Component {
  render() {
    return (
      <Page hasNavigationBar={true}>
        <PageSection>
          <SectionHeader>
            <SectionHeaderIcon>
              <IconError />
            </SectionHeaderIcon>
            <SectionHeaderPrimary>
              Setup...
              <Tooltip content="I'm a tooltip!" />
            </SectionHeaderPrimary>
          </SectionHeader>
          <SectionBody>
            Some forms...
          </SectionBody>
          <SectionFooter>
            Actions
          </SectionFooter>
        </PageSection>
      </Page>
    );
  }
}
