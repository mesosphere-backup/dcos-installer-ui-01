import _ from 'lodash';
import {Dropdown, Form} from 'reactjs-components';
import mixin from 'reactjs-mixin';
/* eslint-disable no-unused-vars */
import React from 'react';
/* eslint-enable no-unused-vars */
import ReactDOM from 'react-dom';
import {StoreMixin} from 'mesosphere-shared-reactjs';

import Config from '../config/Config';
import ConfigActions from '../events/ConfigActions';
import ConfigFormFields from '../constants/ConfigFormFields';
import ConfigFormFieldsRequiringInput from
  '../constants/ConfigFormFieldsRequiringInput';
import ErrorAlert from '../components/ErrorAlert';
import FormLabel from '../components/FormLabel';
import FormLabelContent from '../components/FormLabelContent';
import InstallerStore from '../stores/InstallerStore';
import IPDetectScripts from '../constants/IPDetectScripts';
import Page from '../components/Page';
import PageContent from '../components/PageContent';
import PageSection from '../components/PageSection';
import PasswordStrengthMeter from '../components/PasswordStrengthMeter';
import PreFlightStore from '../stores/PreFlightStore';
import SectionAction from '../components/SectionAction';
import SectionBody from '../components/SectionBody';
import SectionHeader from '../components/SectionHeader';
import SectionHeaderPrimary from '../components/SectionHeaderPrimary';
import SectionHeaderPrimarySubheading from '../components/SectionHeaderPrimarySubheading';
import SectionFooter from '../components/SectionFooter';
import SetupStore from '../stores/SetupStore';
import SetupUtil from '../utils/SetupUtil';
import Tooltip from '../components/Tooltip';
import Upload from '../components/Upload';

const PUBLIC_HOSTNAME_VALIDATION = /([0-9\.]+)|https?:\/\//;
const METHODS_TO_BIND = [
  'getCurrentConfig',
  'getErrors',
  'getUploadHandler',
  'getValidationFn',
  'handleFormChange',
  'handleIPDetectSelection',
  'handleSubmitClick',
  'isFormReady',
  'isLastFormField',
  'submitFormData',
  'savePublicURL'
];

class Setup extends mixin(StoreMixin) {
  constructor() {
    super();

    this.state = {
      buttonText: 'Run Pre-Flight',
      errorAlert: null,
      formData: {
        master_list: null,
        agent_list: null,
        ip_detect_script: null,
        public_ip_address: global.localStorage.getItem('publicHostname'),
        ssh_user: null,
        ssh_port: null,
        ssh_key: null,
        superuser_username: null,
        superuser_password_hash: '',
        zk_exhibitor_hosts: null,
        zk_exhibitor_port: 2181
      },
      initialFormData: {
        master_list: null,
        agent_list: null,
        ip_detect_script: null,
        ssh_user: null,
        ssh_port: null,
        ssh_key: null,
        superuser_username: null,
        superuser_password_hash: '',
        zk_exhibitor_hosts: null,
        zk_exhibitor_port: null
      },
      localValidationErrors: {},
      passwordFieldType: 'password'
    };

    this.store_listeners = [
      {
        name: 'setup',
        events: [
          'configFormCompletionChange',
          'configStatusChangeError',
          'configStatusChangeSuccess',
          'configUpdateError',
          'configUpdateSuccess',
          'currentConfigChangeSuccess'
        ]
      },
      {
        name: 'preFlight',
        events: ['beginSuccess', 'beginError']
      }
    ];

    METHODS_TO_BIND.forEach((method) => {
      this[method] = this[method].bind(this);
    });
  }

  componentWillMount() {
    this.getCurrentConfig();

    this.submitFormData = _.throttle(
      this.submitFormData, Config.apiRequestThrottle
    );
  }

  componentDidMount() {
    super.componentDidMount();
    SetupStore.fetchConfig();

    let clickHandler = null;
    let continueButtonEnabled = this.isFormReady();

    if (continueButtonEnabled) {
      clickHandler = this.handleSubmitClick;
    }

    InstallerStore.setNextStep({
      clickHandler,
      enabled: continueButtonEnabled,
      label: 'Run Pre-Flight',
      link: null,
      visible: true
    });
  }

  clearLocalValidationItem(key) {
    let localValidationErrors = this.state.localValidationErrors;

    if (localValidationErrors[key] != null) {
      delete localValidationErrors[key];
      this.setState({localValidationErrors});
    }
  }

