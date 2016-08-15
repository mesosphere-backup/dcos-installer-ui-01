import _ from 'lodash';
import {GetSetMixin, Store} from 'mesosphere-shared-reactjs';

import ActionTypes from '../constants/ActionTypes';
import AppDispatcher from '../events/AppDispatcher';
import ConfigActions from '../events/ConfigActions';
import ConfigFormFields from '../constants/ConfigFormFields';
import EventTypes from '../constants/EventTypes';

let SetupStore = Store.createStore({
  storeID: 'setup',

  mixins: [GetSetMixin],

  init: function () {
    this.set({
      completed: false,
      configFields: {},
      configType: {
        type: null,
        message: null
      },
      currentConfig: {},
      currentConfigError: null,
      displayedErrors: {},
      errors: {},
      initialLoad: true
    });

    this.fetchConfig();
    this.fetchConfigType();
  },

  fetchConfig: ConfigActions.fetchConfig,

  fetchConfigState: ConfigActions.fetchConfigState,

  fetchConfigType: ConfigActions.fetchConfigType,

  setInstallType: ConfigActions.setInstallType,

  updateConfig: ConfigActions.updateConfig,

  addChangeListener: function (eventName, callback) {
    this.on(eventName, callback);
  },

  removeChangeListener: function (eventName, callback) {
    this.removeListener(eventName, callback);
  },

  checkFormCompletion() {
    let errors = this.get('errors') || {};

    this.set({completed: true});

    ConfigFormFields.forEach((key) => {
      if (errors[key]) {
        this.set({completed: false});
      }
    });

    this.emit(EventTypes.CONFIGURE_FORM_COMPLETION_CHANGE);
  },

  handleConfigureChangeSuccess: function (data) {
    let currentConfig = _.pick(data, ConfigFormFields);

    this.set({currentConfig});
    this.emit(EventTypes.CONFIGURE_CHANGE_SUCCESS);

    this.fetchConfigState();
  },

  handleConfigureChangeError: function (data) {
    this.set({currentConfigError: data});
    this.emit(EventTypes.CONFIGURE_CHANGE_ERROR);
  },

  handleConfigureStatusChangeError: function (data) {
    let errors = _.extend({}, this.get('errors'), data.response);
    let displayedErrors = _.extend({}, errors);

    let currentConfig = this.get('currentConfig');

    Object.keys(displayedErrors).forEach((key) => {
      if (this.isValueEmpty(currentConfig[key])) {
        delete displayedErrors[key];
      }
    });

    this.set({displayedErrors});
    this.set({errors});
    this.emit(EventTypes.CONFIGURE_STATUS_CHANGE_ERROR);
  },

  handleConfigureTypeError: function () {
    this.emit(EventTypes.CONFIGURE_TYPE_CHANGE_ERROR);
  },

  handleConfigureUpdateFieldError: function (data) {
    let errors = _.extend({}, this.get('errors'), data.response);
    let displayedErrors = _.extend(
      {}, this.get('displayedErrors'), data.response
    );

    this.set({displayedErrors});
    this.set({errors});
    this.emit(EventTypes.CONFIGURE_UPDATE_FIELD_ERROR);
  },

  handleConfigureTypeResponse: function (data) {
    this.set({configType: data});
    this.emit(EventTypes.CONFIGURE_TYPE_CHANGE_SUCCESS);
  },

  handleConfigureStatusSuccess: function () {
    this.set({displayedErrors: {}});
    this.set({errors: {}});
    this.emit(EventTypes.CONFIGURE_STATUS_CHANGE_SUCCESS);
  },

  handleConfigureUpdateFieldSuccess: function (data) {
    let displayedErrors = this.get('displayedErrors');
    let errors = this.get('errors');

    Object.keys(data).forEach((key) => {
      if (key === 'ip_detect_script') {
        // Clear the error on both ip_detect_script and ip_detect_path
        delete(displayedErrors['ip_detect_path']);
        delete(errors['ip_detect_path']);
      } else if (key === 'ssh_key') {
        // Clear the error on both ssh_key and ssh_key_path
        delete(displayedErrors['ssh_key_path']);
        delete(errors['ssh_key_path']);
      }

      delete(displayedErrors[key]);
      delete(errors[key]);
    });

    this.set({displayedErrors});
    this.set({errors});
    this.emit(EventTypes.CONFIGURE_UPDATE_FIELD_SUCCESS);
  },

  handleOngoingConfigureChangeRequest: function () {
    // We could do something here if we wanted.
  },

  handleOngoingConfigureStatusRequest: function () {
    // We could do something here if we wanted.
  },

  handleOngoingConfigureTypeChangeRequest: function () {
    // We could do something here if we wanted.
  },

  handleOngoingConfigureUpdateFieldRequest: function () {
    // We could do something here if we wanted.
  },

  handleSetInstallTypeError(error) {
    this.emit(EventTypes.SET_INSTALL_TYPE_ERROR, error);
  },

  handleSetInstallTypeSuccess(configFields) {
    this.set({configFields});
    this.emit(EventTypes.SET_INSTALL_TYPE_SUCCESS);
  },

  isValueEmpty(values) {
    let isEmptyValue = false;

    if (_.isArray(values)) {
      let isEmptyArray = true;
      values.forEach(function (value) {
        if (value != null) {
          isEmptyArray = false;
        }
      });
      isEmptyValue = isEmptyArray;
    } else {
      isEmptyValue = values === '' || values == null;
    }

    return isEmptyValue;
  },

  dispatcherIndex: AppDispatcher.register(function (payload) {
    let {action} = payload;

    switch (action.type) {
      case ActionTypes.CONFIGURE_CHANGE_ERROR:
        SetupStore.handleConfigureChangeError(action.data);
        SetupStore.checkFormCompletion();
        break;
      case ActionTypes.CONFIGURE_CHANGE_SUCCESS:
        SetupStore.handleConfigureChangeSuccess(action.data);
        SetupStore.checkFormCompletion();
        break;
      case ActionTypes.CONFIGURE_CHANGE_ONGOING:
        SetupStore.handleOngoingConfigureChangeRequest();
        break;
      case ActionTypes.CONFIGURE_STATUS_CHANGE_ERROR:
        SetupStore.handleConfigureStatusChangeError(action.data);
        SetupStore.checkFormCompletion();
        break;
      case ActionTypes.CONFIGURE_STATUS_CHANGE_SUCCESS:
        SetupStore.handleConfigureStatusSuccess(action.data);
        SetupStore.checkFormCompletion();
        break;
      case ActionTypes.CONFIGURE_STATUS_CHANGE_ONGOING:
        SetupStore.handleOngoingConfigureStatusRequest();
        break;
      case ActionTypes.CONFIGURE_TYPE_CHANGE_ERROR:
        SetupStore.handleConfigureTypeError(action.data);
        break;
      case ActionTypes.CONFIGURE_TYPE_CHANGE_SUCCESS:
        SetupStore.handleConfigureTypeResponse(action.data);
        break;
      case ActionTypes.CONFIGURE_TYPE_CHANGE_ONGOING:
        SetupStore.handleOngoingConfigureTypeChangeRequest();
        break;
      case ActionTypes.CONFIGURE_UPDATE_FIELD_ERROR:
        SetupStore.handleConfigureUpdateFieldError(action.data);
        SetupStore.checkFormCompletion();
        break;
      case ActionTypes.CONFIGURE_UPDATE_FIELD_SUCCESS:
        SetupStore.handleConfigureUpdateFieldSuccess(action.data);
        SetupStore.checkFormCompletion();
        break;
      case ActionTypes.CONFIGURE_UPDATE_FIELD_ONGOING:
        SetupStore.handleOngoingConfigureUpdateFieldRequest();
        break;
      case ActionTypes.SET_INSTALL_TYPE_ERROR:
        SetupStore.handleSetInstallTypeError(action.data.response);
        break;
      case ActionTypes.SET_INSTALL_TYPE_SUCCESS:
        SetupStore.handleSetInstallTypeSuccess(action.data);
        break;
    }

    return true;
  })

});

module.exports = SetupStore;
