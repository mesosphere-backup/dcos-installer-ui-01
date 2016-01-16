import _ from 'underscore';
import {Form} from 'reactjs-components';
import React from 'react';

import FormLabel from '../components/FormLabel';
import FormLabelContent from '../components/FormLabelContent';
import Page from '../components/Page';
import PageContent from '../components/PageContent';
import PageSection from '../components/PageSection';
import PasswordStrengthMeter from '../components/PasswordStrengthMeter';
import SectionAction from '../components/SectionAction';
import SectionBody from '../components/SectionBody';
import SectionHeader from '../components/SectionHeader';
import SectionHeaderPrimary from '../components/SectionHeaderPrimary';
import SectionHeaderPrimarySubheading from '../components/SectionHeaderPrimarySubheading';
import SectionFooter from '../components/SectionFooter';
import Tooltip from '../components/Tooltip';
import Upload from '../components/Upload';

const METHODS_TO_BIND = ['handleFormChange', 'handleUploadSuccess'];

module.exports = class Setup extends React.Component {
  constructor() {
    super();

    this.state = {
      formData: {
        master_ips: null,
        agent_ips: null,
        ip_detect_script: null,
        ssh_username: null,
        ssh_port: null,
        ssh_key: null,
        username: null,
        password: '',
        zk_exhibitor_hosts: null,
        zk_exhibitor_port: null,
        upstream_dns_servers: null
      },
      isComplete: false,
      passwordFieldType: 'password'
    };

    METHODS_TO_BIND.forEach((method) => {
      this[method] = this[method].bind(this);
    });
  }

  getDeploymentSettingsFormDefinition() {
    return [
      [
        {
          fieldType: 'textarea',
          name: 'master_ips',
          placeholder: 'Please provide 1, 3, or 5 IPv4 addresses.',
          showLabel: (
            <FormLabel>
              <FormLabelContent position="left">
                Master IP Address(es) <Tooltip content="I'm a tooltip!" />
              </FormLabelContent>
              <FormLabelContent position="right">
                <Upload displayText="Upload .csv"
                  onUploadFinish={this.handleUploadSuccess('master_ips')} />
              </FormLabelContent>
            </FormLabel>
          ),
          value: this.state.formData.master_ips
        },
        {
          fieldType: 'textarea',
          name: 'agent_ips',
          placeholder: 'Please provide 1 to n IPv4 addresses to serve as your' +
            ' datacenter\'s Agents.',
          showLabel: (
            <FormLabel>
              <FormLabelContent>
                Agent IP Address(es) <Tooltip content="I'm a tooltip!" />
              </FormLabelContent>
              <FormLabelContent position="right">
                <Upload displayText="Upload .csv"
                  onUploadFinish={this.handleUploadSuccess('agent_ips')} />
              </FormLabelContent>
            </FormLabel>
          ),
          value: this.state.formData.agent_ips
        }
      ],
      [
        {
          fieldType: 'text',
          name: 'ssh_username',
          placeholder: 'e.g. root',
          showLabel: 'SSH Username',
          value: this.state.formData.ssh_username
        },
        {
          fieldType: 'text',
          name: 'ssh_port',
          showLabel: 'SSH Listening Port',
          value: '22',
          value: this.state.formData.ssh_port
        }
      ],
      {
        fieldType: 'text',
        name: 'ssh_key',
        showLabel: 'SSH Key',
        value: this.state.formData.ssh_key
      }
    ];
  }

  getEnvironmentSettingsFormDefinition() {
    return [
      [
        {
          fieldType: 'text',
          name: 'username',
          placeholder: 'e.g. root',
          showLabel: 'Username',
          value: this.state.formData.username
        },
        {
          fieldType: this.state.passwordFieldType,
          name: 'password',
          renderer: (inputField) => {
            return (
              <div className="password-strength-wrapper">
                {inputField}
                <PasswordStrengthMeter password={this.state.formData.password}/>
              </div>
            );
          },
          showLabel: 'Password',
          value: this.state.formData.password
        },
        {
          fieldType: 'checkbox',
          name: 'reveal_password',
          showLabel: <p>&nbsp;</p>,
          value: [
            {
              name: 'reveal_password_checkbox',
              label: 'Reveal Password'
            }
          ]
        }
      ],
      [
        {
          fieldType: 'textarea',
          name: 'zk_exhibitor_hosts',
          placeholder: 'Please provide 1, 3, or 5 IPv4 addresses.',
          showLabel: 'Bootstrapping Zookeeper IP Address(es)',
          value: this.state.formData.zk_exhibitor_hosts
        },
        {
          fieldType: 'text',
          name: 'zk_exhibitor_port',
          showLabel: 'Bootstrapping Zookeeper Port',
          value: this.state.formData.zk_exhibitor_port
        }
      ],
      {
        fieldType: 'text',
        name: 'upstream_dns_servers',
        showLabel: 'Upstream DNS Servers',
        value: this.state.formData.upstream_dns_servers
      }
    ];
  }

  handleFormChange(formData) {
    let newFormData = _.extend({}, this.state.formData, formData);

    let passwordFieldType = this.state.passwordFieldType;

    if (formData.reveal_password && formData.reveal_password[0].checked) {
      passwordFieldType = 'text';
    } else if (formData.reveal_password && !formData.reveal_password[0].checked) {
      passwordFieldType = 'password';
    }

    this.setState({formData: newFormData, passwordFieldType});
  }

  handleUploadSuccess(destination) {
    return (fileContents) => {
      let formData = _.extend({}, this.state.formData, {
        [destination]: fileContents
      });

      this.setState({formData});
    }
  }

  render() {
    return (
      <Page hasNavigationBar={true} size="large">
        <PageContent>
          <PageSection>
            <SectionHeader>
              <SectionHeaderPrimary align="left">
                Deployment Settings
                <SectionHeaderPrimarySubheading>
                  Enter the IP Addresses where you'd like the DCOS to be deployed,
                  and the SSH settings for the deployment.
                </SectionHeaderPrimarySubheading>
              </SectionHeaderPrimary>
            </SectionHeader>
            <SectionBody>
              <Form definition={this.getDeploymentSettingsFormDefinition()}
                onChange={this.handleFormChange} />
            </SectionBody>
          </PageSection>
          <PageSection>
            <SectionHeader>
              <SectionHeaderPrimary align="left">
                DCOS Environment Settings
                <SectionHeaderPrimarySubheading>
                  Enter the admin information for the primary DCOS user. This user
                  will be able to manage and add other users.
                </SectionHeaderPrimarySubheading>
              </SectionHeaderPrimary>
            </SectionHeader>
            <SectionBody>
              <Form definition={this.getEnvironmentSettingsFormDefinition()}
                onChange={this.handleFormChange} />
            </SectionBody>
          </PageSection>
          <PageSection>
            <SectionFooter>
              <SectionAction enabled={true} linkTo="/pre-flight"
                onClick={this.handleSubmitClick} type="primary">
                Run Pre-Flight
              </SectionAction>
            </SectionFooter>
          </PageSection>
        </PageContent>
      </Page>
    );
  }
}
