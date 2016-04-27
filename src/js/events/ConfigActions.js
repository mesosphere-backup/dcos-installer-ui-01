import {RequestUtil} from 'mesosphere-shared-reactjs';

import ActionTypes from '../constants/ActionTypes';
import AppDispatcher from './AppDispatcher';
import Config from '../config/Config';

const ConfigActions = {
  fetchConfig: function () {
    RequestUtil.json({
      url: `${Config.rootUrl}${Config.apiPrefix}configure`,
      success: function (response) {
        AppDispatcher.handleServerAction({
          type: ActionTypes.CONFIGURE_CHANGE_SUCCESS,
          data: response
        });
      },
      error: function (xhr) {
        AppDispatcher.handleServerAction({
          type: ActionTypes.CONFIGURE_CHANGE_ERROR,
          data: {
            response: RequestUtil.parseResponseBody(xhr)
          }
        });
      },
      hangingRequestCallback: function () {
        AppDispatcher.handleServerAction({
          type: ActionTypes.CONFIGURE_CHANGE_ONGOING
        });
      },
      timeout: Config.requestTimeout
    });
  },

  fetchConfigState: function () {
    RequestUtil.json({
      url: `${Config.rootUrl}${Config.apiPrefix}configure/status`,
      success: function (response) {
        AppDispatcher.handleServerAction({
          type: ActionTypes.CONFIGURE_STATUS_CHANGE_SUCCESS,
          data: response
        });
      },
      error: function (xhr) {
        AppDispatcher.handleServerAction({
          type: ActionTypes.CONFIGURE_STATUS_CHANGE_ERROR,
          data: {
            response: RequestUtil.parseResponseBody(xhr)
          }
        });
      },
      hangingRequestCallback: function () {
        AppDispatcher.handleServerAction({
          type: ActionTypes.CONFIGURE_STATUS_CHANGE_ONGOING
        });
      },
      timeout: Config.requestTimeout
    });
  },

  fetchConfigType: function () {
    RequestUtil.json({
      url: `${Config.rootUrl}${Config.apiPrefix}configure/type`,
      success: function (response) {
        AppDispatcher.handleServerAction({
          type: ActionTypes.CONFIGURE_TYPE_CHANGE_SUCCESS,
          data: response
        });
      },
      error: function (xhr) {
        AppDispatcher.handleServerAction({
          type: ActionTypes.CONFIGURE_TYPE_CHANGE_ERROR,
          data: {
            response: RequestUtil.parseResponseBody(xhr)
          }
        });
      },
      hangingRequestCallback: function () {
        AppDispatcher.handleServerAction({
          type: ActionTypes.CONFIGURE_TYPE_CHANGE_ONGOING
        });
      },
      timeout: Config.requestTimeout
    });
  },

  updateConfig: function (data) {
    RequestUtil.json({
      url: `${Config.rootUrl}${Config.apiPrefix}configure`,
      method: 'post',
      data,
      success: function () {
        AppDispatcher.handleServerAction({
          type: ActionTypes.CONFIGURE_UPDATE_FIELD_SUCCESS,
          data
        });
      },
      error: function (xhr) {
        AppDispatcher.handleServerAction({
          type: ActionTypes.CONFIGURE_UPDATE_FIELD_ERROR,
          data: {
            response: RequestUtil.parseResponseBody(xhr),
            request: data
          }
        });
      },
      hangingRequestCallback: function () {
        AppDispatcher.handleServerAction({
          type: ActionTypes.CONFIGURE_UPDATE_FIELD_ONGOING
        });
      },
      timeout: Config.requestTimeout
    });
  }
};

module.exports = ConfigActions;
