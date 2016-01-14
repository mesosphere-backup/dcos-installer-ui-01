import {Form} from 'reactjs-components';
import React from 'react';

import IconError from '../components/icons/IconError';
import PageSection from '../components/PageSection';
import Page from '../components/Page';
import PasswordStrengthMeter from '../components/PasswordStrengthMeter';
import SectionBody from '../components/SectionBody';
import SectionHeader from '../components/SectionHeader';
import SectionHeaderIcon from '../components/SectionHeaderIcon';
import SectionHeaderPrimary from '../components/SectionHeaderPrimary';
import SectionFooter from '../components/SectionFooter';
import SetupForm from '../constants/SetupForm';
import Tooltip from '../components/Tooltip';

console.log(Form);
console.log(SetupForm);

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
              Setup
              <Tooltip content="I'm a tooltip!" />
            </SectionHeaderPrimary>
          </SectionHeader>
          <SectionBody>
            <Form definition={[{
              fieldType: 'checkbox',
              value: [
                {
                  name: 'isManager',
                  label: 'Manager',
                  checked: false
                },
                {
                  name: 'isDeveloper',
                  label: 'Developer',
                  checked: false
                },
                {
                  name: 'isSRE',
                  label: 'SRE',
                  checked: false
                }
              ],
              showLabel: 'What is your role?',
              name: 'role',
              validation: function (value) {
                let result = false;
                value.forEach(function (item) {
                  if (item.checked) {
                    result = item.checked;
                  }
                });

                return result;
              },
              validationErrorText: 'Please select at least one option.'
            }]} />
          </SectionBody>
          <SectionFooter>
            Actions
          </SectionFooter>
        </PageSection>
      </Page>
    );
  }
}
