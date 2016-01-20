import {GetSetMixin, Store} from 'mesosphere-shared-reactjs';

import ActionTypes from '../constants/ActionTypes';
import AppDispatcher from '../events/AppDispatcher';
import EventTypes from '../constants/EventTypes';
import ConfigActions from '../events/ConfigActions';

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
      errors: null
    });

    this.fetchConfigType();
    this.fetchConfig();
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

  handleConfigureChangeSuccess: function (data) {
    this.set({currentConfig: data});
    this.emit(EventTypes.CONFIGURE_CHANGE_SUCCESS);
  },

  handleConfigureChangeError: function (data) {
    this.set({currentConfigError: data});
    this.emit(EventTypes.CONFIGURE_CHANGE_ERROR);
  },

  handleConfigureStatusChangeError: function (data) {
    this.set({errors: data.response});
    this.emit(EventTypes.CONFIGURE_STATUS_CHANGE_ERROR);
  },

  handleConfigureTypeError: function () {
    this.emit(EventTypes.CONFIGURE_TYPE_CHANGE_ERROR);
  },

  handleConfigureUpdateError: function (data) {
    this.set({errors: data.response});
    this.emit(EventTypes.CONFIGURE_UPDATE_ERROR);
  },

  processConfigureTypeResponse: function (data) {
    this.set({configType: data});
    this.emit(EventTypes.CONFIGURE_TYPE_CHANGE_SUCCESS);
  },

  processConfigureUpdateResponse: function (data) {
    if (data.errors) {
      this.set({
        completed: false,
        errors: data.errors
      });
    } else {
      this.set({
        completed: true,
        errors: null
      });
    }

    this.emit(EventTypes.CONFIGURE_UPDATE_SUCCESS);
  },

  dispatcherIndex: AppDispatcher.register(function (payload) {
    let {action} = payload;

    switch (action.type) {
      case ActionTypes.CONFIGURE_CHANGE_ERROR:
        SetupStore.handleConfigureChangeError(action.data);
        break;
      case ActionTypes.CONFIGURE_CHANGE_SUCCESS:
        SetupStore.handleConfigureChangeSuccess(action.data);
        break;
      case ActionTypes.CONFIGURE_STATUS_CHANGE_ERROR:
        SetupStore.handleConfigureStatusChangeError(action.data);
        break;
      case ActionTypes.CONFIGURE_STATUS_CHANGE_SUCCESS:
        SetupStore.processConfigureUpdateResponse(action.data);
        break;
      case ActionTypes.CONFIGURE_TYPE_CHANGE_ERROR:
        SetupStore.handleConfigureTypeError(action.data);
        break;
      case ActionTypes.CONFIGURE_TYPE_CHANGE_SUCCESS:
        SetupStore.processConfigureTypeResponse(action.data);
        break;
      case ActionTypes.CONFIGURE_UPDATE_ERROR:
        SetupStore.handleConfigureUpdateError(action.data);
        break;
      case ActionTypes.CONFIGURE_UPDATE_SUCCESS:
        SetupStore.processConfigureUpdateResponse(action.data);
        break;
    }

    return true;
  })

});

module.exports = SetupStore;
