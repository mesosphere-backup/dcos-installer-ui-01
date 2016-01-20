import {RequestUtil} from 'mesosphere-shared-reactjs';

import ActionTypes from '../constants/ActionTypes';
import AppDispatcher from './AppDispatcher';
import Config from '../config/Config';

const HostActions = {
  fetchTotalSlaves: function () {
    RequestUtil.json({
      url: `${Config.rootUrl}${Config.apiPrefix}/total_slaves`,
      success: function (response) {
        AppDispatcher.handleServerAction({
          type: ActionTypes.TOTAL_SLAVES_SUCCESS,
          data: response
        });
      },
      error: function (xhr) {
        AppDispatcher.handleServerAction({
          type: ActionTypes.TOTAL_SLAVES_ERROR,
          data: xhr
        });
      }
    });
  },

  fetchTotalMasters: function () {
    RequestUtil.json({
      url: `${Config.rootUrl}${Config.apiPrefix}/total_masters`,
      success: function (response) {
        AppDispatcher.handleServerAction({
          type: ActionTypes.TOTAL_MASTERS_SUCCESS,
          data: response
        });
      },
      error: function (xhr) {
        AppDispatcher.handleServerAction({
          type: ActionTypes.TOTAL_MASTERS_ERROR,
          data: xhr
        });
      }
    });
  }
};

module.exports = HostActions;
