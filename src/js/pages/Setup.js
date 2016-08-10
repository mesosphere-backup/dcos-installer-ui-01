import _ from 'lodash';
import classnames from 'classnames';
import {Dropdown, Form} from 'reactjs-components';
import mixin from 'reactjs-mixin';
/* eslint-disable no-unused-vars */
import React from 'react';
/* eslint-enable no-unused-vars */
import ReactDOM from 'react-dom';
import {StoreMixin} from 'mesosphere-shared-reactjs';

import {HASHED_PASSWORD_CHANGE} from '../constants/EventTypes';

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
import PluginSDK from 'PluginSDK';
import PreFlightStore from '../stores/PreFlightStore';
import SectionAction from '../components/SectionAction';
import SectionBody from '../components/SectionBody';
import SectionHeader from '../components/SectionHeader';
import SectionHeaderPrimary from '../components/SectionHeaderPrimary';
import SectionFooter from '../components/SectionFooter';
import SetupFormConfirmation from '../components/SetupFormConfirmation';
import SetupStore from '../stores/SetupStore';
import SetupUtil from '../utils/SetupUtil';
import Tooltip from '../components/Tooltip';
import Upload from '../components/Upload';

let {Hooks} = PluginSDK;

const LOCALLY_VALIDATED_KEYS = [
  'master_list',
  'agent_list',
  'public_ip_address',
  'public_agent_list',
  'port'
];
const PUBLIC_HOSTNAME_VALIDATION = /([0-9\.]+)|https?:\/\//;
const METHODS_TO_BIND = [
  'getCurrentConfig',
  'getErrors',
  'getUploadHandler',
  'getValidationFn',
  'handleFormChange',
  'handleIPDetectSelection',
  'handleSubmitCancel',
  'handleSubmitClick',
  'handleSubmitConfirm',
  'isFormReady',
  'isLastFormField',
  'isPortValid',
  'isPublicIPValid',
  'submitFormData',
  'savePublicURL'
];

class Setup extends mixin(StoreMixin) {
  constructor() {
    super();

    let state = {
      buttonText: 'Run Pre-Flight',
      confirmModalOpen: false,
      errorAlert: null,
      formData: {
        master_list: null,
        agent_list: null,
        ip_detect_script: null,
        public_agent_list: null,
        public_ip_address: global.localStorage.getItem('publicHostname'),
        ssh_user: null,
        ssh_port: null,
        ssh_key: null,
        telemetry_enabled: true,
        oauth_enabled: true
      },
      initialFormData: {
        master_list: null,
        agent_list: null,
        public_agent_list: null,
        ip_detect_script: null,
        ssh_user: null,
        ssh_port: null,
        ssh_key: null
      },
      ipDetectSelectedOption: null,
      localValidationErrors: {},
      submitRequestPending: false
    };

    this.state = Hooks.applyFilter('state', state);

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

    Hooks.addAction('getErrors', this.getErrors.bind(this));
    Hooks.addAction('getValidationFn', this.getValidationFn.bind(this));
  }

  componentWillMount() {
    this.getCurrentConfig();

    this.submitFormData = _.throttle(
      this.submitFormData, Config.apiRequestThrottle
    );
  }

  componentDidMount() {
    PluginSDK.onDispatch((action) => {
      switch (action.type) {
        case HASHED_PASSWORD_CHANGE:
          this.forceUpdate();
          this.submitFormData({superuser_password_hash: action.hashedPassword});
          break;
      }
    });

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
    this.setState({
      buttonText: 'Continuing to Pre-Flight',
      confirmModalOpen: false,
      submitRequestPending: false
    });
    this.context.router.push('/pre-flight');
  }

