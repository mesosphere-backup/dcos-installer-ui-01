import _ from 'lodash';
import {Form} from 'reactjs-components';
import mixin from 'reactjs-mixin';
/* eslint-disable no-unused-vars */
import React from 'react';
/* eslint-enable no-unused-vars */
import {StoreMixin} from 'mesosphere-shared-reactjs';

import Config from '../config/Config';
import ConfigActions from '../events/ConfigActions';
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
import SetupStore from '../stores/SetupStore';
import Tooltip from '../components/Tooltip';
import Upload from '../components/Upload';

const METHODS_TO_BIND = [
  'getErrors',
  'getValidationFn',
  'handleFormChange',
  'handleUploadSuccess',
  'isLastFormField',
  'submitFormData'
];

module.exports = class Setup extends mixin(StoreMixin) {
  constructor() {
    super();

    this.state = {
      errors: {},
      configType: {
        type: 'minimal',
        message: null
      },
      formStatus: {},
      formData: {
        master_list: null,
        agent_list: null,
        ip_detect_script: null,
        ssh_user: null,
        ssh_port: '22',
        ssh_key: null,
        username: null,
        password: '',
        zk_exhibitor_hosts: null,
        zk_exhibitor_port: '2181',
        resolvers: null
      },
      isComplete: false,
      passwordFieldType: 'password'
    };

    this.store_listeners = [
      {
        name: 'setup',
        events: [
          'configStatusChangeError',
          'configStatusChangeSuccess',
          'configTypeChangeError',
          'configTypeChangeSuccess',
          'configUpdateError',
          'configUpdateSuccess',
          'currentConfigChangeError',
          'currentConfigChangeSuccess'
        ]
      }
    ];

    METHODS_TO_BIND.forEach((method) => {
      this[method] = this[method].bind(this);
    });
  }

  componentWillMount() {
    this.submitFormData = _.throttle(
      this.submitFormData, Config.apiRequestThrottle
    );
  }

  onSetupStoreConfigUpdateError() {
    this.setState({errors: SetupStore.get('errors')});
  }

  onSetupStoreConfigUpdateSuccess() {
    this.setState({isComplete: true});
  }

  getErrors(key) {
    let error = null;

    if (this.state.errors[key]) {
      error = this.state.errors[key];
    }

    return error;
  }

  getFormDefinition() {
    return [
      [
        {
          fieldType: 'textarea',
          name: 'master_list',
          placeholder: 'Please provide a comma-separated list of 1, 3, or 5 ' +
            'IPv4 addresses.',
          showLabel: (
            <FormLabel>
              <FormLabelContent position="left">
                Master IP Address List
                <Tooltip content={'You can choose any target hosts as ' +
                  'masters and agents. We recommend 3 masters for production ' +
                  'environments, though 1 master is suitable for POC ' +
                  'applications.'} width={200} wrapText={true} />
              </FormLabelContent>
              <FormLabelContent position="right">
                <Upload displayText="Upload .csv"
                  onUploadFinish={this.handleUploadSuccess('master_list')} />
              </FormLabelContent>
            </FormLabel>
          ),
          validationErrorText: this.getErrors('master_list'),
          validation: this.getValidationFn('master_list'),
          value: this.state.formData.master_list
        },
        {
          fieldType: 'textarea',
          name: 'agent_list',
          placeholder: 'Please provide a comma-separated list of 1 to n ' +
            'IPv4 addresses.',
          showLabel: (
            <FormLabel>
              <FormLabelContent>
                Agent IP Address List
                <Tooltip content={'You can choose any target hosts as agents.'}
                  width={200} wrapText={true} />
              </FormLabelContent>
              <FormLabelContent position="right">
                <Upload displayText="Upload .csv"
                  onUploadFinish={this.handleUploadSuccess('agent_list')} />
              </FormLabelContent>
            </FormLabel>
          ),
          validationErrorText: this.getErrors('agent_list'),
          validation: this.getValidationFn('agent_list'),
          value: this.state.formData.agent_list
        }
      ],
      [
        {
          fieldType: 'text',
          name: 'ssh_user',
          placeholder: 'Examples: root, admin, core',
          showLabel: (
            <FormLabel>
              <FormLabelContent>
                SSH Username
                <Tooltip content={'The SSH username must be the same for all ' +
                  'target hosts. The only unacceptable username is None.'}
                  width={200} wrapText={true} />
              </FormLabelContent>
            </FormLabel>
          ),
          validationErrorText: this.getErrors('ssh_user'),
          validation: this.getValidationFn('ssh_user'),
          value: this.state.formData.ssh_user
        },
        {
          fieldType: 'text',
          name: 'ssh_port',
          showLabel: (
            <FormLabel>
              <FormLabelContent>
                SSH Listening Port
                <Tooltip content={'The SSH port must be the same on all ' +
                  'target hosts.'} width={200} wrapText={true} />
              </FormLabelContent>
            </FormLabel>
          ),
          validationErrorText: this.getErrors('ssh_port'),
          validation: this.getValidationFn('ssh_port'),
          value: this.state.formData.ssh_port
        }
      ],
      {
        fieldType: 'text',
        name: 'ssh_key',
        showLabel: (
          <FormLabel>
            <FormLabelContent>
              SSH Key
              <Tooltip content={'The SSH key must be the same on all target ' +
                'hosts.'} width={200} wrapText={true} />
            </FormLabelContent>
          </FormLabel>
        ),
        validationErrorText: this.getErrors('ssh_key'),
        validation: this.getValidationFn('ssh_key'),
        value: this.state.formData.ssh_key
      },
      <SectionHeaderPrimary align="left">
        DCOS Environment Settings
        <SectionHeaderPrimarySubheading>
          Choose a username and password for the DCOS administrator. This user
          will be able to manage and add other users.
        </SectionHeaderPrimarySubheading>
      </SectionHeaderPrimary>,
      [
        {
          fieldType: 'text',
          name: 'username',
          placeholder: 'For example, johnappleseed',
          showLabel: (
            <FormLabel>
              <FormLabelContent>
                Username
                <Tooltip content={'The only unacceptable username is "None".'}
                  width={200} wrapText={true} />
              </FormLabelContent>
            </FormLabel>
          ),
          validationErrorText: this.getErrors('username'),
          validation: this.getValidationFn('username'),
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
          validationErrorText: this.getErrors('password'),
          validation: this.getValidationFn('password'),
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
          placeholder: 'Please provide an IPv4 address or a comma-separated ' +
            'list of 3 addresses.',
          showLabel: (
            <FormLabel>
              <FormLabelContent>
                Bootstrapping Zookeeper IP Address(es)
                <Tooltip content={
                    <span>
                      Exhibitor uses this Zookeeper cluster to orchestrate its
                      configuration and to recover the master hosts if they
                      fail. The Zookeeper cluster should be separate from your
                      target cluster to enable disaster recovery. If HA is
                      critical, specify three hosts. <a
                        href="http://zookeeper.apache.org/doc/r3.1.2/zookeeperAdmin.html"
                        target="_blank">
                      Learn more about Zookeeper</a>.
                    </span>
                  }
                  width={300} wrapText={true} />
              </FormLabelContent>
            </FormLabel>
          ),
          validationErrorText: this.getErrors('zk_exhibitor_hosts'),
          validation: this.getValidationFn('zk_exhibitor_hosts'),
          value: this.state.formData.zk_exhibitor_hosts
        },
        {
          fieldType: 'text',
          name: 'zk_exhibitor_port',
          showLabel: (
            <FormLabel>
              <FormLabelContent>
                Bootstrapping Zookeeper Port
                <Tooltip content={'We recommend leaving this set to the ' +
                  'default port, 2181.'} width={200} wrapText={true} />
              </FormLabelContent>
            </FormLabel>
          ),
          validation: this.getValidationFn('zk_exhibitor_port'),
          validationErrorText: this.getErrors('zk_exhibitor_port'),
          value: this.state.formData.zk_exhibitor_port
        }
      ],
      {
        fieldType: 'textarea',
        name: 'resolvers',
        placeholder: 'Please provide a single address or a comma-separated ' +
          'list, e.g., 192.168.10.10, 10.0.0.1',
        showLabel: (
          <FormLabel>
            <FormLabelContent>
              Upstream DNS Servers
              <Tooltip content={
                  <span>
                    These can be DNS servers on your private network or on the
                    public internet, depending on your needs. Caution: If you set
                    this parameter incorrectly, you will have to reinstall
                    DCOS. <a
                      href="https://docs.mesosphere.com/administration/service-discovery/"
                      target="_blank">
                      Learn more about DNS and DCOS
                    </a>.
                  </span>
                }
                width={300} wrapText={true} />
            </FormLabelContent>
          </FormLabel>
        ),
        validation: this.getValidationFn('resolvers'),
        validationErrorText: this.getErrors('resolvers'),
        value: this.state.formData.resolvers
      }
    ];
  }

  getNewFormData(newFormData) {
    newFormData = this.stringifyArrays(newFormData);
    return _.extend({}, this.state.formData, newFormData);
  }

  getValidationFn(key) {
    let {state} = this;

    return function () {
      if (state.errors[key]) {
        return false;
      }
      return true;
    }
  }

  handleFormChange(formData, eventDetails) {
    let {eventType, fieldName} = eventDetails;

    if (eventType === 'focus') {
      return;
    }

    if (eventType === 'blur'
      || eventType === 'change' && this.isLastFormField(fieldName)) {
      let newFormData = this.getNewFormData(formData);

      this.submitFormData({[fieldName]: formData[fieldName]});
      this.setState({formData: newFormData});
    }

    if (eventType === 'blur') {
      // Submit form data immediately on blur events.
      this.submitFormData.flush();
    }

    if (eventType === 'change' && fieldName === 'reveal_password') {
      let passwordFieldType = this.state.passwordFieldType;

      if (formData.reveal_password[0].checked) {
        passwordFieldType = 'text';
      } else {
        passwordFieldType = 'password';
      }

      this.setState({passwordFieldType});
    }
  }

  handleUploadSuccess(destination) {
    return (fileContents) => {
      let formData = this.getNewFormData({
        [destination]: fileContents
      });

      this.setState({formData});
    }
  }

  isLastFormField(fieldName) {
    let lastRemainingField = false;

    Object.keys(this.state.formData).forEach((key) => {
      if (key !== fieldName && this.state.formData[key] !== ''
        && this.state.formData[key] != null) {
        lastRemainingField = true;
      }
    });

    // If errors exist, we don't want to send the form data on value change.
    if (lastRemainingField && Object.keys(this.state.errors).length) {
      lastRemainingField = false;
    }

    return lastRemainingField;
  }

  stringifyArrays(formData) {
    let stringifiedData = {};

    Object.keys(formData).forEach(function (key) {
      if (_.isArray(formData[key])) {
        stringifiedData[key] = formData[key].join(', ');
      } else {
        stringifiedData[key] = formData[key];
      }
    });

    return stringifiedData;
  }

  submitFormData(formData) {
    ConfigActions.updateConfig(this.unstringifyArrays(formData));
  }

  unstringifyArrays(formData) {
    let unstringifiedData = {};

    Object.keys(formData).forEach(function (key) {
      if (formData[key] != null) {
        if (key === 'master_list' || key === 'agent_list') {
          unstringifiedData[key] = formData[key].replace(/\s/g, '').split(',');
        } else {
          unstringifiedData[key] = formData[key];
        }
      }
    });

    return unstringifiedData;
  }

  render() {
    return (
      <Page hasNavigationBar={true} size="large" pageName="setup">
        <PageContent>
          <PageSection>
            <SectionHeader>
              <SectionHeaderPrimary align="left">
                Deployment Settings
                <SectionHeaderPrimarySubheading>
                  Enter the IP addresses of your target hosts and their SSH
                  settings.
                </SectionHeaderPrimarySubheading>
              </SectionHeaderPrimary>
            </SectionHeader>
            <SectionBody>
              <Form definition={this.getFormDefinition()}
                onChange={this.handleFormChange} />
            </SectionBody>
          </PageSection>
          <PageSection>
            <SectionFooter>
              <SectionAction enabled={this.state.isComplete} linkTo="/pre-flight"
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
