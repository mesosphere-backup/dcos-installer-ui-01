import React from 'react';

import Page from '../components/Page';
import PageSection from '../components/PageSection';
import SectionHeader from '../components/SectionHeader';
import SectionHeaderIcon from '../components/SectionHeaderIcon';
import SectionHeaderPrimary from '../components/SectionHeaderPrimary';

export default class NotFound extends React.Component {
  render() {
    return (
      <Page hasNavigationBar={true}>
        <PageSection>
          <SectionHeader>
            <SectionHeaderIcon/>
            <SectionHeaderPrimary>
              We couldn't find what you were looking for.
            </SectionHeaderPrimary>
          </SectionHeader>
        </PageSection>
      </Page>
    );
  }
}