  onSetupStoreConfigFormCompletionChange() {
    if (this.isFormReady()) {
      InstallerStore.setNextStep({
        clickHandler: this.handleSubmitClick,
        enabled: true,
        link: null
      });
    } else {
      InstallerStore.setNextStep({
        clickHandler: null,
        enabled: false,
        link: null
      });
    }
    this.forceUpdate();
  }

  onSetupStoreCurrentConfigChangeSuccess() {
    this.getCurrentConfig();
  }

  onPreFlightStoreBeginSuccess() {
    this.setState({buttonText: 'Continuing to Pre-Flight'});
    this.context.router.push('/pre-flight');
  }

  onPreFlightStoreBeginError(data) {
    let error = data.errors || 'An unknown error occurred. Please check the command line for details.';
    this.setState({buttonText: 'Run Pre-Flight', errorAlert: error});
    this.refs.page.scrollToTop();
  }

  beginPreFlight() {
    PreFlightStore.beginStage();
  }

  getCurrentConfig() {
    let mergedData = this.getNewFormData(SetupStore.get('currentConfig'));
    let displayedConfig = {};

    Object.keys(mergedData).forEach((key) => {
      if (_.isArray(mergedData[key])) {
        displayedConfig[key] = SetupUtil.getStringFromHostsArray(mergedData[key]);
      } else if (_.isNumber(mergedData[key])) {
        displayedConfig[key] = mergedData[key].toString();
      } else {
        displayedConfig[key] = mergedData[key];
      }

      if (key === 'exhibitor_zk_hosts') {
        let {zkExhibitorHosts, zkExhibitorPort} =
          SetupUtil.getSeparatedZKHostData(mergedData[key]);

        displayedConfig.zk_exhibitor_hosts = zkExhibitorHosts;
        displayedConfig.zk_exhibitor_port = zkExhibitorPort;
      }

      if (key === 'superuser_password_hash') {
        displayedConfig.superuser_password_hash = '';
      }
    });

    this.setState({
      formData: displayedConfig,
      initialFormData: displayedConfig
    });
  }

  getErrorAlert() {
    if (this.state.errorAlert) {
      return <ErrorAlert content={this.state.errorAlert} />;
    }

    return null;
  }

  getErrors(key) {
    let error = null;
    let errors = SetupStore.get('displayedErrors');
    let localValidationErrors = this.state.localValidationErrors;

    if (((this.state.formData[key] == null || this.state.formData[key] === '')
      && (this.state.initialFormData[key] == null || this.state.initialFormData[key] === ''))
      || (errors == null && Object.keys(localValidationErrors).length === 0)) {
      return null;
    }

    if (key === 'zk_exhibitor_hosts') {
      key = 'exhibitor_zk_hosts';
    }

    if (localValidationErrors[key]) {
      error = localValidationErrors[key];
    } else if (errors[key]) {
      error = errors[key];
    }

    return error;
  }

