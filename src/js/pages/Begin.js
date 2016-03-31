import {Link} from 'react-router';
import React from 'react';

import IconArrow from '../components/icons/IconArrow';
import IconLogomark from '../components/icons/IconLogomark';
import InstallerStore from '../stores/InstallerStore';
import InstallationStages from '../constants/InstallationStages';
import Page from '../components/Page';
import PageContent from '../components/PageContent';
import PageFooter from '../components/PageFooter';
import PageSection from '../components/PageSection';
import SectionHeader from '../components/SectionHeader';
import SectionHeaderIcon from '../components/SectionHeaderIcon';
import SectionHeaderPrimary from '../components/SectionHeaderPrimary';
import SectionHeaderSecondary from '../components/SectionHeaderSecondary';
import SectionFooter from '../components/SectionFooter';

module.exports = class Begin extends React.Component {
  getNextButton(currentStage) {
    if (InstallationStages.indexOf(currentStage) !== -1) {
      return (
        <div>
          <Link to={`/${currentStage}`} className="button button-large button-rounded button-primary">
            Resume Installation
            <IconArrow />
          </Link>
          <Link to="/setup" className="stage-link button button-link button-inverse">
            or, Begin New Installation
          </Link>
        </div>
      );
    }

    return (
      <Link to="/setup" className="button button-large button-rounded button-primary">
        Begin Installation
        <IconArrow />
      </Link>
    );
  }

  render() {
    let currentStage = InstallerStore.get('currentStage');

    return (
      <Page inverse={true} size="medium" pageName="begin">
        <PageContent>
          <PageSection>
            <SectionHeader>
              <SectionHeaderIcon>
                <IconLogomark />
              </SectionHeaderIcon>
              <SectionHeaderPrimary inverse={true}>
                Mesosphere DCOS 1.7
              </SectionHeaderPrimary>
              <SectionHeaderSecondary inverse={true}>
                Welcome to the DCOS 1.7 Installer. You will be guided through the
                steps necessary to setup and install version 1.7 of the DCOS in
                your datacenter.
              </SectionHeaderSecondary>
            </SectionHeader>
            <SectionFooter>
              {this.getNextButton(currentStage)}
            </SectionFooter>
          </PageSection>
        </PageContent>
        <PageFooter />
      </Page>
    );
  }
}
