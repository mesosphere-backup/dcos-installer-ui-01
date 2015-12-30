import React from 'react';

import PageSection from '../components/PageSection';
import PageWithNavigation from '../modules/PageWithNavigation';
import SectionHeader from '../components/SectionHeader';
import SectionHeaderIcon from '../components/SectionHeaderIcon';
import SectionHeaderPrimary from '../components/SectionHeaderPrimary';

module.exports = class NotFound extends React.Component {
  render() {
    return (
      <PageWithNavigation hasNavigationBar={true}>
        <PageSection>
          <SectionHeader>
            <SectionHeaderIcon/>
            <SectionHeaderPrimary>
              We couldn't find what you were looking for.
            </SectionHeaderPrimary>
          </SectionHeader>
        </PageSection>
      </PageWithNavigation>
    );
  }
}
