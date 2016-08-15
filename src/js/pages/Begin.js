import {Link} from 'react-router';
import classnames from 'classnames';
import mixin from 'reactjs-mixin';
import React from 'react';
import {StoreMixin} from 'mesosphere-shared-reactjs';

import Config from '../config/Config';
import IconArrow from '../components/icons/IconArrow';
import IconDCOS from '../components/icons/IconDCOS';
import InstallerStore from '../stores/InstallerStore';
import InstallationStages from '../constants/InstallationStages';
import Page from '../components/Page';
import PageContent from '../components/PageContent';
import PageFooter from '../components/PageFooter';
import PageSection from '../components/PageSection';
import PluginSDK from 'PluginSDK';
import SectionHeader from '../components/SectionHeader';
import SectionHeaderIcon from '../components/SectionHeaderIcon';
import SectionHeaderPrimary from '../components/SectionHeaderPrimary';
import SectionHeaderSecondary from '../components/SectionHeaderSecondary';
import SectionFooter from '../components/SectionFooter';
import SetupStore from '../stores/SetupStore';

let {Hooks} = PluginSDK;

const METHODS_TO_BIND = ['handleBeginClick'];

class Begin extends mixin(StoreMixin) {
  constructor() {
    super();

    this.state = {
      isLoadingConfigType: false
    };

    this.store_listeners = [
      {
        name: 'setup',
        events: ['setInstallTypeError', 'setInstallTypeSuccess'],
        suppressUpdate: true
      }
    ];

    METHODS_TO_BIND.forEach((method) => {
      this[method] = this[method].bind(this);
    });
  }

  onSetupStoreSetInstallTypeError(error) {
    // TODO: Handle this error.
    console.log('this is an error', error);
  }

  onSetupStoreSetInstallTypeSuccess() {
    this.setState({isLoadingConfigType: false}, () => {
      this.context.router.push('/setup')
    });
  }

  handleBeginClick() {
    this.setState({isLoadingConfigType: true});
    SetupStore.setInstallType({configurationProvider: 'onprem'});
  }

  getLogo() {
    return Hooks.applyFilter('dcosLogo', <IconDCOS />);
  }

  getNextButton(currentStage) {
    if (InstallationStages.indexOf(currentStage) !== -1) {
      return (
        <div>
          <Link to={`/${currentStage}`} className="button button-large button-rounded button-primary">
            Resume Installation
            <IconArrow />
          </Link>
          <div className="container-pod container-pod-short text-align-center">
            or
          </div>
          <Link to="/setup" className="text-color-white">
            Start new installation
          </Link>
        </div>
      );
    }

    let beginClasses = classnames('button button-large button-rounded button-primary', {
      'disabled': this.state.isLoadingConfigType
    });

    let beginText = this.state.isLoadingConfigType ? 'Loading...' : 'Begin Installation';

    return (
      <a className={beginClasses} onClick={this.handleBeginClick}>
        {beginText}
        <IconArrow />
      </a>
    );

    return (
      <Link to="/setup" className="button button-large button-rounded button-primary">
        Begin Installation
        <IconArrow />
      </Link>
    );
  }

  render() {
    let currentStage = InstallerStore.get('currentStage');
    let logo = this.getLogo();

    return (
      <Page inverse={true} size="medium" pageName="begin">
        <PageContent>
          <PageSection>
            <SectionHeader>
              <SectionHeaderIcon>
                {logo}
              </SectionHeaderIcon>
              <SectionHeaderPrimary inverse={true}>
                {`Install ${Config.fullProductName}`}
              </SectionHeaderPrimary>
              <SectionHeaderSecondary inverse={true}>
                {`Welcome to the ${Config.fullProductName} Installer. You ` +
                'will be guided through the steps necessary to setup and ' +
                `install the ${Config.fullProductName} in your datacenter.`}
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

Begin.contextTypes = {
  router: React.PropTypes.object
};

module.exports = Begin;
