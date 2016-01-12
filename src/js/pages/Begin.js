import {Link} from 'react-router';
import React from 'react';

import Page from '../components/Page';
import PageSection from '../components/PageSection';
import SectionHeader from '../components/SectionHeader';
import SectionHeaderIcon from '../components/SectionHeaderIcon';
import SectionHeaderPrimary from '../components/SectionHeaderPrimary';
import SectionFooter from '../components/SectionFooter';

module.exports = class Begin extends React.Component {
  render() {
    return (
      <Page inverse={true}>
        <PageSection>
          <SectionHeader>
            <SectionHeaderIcon/>
            <SectionHeaderPrimary inverse={true}>
              Mesosphere DCOS 1.6
            </SectionHeaderPrimary>
          </SectionHeader>
          <SectionFooter>
            <Link to="/setup" className="button button-stroke button-rounded button-inverse">Begin</Link>
          </SectionFooter>
        </PageSection>
      </Page>
    );
  }
}
