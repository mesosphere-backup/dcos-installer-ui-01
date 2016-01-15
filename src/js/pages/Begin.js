import {Link} from 'react-router';
import React from 'react';

import IconArrow from '../components/icons/IconArrow';
import IconLogomark from '../components/icons/IconLogomark';
import Page from '../components/Page';
import PageFooter from '../components/PageFooter';
import PageSection from '../components/PageSection';
import SectionHeader from '../components/SectionHeader';
import SectionHeaderIcon from '../components/SectionHeaderIcon';
import SectionHeaderPrimary from '../components/SectionHeaderPrimary';
import SectionHeaderSecondary from '../components/SectionHeaderSecondary';
import SectionFooter from '../components/SectionFooter';

module.exports = class Begin extends React.Component {
  render() {
    return (
      <Page inverse={true} size="small" pageName="begin">
        <PageSection>
          <SectionHeader>
            <SectionHeaderIcon>
              <IconLogomark />
            </SectionHeaderIcon>
            <SectionHeaderPrimary inverse={true}>
              Mesosphere DCOS 1.6
            </SectionHeaderPrimary>
            <SectionHeaderSecondary inverse={true}>
              Welcome to the DCOS 1.6 Installer. You will be guided through the
              steps necessary to setup and install version 1.6 of the DCOS in
              your datacenter.
            </SectionHeaderSecondary>
          </SectionHeader>
          <SectionFooter>
            <Link to="/setup" className="button button-large button-rounded button-primary">
              Begin Installation
              <IconArrow />
            </Link>
          </SectionFooter>
        </PageSection>
        <PageFooter />
      </Page>
    );
  }
}
