import _ from 'lodash';
import {GetSetMixin, Store} from 'mesosphere-shared-reactjs';

import ActionTypes from '../constants/ActionTypes';
import AppDispatcher from '../events/AppDispatcher';
import ConfigActions from '../events/ConfigActions';
import EventTypes from '../constants/EventTypes';
import ConfigFormFields from '../constants/ConfigFormFields';

let SetupStore = Store.createStore({
  storeID: 'setup',

  mixins: [GetSetMixin],

  init: function () {
    this.set({
      completed: false,
      configType: {
        type: null,
        message: null
      },
      currentConfig: null,
      currentConfigError: null,
      errors: {}
    });

    this.fetchConfig();
    this.fetchConfigState();
    this.fetchConfigType();
  },

  fetchConfig: ConfigActions.fetchConfig,

  fetchConfigState: ConfigActions.fetchConfigState,

  fetchConfigType: ConfigActions.fetchConfigType,

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
        console.log(`error in key ${key}`);
      }
    });

    console.log(`completed: ${this.get('completed')}`);

    this.emit(EventTypes.CONFIGURE_FORM_COMPLETION_CHANGE);
  },

  handleConfigureChangeSuccess: function (data) {
    let currentConfig = _.pick(data, ConfigFormFields);

    this.set({currentConfig});
    this.emit(EventTypes.CONFIGURE_CHANGE_SUCCESS);
  },

  handleConfigureChangeError: function (data) {
    this.set({currentConfigError: data});
    this.emit(EventTypes.CONFIGURE_CHANGE_ERROR);
  },

  handleConfigureStatusChangeError: function (data) {
    let errors = _.extend({}, this.get('errors'), data.response);
    this.set({errors});
    this.emit(EventTypes.CONFIGURE_STATUS_CHANGE_ERROR);
  },

  handleConfigureTypeError: function () {
    this.emit(EventTypes.CONFIGURE_TYPE_CHANGE_ERROR);
  },

  handleConfigureUpdateFieldError: function (data) {
    let errors = _.extend({}, this.get('errors'), data.response);
    this.set({errors});
    this.emit(EventTypes.CONFIGURE_UPDATE_FIELD_ERROR);
  },

  handleConfigureTypeResponse: function (data) {
    this.set({configType: data});
    this.emit(EventTypes.CONFIGURE_TYPE_CHANGE_SUCCESS);
  },

  handleConfigureStatusSuccess: function () {
    this.set({errors: {}});
    this.emit(EventTypes.CONFIGURE_STATUS_CHANGE_SUCCESS);
  },

  handleConfigureUpdateFieldSuccess: function (data) {
    let errors = this.get('errors');

    Object.keys(data).forEach((key) => {
      if (key === 'zk_exhibitor_hosts' || key === 'zk_exhibitor_port') {
        key === 'exhibitor_zk_hosts';
      } else if (key === 'ip_detect_script') {
        key === 'ip_detect_path';
      } else if (key === 'ssh_key') {
        key === 'ssh_key_path';
      }

      if (errors[key]) {
        delete(errors[key]);
      }
    });

    this.set({errors});
    this.emit(EventTypes.CONFIGURE_UPDATE_FIELD_SUCCESS);
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
      case ActionTypes.CONFIGURE_STATUS_CHANGE_ERROR:
        SetupStore.handleConfigureStatusChangeError(action.data);
        SetupStore.checkFormCompletion();
        break;
      case ActionTypes.CONFIGURE_STATUS_CHANGE_SUCCESS:
        SetupStore.handleConfigureStatusSuccess(action.data);
        SetupStore.checkFormCompletion();
        break;
      case ActionTypes.CONFIGURE_TYPE_CHANGE_ERROR:
        SetupStore.handleConfigureTypeError(action.data);
        break;
      case ActionTypes.CONFIGURE_TYPE_CHANGE_SUCCESS:
        SetupStore.handleConfigureTypeResponse(action.data);
        break;
      case ActionTypes.CONFIGURE_UPDATE_FIELD_ERROR:
        SetupStore.handleConfigureUpdateFieldError(action.data);
        SetupStore.checkFormCompletion();
        break;
      case ActionTypes.CONFIGURE_UPDATE_FIELD_SUCCESS:
        SetupStore.handleConfigureUpdateFieldSuccess(action.data);
        SetupStore.checkFormCompletion();
        break;
    }

    return true;
  })

});

module.exports = SetupStore;
