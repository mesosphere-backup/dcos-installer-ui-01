import React from 'react';

import IconError from '../components/icons/IconError';
import PageSection from '../components/PageSection';
import PageWithNavigation from '../modules/PageWithNavigation';
import SectionBody from '../components/SectionBody';
import SectionHeader from '../components/SectionHeader';
import SectionHeaderIcon from '../components/SectionHeaderIcon';
import SectionHeaderPrimary from '../components/SectionHeaderPrimary';
import SectionHeaderSecondary from '../components/SectionHeaderSecondary';
import SectionFooter from '../components/SectionFooter';
import Tooltip from '../components/Tooltip';

module.exports = class Setup extends React.Component {
  render() {
    return (
      <PageWithNavigation hasNavigationBar={true}>
        <PageSection>
          <SectionHeader>
            <SectionHeaderIcon>
              <IconError />
            </SectionHeaderIcon>
            <SectionHeaderPrimary>
              Setup...
              <Tooltip content="I'm a tooltip!" />
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