  getFormDefinition() {
    return [
      [
        {
          fieldType: 'textarea',
          name: 'master_list',
          placeholder: 'Specify a comma-separated list of 1, 3, or 5 ' +
            'private IPv4 addresses.',
          showLabel: (
            <FormLabel>
              <FormLabelContent position="left">
                Master Private IP List
                <Tooltip content={'The private IP addresses of the masters. ' +
                  'We recommend a minimum of 3 masters.'} width={200}
                  wrapText={true} />
              </FormLabelContent>
              <FormLabelContent position="right">
                <Upload displayText="Upload .csv" extensions=".csv"
                  onUploadFinish={this.getUploadHandler('master_list')} />
              </FormLabelContent>
            </FormLabel>
          ),
          showError: this.getErrors('master_list'),
          validationErrorText: this.getErrors('master_list'),
          validation: this.getValidationFn('master_list'),
          value: this.state.formData.master_list
        },
        {
          fieldType: 'textarea',
          name: 'agent_list',
          placeholder: 'Specify a comma-separated list of 1 to n ' +
            'private IPv4 addresses.',
          showLabel: (
            <FormLabel>
              <FormLabelContent>
                Agent Private IP List
                <Tooltip content={'The private IP addresses of the agents.'}
                  width={200} wrapText={true} />
              </FormLabelContent>
              <FormLabelContent position="right">
                <Upload displayText="Upload .csv" extensions=".csv"
                  onUploadFinish={this.getUploadHandler('agent_list')} />
              </FormLabelContent>
            </FormLabel>
          ),
          showError: this.getErrors('agent_list'),
          validationErrorText: this.getErrors('agent_list'),
          validation: this.getValidationFn('agent_list'),
          value: this.state.formData.agent_list
        }
      ],
      [
        {
          fieldType: 'text',
          name: 'public_ip_address',
          placeholder: 'Specify one IPv4 address.',
          showLabel: (
            <FormLabel>
              <FormLabelContent>
                Master Public IP
                <Tooltip content={'The public IP address of a master that is ' +
                  'accessible to the bootstrap node without a firewall.'}
                  width={200} wrapText={true} />
              </FormLabelContent>
            </FormLabel>
          ),
          showError: this.getErrors('public_ip_address'),
          validationErrorText: this.getErrors('public_ip_address'),
          validation: this.getValidationFn('public_ip_address'),
          value: this.state.formData.public_ip_address
        },
        {
          fieldType: 'text',
          name: 'ssh_user',
          placeholder: 'e.g. root, admin, core',
          showLabel: (
            <FormLabel>
              <FormLabelContent>
                SSH Username
                <Tooltip content={'The SSH username must be the same for all ' +
                  'target hosts. The only unacceptable username is "None".'}
                  width={200} wrapText={true} />
              </FormLabelContent>
            </FormLabel>
          ),
          showError: this.getErrors('ssh_user'),
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
          showError: this.getErrors('ssh_port', 'port'),
          validationErrorText: this.getErrors('ssh_port', 'port'),
          validation: this.getValidationFn('ssh_port', 'port'),
          value: this.state.formData.ssh_port
        }
      ],
      {
        fieldType: 'textarea',
        name: 'ssh_key',
        showLabel: (
          <FormLabel>
            <FormLabelContent>
              SSH Key
              <Tooltip content={'The SSH key must be the same on all target ' +
                'hosts.'} width={200} wrapText={true} />
            </FormLabelContent>
            <FormLabelContent position="right">
              <Upload displayText="Upload"
                onUploadFinish={this.getUploadHandler('ssh_key')} />
            </FormLabelContent>
          </FormLabel>
        ),
        showError: this.getErrors('ssh_key'),
        validationErrorText: this.getErrors('ssh_key'),
        validation: this.getValidationFn('ssh_key'),
        value: this.state.formData.ssh_key
      },
      <SectionHeader>
        <SectionHeaderPrimary align="left" layoutClassName="short short-top">
          DCOS Environment Settings
          <SectionHeaderPrimarySubheading>
            Choose a username and password for the DCOS administrator. This user
            will be able to manage and add users.
          </SectionHeaderPrimarySubheading>
        </SectionHeaderPrimary>
      </SectionHeader>,
      [
        {
          fieldType: 'text',
          name: 'superuser_username',
          placeholder: 'e.g. johnappleseed',
          showLabel: (
            <FormLabel>
              <FormLabelContent>
                Username
                <Tooltip content={'The only unacceptable username is "None".'}
                  width={200} wrapText={true} />
              </FormLabelContent>
            </FormLabel>
          ),
          showError: this.getErrors('superuser_username'),
          validationErrorText: this.getErrors('superuser_username'),
          validation: this.getValidationFn('superuser_username'),
          value: this.state.formData.superuser_username
        },
        {
          fieldType: this.state.passwordFieldType,
          name: 'superuser_password_hash',
          renderer: (inputField) => {
            return (
              <div className="password-strength-wrapper">
                {inputField}
                <PasswordStrengthMeter
                  password={this.state.formData.superuser_password_hash}/>
              </div>
            );
          },
          showLabel: 'Password',
          showError: this.getErrors('superuser_password_hash'),
          validationErrorText: this.getErrors('superuser_password_hash'),
          validation: this.getValidationFn('superuser_password_hash'),
          value: this.state.formData.superuser_password_hash
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
          placeholder: 'Specify a comma-separated list of 1 to 3 ' +
            'private IPv4 addresses.',
          showLabel: (
            <FormLabel>
              <FormLabelContent>
                ZooKeeper for Exhibitor Private IP
                <Tooltip content={
                    <span>
                      Exhibitor uses this Zookeeper cluster to orchestrate its
                      configuration and to recover the master hosts if they
                      fail. The Zookeeper cluster should be separate from your
                      target cluster to enable disaster recovery. If HA is
                      critical, specify three hosts. <a
                        href="http://zookeeper.apache.org/doc/r3.1.2/zookeeperAdmin.html"
                        target="_blank">
                      Learn more</a>.
                    </span>
                  }
                  width={300} wrapText={true} />
              </FormLabelContent>
            </FormLabel>
          ),
          showError: this.getErrors('zk_exhibitor_hosts'),
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
                ZooKeeper for Exhibitor Port
                <Tooltip content={'We recommend leaving this set to the ' +
                  'default port, 2181.'} width={200} wrapText={true} />
              </FormLabelContent>
            </FormLabel>
          ),
          showError: this.getErrors('zk_exhibitor_port', 'port'),
          validation: this.getValidationFn('zk_exhibitor_port', 'port'),
          validationErrorText: this.getErrors('zk_exhibitor_port'),
          value: this.state.formData.zk_exhibitor_port
        }
      ],
      [
        {
          fieldType: 'textarea',
          name: 'resolvers',
          placeholder: 'Provide a single address or a comma-separated ' +
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
                        Learn more
                      </a>.
                    </span>
                  }
                  width={300} wrapText={true} />
              </FormLabelContent>
            </FormLabel>
          ),
          showError: this.getErrors('resolvers'),
          validation: this.getValidationFn('resolvers'),
          validationErrorText: this.getErrors('resolvers'),
          value: this.state.formData.resolvers
        },
        {
          fieldType: 'textarea',
          name: 'ip_detect_script',
          placeholder: 'IP Detect Script',
          showLabel: (
            <div>
              <FormLabel>
                <FormLabelContent position="left">
                  IP Detect Script
                  <Tooltip content={
                      <span>
                        Enter or upload a script that runs on each node in the
                        cluster and outputs the node’s local IP address. <a
                          href="https://docs.mesosphere.com/getting-started/installing/installing-enterprise-edition/#scrollNav-3"
                          target="_blank">
                          Learn more
                        </a>.
                      </span>
                    }
                    width={300} wrapText={true} />
                </FormLabelContent>
                <FormLabelContent position="right"
                  supplementalClassName="hidden">
                  <Upload displayText="Upload" ref="ipDetectUpload"
                    onUploadFinish={this.getUploadHandler('ip_detect_script')} />
                </FormLabelContent>
              </FormLabel>
              <Dropdown buttonClassName="button dropdown-toggle"
                dropdownMenuClassName="dropdown-menu"
                dropdownMenuListClassName="dropdown-menu-list"
                items={this.getIPDetectOptions()}
                onItemSelection={this.handleIPDetectSelection}
                initialID="dropdown-label"
                transition={false}
                wrapperClassName="dropdown ip-detect-dropdown"/>
            </div>
          ),
          showError: this.getErrors('ip_detect_script'),
          validation: this.getValidationFn('ip_detect_script'),
          validationErrorText: this.getErrors('ip_detect_script'),
          value: this.state.formData.ip_detect_script
        }
      ]
    ];
  }

  getIPDetectOptions() {
    return [
      {
        className: 'hidden',
        id: 'dropdown-label',
        html: 'Select an IP detect script'
      },
      {
        id: 'aws',
        html: 'Amazon Web Services Script'
      },
      {
        id: 'azure',
        html: 'Azure Script'
      },
      {
        id: 'gce',
        html: 'GCE Script'
      },
      {
        id: 'custom',
        html: 'Custom Script'
      }
    ];
  }

  getNewFormData(newFormData) {
    return _.extend({}, this.state.formData, newFormData);
  }

  getUploadHandler(destination) {
    return (fileContents) => {
      let formData = this.getNewFormData({[destination]: fileContents});

      this.submitFormData({[destination]: fileContents});
      this.setState({formData});
    }
  }

  getValidationFn(key, type) {
    return (fieldValue) => {
      this.clearLocalValidationItem(key);

      if ((this.state.formData[key] == null || this.state.formData[key] === '')
        && (this.state.initialFormData[key] == null || this.state.initialFormData[key] === '')) {
        return true;
      }

      if (type === 'port' && fieldValue != null && fieldValue !== '') {
        if (parseInt(fieldValue) > 65535) {
          let localValidationErrors = this.state.localValidationErrors;
          localValidationErrors[key] = 'Ports must be less than or equal to 65535.';
          this.setState({localValidationErrors});

          return false;
        }

        this.clearLocalValidationItem(key);
      } else if (key === 'public_ip_address' && fieldValue != null && fieldValue !== '') {
        if (PUBLIC_HOSTNAME_VALIDATION.test(fieldValue) || fieldValue === '' || fieldValue == null) {
          return true;
        }

        let localValidationErrors = this.state.localValidationErrors;
        localValidationErrors[key] = 'Enter a valid IP address.';
        this.setState({localValidationErrors});

        return false;
      } else if (key === 'public_ip_address' && (fieldValue == null || fieldValue === '')) {
        let newFormData = this.getNewFormData({public_ip_address: null});
        this.setState({formData: newFormData});
      }

      if (this.getErrors(key)) {
        return false;
      }

      return true;
    }
  }

  handleFormChange(formData, eventDetails) {
    let {eventType, fieldName, fieldValue} = eventDetails;

    if (eventType === 'blur' && fieldName === 'public_ip_address') {
      this.savePublicURL(fieldValue);
    }

    if (eventType === 'focus' || fieldValue === '' || fieldValue == null) {
      return;
    }

    if (this.state.localValidationErrors[fieldName] == null
      && (eventType === 'blur' || (eventType === 'change'
      && this.isLastFormField(fieldName))) && fieldName !== 'public_ip_address') {
      this.submitFormData({[fieldName]: fieldValue});
    }

    if (eventType === 'blur' && fieldName !== 'public_ip_address') {
      // Submit form data immediately on blur events.
      this.submitFormData.flush();
    }

    if (eventType === 'multipleChange' && fieldName === 'reveal_password') {
      let passwordFieldType = this.state.passwordFieldType;
      if (fieldValue.checked) {
        passwordFieldType = 'text';
      } else {
        passwordFieldType = 'password';
      }

      this.setState({passwordFieldType});
    }

    let newFormData = this.getNewFormData({[fieldName]: fieldValue});
    this.setState({formData: newFormData});

    if (this.isFormReady()) {
      InstallerStore.setNextStep({
        clickHandler: this.handleSubmitClick,
        enabled: true
      });
    } else {
      InstallerStore.setNextStep({
        clickHandler: null,
        enabled: false
      });
    }
  }

  handleIPDetectSelection(selection) {
    let {id} = selection;

    if (id === 'custom') {
      ReactDOM.findDOMNode(this.refs.ipDetectUpload.refs.uploadInput).click();
    } else {
      let formData = this.state.formData;
      formData['ip_detect_script'] = IPDetectScripts[id];

      this.submitFormData({'ip_detect_script': IPDetectScripts[id]});
      this.setState({formData});
    }
  }

  handleSubmitClick() {
    this.savePublicURL(this.state.formData.public_ip_address);
    this.setState({buttonText: 'Verifying Configuration...'});
    this.beginPreFlight();
  }

  isFormReady() {
    let emptyFormFields = false;

    ConfigFormFieldsRequiringInput.forEach((key) => {
      if (this.state.formData[key] === '' || this.state.formData[key] == null) {
        emptyFormFields = true;
      }
    });

    if (!PUBLIC_HOSTNAME_VALIDATION.test(this.state.formData.public_ip_address)) {
      return false;
    }

    let isFormReady = !emptyFormFields && SetupStore.get('completed');

    return isFormReady;
  }

  isLastFormField(fieldName) {
    let lastRemainingField = true;

    ConfigFormFields.forEach((key) => {
      if (key === 'ssh_key' || key === 'ip_detect_script' || key === 'ip_detect_path') {
        return;
      }

      if (key !== fieldName && (this.state.formData[key] === ''
        || this.state.formData[key] == null)) {
        lastRemainingField = false;
      }
    });

    return lastRemainingField;
  }

  savePublicURL(url) {
    if (url != null && url !== '' && !/^https?:\/\//.test(url)) {
      url = `http://${url}`;
    }

    global.localStorage.setItem('publicHostname', url);
  }

  submitFormData(formData) {
    let preparedData = SetupUtil.prepareDataForAPI(
      formData, this.state.formData
    );

    if (preparedData) {
      ConfigActions.updateConfig(preparedData);
    }
  }

  render() {
    return (
      <Page hasNavigationBar={true} size="large" pageName="setup" ref="page">
        <PageContent>
          <PageSection>
            <SectionBody>
              {this.getErrorAlert()}
              <SectionHeader>
                <SectionHeaderPrimary align="left">
                  Deployment Settings
                  <SectionHeaderPrimarySubheading>
                    Enter the IP addresses of your target hosts and their SSH
                    settings.
                  </SectionHeaderPrimarySubheading>
                </SectionHeaderPrimary>
              </SectionHeader>
              <Form definition={this.getFormDefinition()}
                onChange={this.handleFormChange} />
            </SectionBody>
          </PageSection>
          <PageSection>
            <SectionFooter>
              <SectionAction enabled={this.isFormReady()} linkTo="/pre-flight"
                onClick={this.handleSubmitClick} type="primary">
                {this.state.buttonText}
              </SectionAction>
            </SectionFooter>
          </PageSection>
        </PageContent>
      </Page>
    );
  }
}

Setup.contextTypes = {
  router: React.PropTypes.object
};

module.exports = Setup;