  onPreFlightStoreBeginError(data) {
    let error = data.errors || 'An unknown error occurred. Please check the command line for details.';
    this.setState({
      buttonText: 'Run Pre-Flight',
      errorAlert: error,
      confirmModalOpen: false,
      submitRequestPending: false
    });
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
    });

    displayedConfig = Hooks.applyFilter(
      'currentConfig', displayedConfig, mergedData
    );

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
    let errors = SetupStore.get('displayedErrors') || {};
    let localValidationErrors = this.state.localValidationErrors;

    let isFieldCurrentlyEmpty = this.state.formData[key] == null || this.state.formData[key] === '';
    let isFieldInitiallyEmpty = this.state.initialFormData[key] == null || this.state.initialFormData[key] === '';
    let isErrorsEmpty = errors == null && Object.keys(localValidationErrors).length === 0;

    let shouldSuppressErrors = ((isFieldCurrentlyEmpty && isFieldInitiallyEmpty) || isErrorsEmpty) && localValidationErrors[key] == null;

    if (shouldSuppressErrors) {
      return null;
    }

    if (localValidationErrors[key]) {
      error = localValidationErrors[key];
    } else if (errors[key]) {
      error = errors[key];
    }

    return error;
  }

  getFormDefinition() {
    let formDefintion = [
      [
        {
          fieldType: 'text',
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
                <Tooltip content={'CSVs must be newline delimited.'}
                  width={200} wrapText={true}>
                  <Upload displayText="Upload .csv" extensions=".csv"
                    onUploadFinish={this.getUploadHandler('master_list', 'csv')} />
                </Tooltip>
              </FormLabelContent>
            </FormLabel>
          ),
          showError: this.getErrors('master_list'),
          validationErrorText: this.getErrors('master_list'),
          validation: this.getValidationFn('master_list'),
          value: this.state.formData.master_list
        }
      ],
      [
        {
          fieldType: 'text',
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
                <Tooltip content={'CSVs must be newline delimited.'}
                  width={200} wrapText={true}>
                  <Upload displayText="Upload .csv" extensions=".csv"
                    onUploadFinish={this.getUploadHandler('agent_list', 'csv')} />
                </Tooltip>
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
          fieldType: 'textarea',
          name: 'public_agent_list',
          placeholder: 'Specify a comma-separated list of 1 to n ' +
            'public IPv4 addresses.',
          showLabel: (
            <FormLabel>
              <FormLabelContent>
                Agent Public IP List
                <Tooltip content="Specify public agent nodes to run DC/OS apps
                  and services in a publicly accessible network." width={200}
                  wrapText={true} />
              </FormLabelContent>
              <FormLabelContent position="right">
                <Tooltip content={'CSVs must be newline delimited.'}
                  width={200} wrapText={true}>
                  <Upload displayText="Upload .csv" extensions=".csv"
                    onUploadFinish={this.getUploadHandler('public_agent_list', 'csv')} />
                </Tooltip>
              </FormLabelContent>
            </FormLabel>
          ),
          showError: this.getErrors('public_agent_list'),
          validationErrorText: this.getErrors('public_agent_list'),
          validation: this.getValidationFn('public_agent_list'),
          value: this.state.formData.public_agent_list
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
          showError: this.getErrors('ssh_port'),
          validationErrorText: this.getErrors('ssh_port'),
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
              Private SSH Key
              <Tooltip content={'Enter the private SSH key.'}
                width={200} wrapText={true} />
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
        <SectionHeaderPrimary align="left" layoutClassName="short-top flush-bottom">
          {Config.productName} Environment Settings
        </SectionHeaderPrimary>
      </SectionHeader>,
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
                      {Config.productName}. <a
                        href={`${Config.documentationURI}/administration/service-discovery/`}
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
                          href={`${Config.documentationURI}/administration/installing/custom/gui/`}
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
                persistentID={this.state.ipDetectSelectedOption}
                transition={false}
                wrapperClassName="dropdown ip-detect-dropdown"/>
            </div>
          ),
          showError: this.getErrors('ip_detect_script'),
          validation: this.getValidationFn('ip_detect_script'),
          validationErrorText: this.getErrors('ip_detect_script'),
          value: this.state.formData.ip_detect_script
        }
      ],
      {
        fieldType: 'checkboxMultiple',
        name: 'cluster_configuration_options',
        formRowType: 'inline',
        value: [
          {
            name: 'telemetry_enabled',
            label: <span>
                Send Anonymous Telemetry
                <Tooltip content="Indicate whether you want to report anonymous
                  usage data." width={300} wrapText={true} />
              </span>,
            checked: this.state.formData.telemetry_enabled
          },
          {
            name: 'oauth_enabled',
            label: <span>
                Enable Authentication
                <Tooltip content="Indicate whether you want to enable
                  authentication for your cluster." width={300}
                  wrapText={true} />
              </span>,
            checked: this.state.formData.oauth_enabled
          }
        ]
      }
    ];

    return Hooks.applyFilter('FormDefinition', formDefintion);
  }

  getFormRowClass(definition) {
    return classnames('row', {
      'row-inline-form-elements': definition.formRowType === 'inline'
    });
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
        html: 'Amazon Web Services'
      },
      {
        id: 'azure',
        html: 'Azure'
      },
      {
        id: 'gce',
        html: 'Google Compute Engine'
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

  getUploadHandler(destinationKey, fileType) {
    let localValidationErrors = this.state.localValidationErrors;

    return (fileContents) => {
      let fileContentsError = false;

      if (fileType === 'csv') {
        fileContentsError = fileContents.some(function (csvEntry) {
          return csvEntry.indexOf(',') > -1;
        });

        if (!fileContentsError) {
          fileContents = fileContents.join(', ');
        }
      }

      if (fileContentsError) {
        fileContents = this.state.formData[destinationKey];
        localValidationErrors[destinationKey] = 'CSVs must not contain commas.';
      } else {
        delete localValidationErrors[destinationKey];
        this.submitFormData({[destinationKey]: fileContents});
      }

      let formData = this.getNewFormData({[destinationKey]: fileContents});
      this.setState({
        formData,
        ipDetectSelectedOption: 'custom',
        localValidationErrors
      });
    }
  }

  getValidationFn(key, type) {
    return (fieldValue) => {
      let isValueEmpty = fieldValue == null || fieldValue === '';
      let isValidatedLocally = this.isKeyValidatedLocally(key);

      if (isValidatedLocally && !isValueEmpty) {
        this.clearLocalValidationItem(key);
      }

      if (type === 'port' && !isValueEmpty) {
        return this.isPortValid(fieldValue, key);
      }

      if (key === 'public_ip_address' && !isValueEmpty) {
        return this.isPublicIPValid(fieldValue);
      }

      if (key === 'public_ip_address' && isValueEmpty) {
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

    if (eventType === 'multipleChange' && fieldName === 'cluster_configuration_options') {
      this.submitFormData({[fieldName]: fieldValue});
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

    let newFormData = this.getNewFormData({[fieldName]: fieldValue});
    let newState = _.extend({}, this.state, {formData: newFormData});

    this.setState(Hooks.applyFilter(
      'handleFormChange', newState, eventDetails
    ));

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
    let state = {ipDetectSelectedOption: id};

    if (id === 'custom') {
      state.ipDetectSelectedOption = this.getIPDetectOptions()[0].id;
      ReactDOM.findDOMNode(this.refs.ipDetectUpload.refs.uploadInput).click();
    } else {
      state.formData = this.state.formData;
      state.formData['ip_detect_script'] = IPDetectScripts[id];

      this.submitFormData({'ip_detect_script': IPDetectScripts[id]});
    }

    this.setState(state);
  }

  handleSubmitClick() {
    this.setState({confirmModalOpen: true});
  }

  handleSubmitCancel() {
    this.setState({confirmModalOpen: false, submitRequestPending: false});
  }

  handleSubmitConfirm() {
    this.savePublicURL(this.state.formData.public_ip_address);
    this.setState({
      buttonText: 'Verifying Configuration...',
      submitRequestPending: true
    });
    this.beginPreFlight();
  }

  isFormReady() {
    let emptyFormFields = false;

    if (Object.keys(this.state.localValidationErrors).length !== 0) {
      return false;
    }

    ConfigFormFieldsRequiringInput.forEach((key) => {
      if (this.state.formData[key] === '' || this.state.formData[key] == null) {
        emptyFormFields = true;
      }
    });

    if (!PUBLIC_HOSTNAME_VALIDATION.test(this.state.formData.public_ip_address)) {
      return false;
    }

    // Allow plugins to prevent the form from visually conveying that it's
    // ready for submission.
    return Hooks.applyFilter(
      'isFormReadyToSubmit',
      !emptyFormFields && SetupStore.get('completed'),
      this.state.formData
    );
  }

  isKeyValidatedLocally(key) {
    return LOCALLY_VALIDATED_KEYS.indexOf(key) > -1;
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

  isPortValid(port, key) {
    if (parseInt(port) > 65535) {
      let localValidationErrors = this.state.localValidationErrors;
      localValidationErrors[key] = 'Ports must be less than or equal to 65535.';
      this.setState({localValidationErrors});

      return false;
    }

    return true;
  }

  isPublicIPValid(publicIP) {
    if (PUBLIC_HOSTNAME_VALIDATION.test(publicIP)) {
      return true;
    }

    let localValidationErrors = this.state.localValidationErrors;
    localValidationErrors.public_ip_address = 'Enter a valid IP address.';
    this.setState({localValidationErrors});

    return false;
  }

  savePublicURL(url) {
    if (url != null && url !== '' && !/^https?:\/\//.test(url)) {
      url = `http://${url}`;
    }

    global.localStorage.setItem('publicHostname', url);
  }

  submitFormData(formData) {
    // Let plugins decide whether or not we should submit the data.
    let shouldSubmitFormData = Hooks.applyFilter(
      'shouldSubmitForm',
      true,
      formData
    );

    if (shouldSubmitFormData) {
      let preparedData = SetupUtil.prepareDataForAPI(formData);

      if (preparedData) {
        ConfigActions.updateConfig(preparedData);
      }
    }
  }

  render() {
    let uiInstallerWarning = Hooks.applyFilter('uiInstallerWarning', (
      <p>
        Authentication and Telemetry are enabled by default. To change this, please reference the <a href={`${Config.documentationURI}/administration/opt-out`} target="_blank">DCOS documentation</a>.
      </p>
    ));

    return (
      <Page hasNavigationBar={true} size="large" pageName="setup" ref="page">
        <PageContent>
          <PageSection>
            <SectionBody>
              {this.getErrorAlert()}
              <SectionHeader>
                <SectionHeaderPrimary align="left" layoutClassName="flush">
                  Deployment Settings
                </SectionHeaderPrimary>
              </SectionHeader>
              <SetupFormConfirmation open={this.state.confirmModalOpen}
                handleButtonCancel={this.handleSubmitCancel}
                handleButtonConfirm={this.handleSubmitConfirm}
                pendingRequest={this.state.submitRequestPending} />
              <Form definition={this.getFormDefinition()} formRowClass={this.getFormRowClass}
                onChange={this.handleFormChange} />
            </SectionBody>
          </PageSection>
          <PageSection>
            <SectionFooter>
              {uiInstallerWarning}
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
