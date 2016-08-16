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

const FIELD_TYPE_MAP = {
  'text': 'text',
  'text_area': 'textarea',
  'dropdown': 'select',
  'text_box': 'text'
};
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
  'savePublicURL',
  'toggleCollapsableConfigBlock'
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
      isAdvancedExpanded: false,
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
    let allErrors = SetupStore.get('errors');

    if (allErrors[key] != null) {
      return allErrors[key];
    }

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
    let configDefinition = SetupStore.get('configFields');
    let clusterType = SetupStore.get('clusterType');
    // TODO: Make the onprem key configurable.
    let uiGroup = configDefinition.ui_groups[clusterType];
    let fulfilledFields = [];

    let formDefinition = uiGroup.reduce((memo, group) => {
      // Add form group's title to the definition.
      memo.push(this.getFormGroupTitle(group));

      // Convert the backend's group definition to the form's definition.
      let {groupRows, groupFieldKeys} = this.getFormGroupRows(
        group.rows,
        configDefinition
      );

      // Keep track of the fields defined in the UI groups.
      fulfilledFields = fulfilledFields.concat(groupFieldKeys);

      // Add the group's form rows to the definition.
      return memo.concat(groupRows);
    }, []);

    // Check for additional fields that were not defined in ui_groups.
    let additionalFormFields = Object.keys(configDefinition)
      .filter((formField) => {
        return formField !== 'ui_groups' && !fulfilledFields.includes(formField);
      })
      .reduce((memo, formField) => {
        if (memo.length === 0) {
          memo.push(this.getFormGroupTitle({title: 'Advanced Configuration', collapsable: true}));
        }

        if (this.state.isAdvancedExpanded) {
          memo = memo.concat(
            this.getFormColumns(
              [configDefinition[formField]],
              configDefinition,
              formField
            ).formColumns
          );
        }

        return memo;
      }, []);

    return formDefinition.concat(additionalFormFields);
    // return Hooks.applyFilter('FormDefinition', formDefinition);
  }

  getFieldType(fieldKey, fieldDefinition, fullFormDefinition) {
    let fieldType = 'text';
    let fieldData = fullFormDefinition[fieldKey];

    if (fieldData && fieldData.field_type) {
      fieldType = FIELD_TYPE_MAP[fieldData.field_type];
    }

    if (fieldType === 'text' && fieldDefinition.hidden === true) {
      fieldType = 'password';
    }

    return fieldType;
  }

  getFormRowClass(definition) {
    return classnames('row', {
      'row-inline-form-elements': definition.formRowType === 'inline'
    });
  }

  getFormColumns(columnsDefinition, fullFormDefinition, fieldName) {
    let columnKeys = [];

    let formColumns = columnsDefinition.map((fieldDefinition) => {
      let fieldKey = fieldDefinition.validation_param || fieldName;

      let fieldTooltip = null;
      let fieldUpload = null;

      if (fieldDefinition.help) {
        fieldTooltip = (
          <Tooltip content={fieldDefinition.help} width={300} wrapText={true} />
        );
      }

      let fieldLabel = (
        <FormLabelContent>
          {fieldDefinition.title || fieldDefinition.validation_param || fieldKey} {fieldTooltip}
        </FormLabelContent>
      );

      if (fieldDefinition.uploadable) {
        fieldUpload = (
          <FormLabelContent position="right">
            <Upload displayText="Upload"
              onUploadFinish={this.getUploadHandler(fieldKey)} />
          </FormLabelContent>
        );
      }

      columnKeys.push(fieldKey);

      let value = this.state.formData[fieldKey] || fieldDefinition.value;

      return {
        name: fieldKey,
        fieldType: this.getFieldType(fieldKey, fieldDefinition, fullFormDefinition),
        placeholder: fieldDefinition['place-holder'],
        showLabel: <FormLabel>{fieldLabel}{fieldUpload}</FormLabel>,
        showError: this.getErrors(fieldKey),
        validationErrorText: this.getErrors(fieldKey),
        validation: this.getValidationFn(fieldKey),
        value
      };
    });

    return {formColumns, columnKeys};
  }

  getFormGroupRows(rowsDefinition, fullFormDefinition) {
    let groupFieldKeys = [];
    let groupRows = [];

    if (rowsDefinition && rowsDefinition.length > 0) {
      groupRows = rowsDefinition.map((formRow) => {
        let {formColumns, columnKeys} = this.getFormColumns(formRow.cols, fullFormDefinition);

        groupFieldKeys = groupFieldKeys.concat(columnKeys);
        return formColumns;
      });
    }

    return {groupFieldKeys, groupRows};
  }

  getFormGroupTitle(group) {
    let arrow = null;
    let clickHandler = null;
    let {title} = group;

    if (!title) {
      return null;
    }

    if (group.collapsable) {
      arrow = (
        <span className={classnames('caret', {
          'is-expanded': this.state.isAdvancedExpanded
        })} />
      );
      clickHandler = this.toggleCollapsableConfigBlock;
    }

    return (
      <SectionHeader>
        <SectionHeaderPrimary
          align="left"
          layoutClassName={classnames('short-top flush-bottom', {
            'clickable': group.collapsable
          })}
          onClick={clickHandler}>
          {title}
          {arrow}
        </SectionHeaderPrimary>
      </SectionHeader>
    );
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

    if (eventType === 'blur') {
      ConfigActions.fetchConfigState();
    }

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

  toggleCollapsableConfigBlock() {
    this.setState({isAdvancedExpanded: !this.state.isAdvancedExpanded});
  }

  render() {
    let uiInstallerWarning = Hooks.applyFilter('uiInstallerWarning', (
      <p>
        Authentication and Telemetry are enabled by default. To change this, please reference the <a href={`${Config.documentationURI}/administration/opt-out`} target="_blank">{Config.productName} documentation</a>.
      </p>
    ));

    return (
      <Page hasNavigationBar={true} size="large" pageName="setup" ref="page">
        <PageContent>
          <PageSection>
            <SectionBody>
              {this.getErrorAlert()}
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
