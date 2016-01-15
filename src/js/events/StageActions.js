import RequestUtil from './RequestUtil';

import ActionTypes from './ActionTypes';
import AppDispatcher from './AppDispatcher';
import Config from '../config/Config';

const StageActions = {
  fetchStageStatus: function (stage) {
    RequestUtil.json({
      url: `${Config.rootUrl}${Config.apiPrefex}/actions/${stage}`,
      success: function (response) {
        AppDispatcher.handleServerAction({
          type: ActionTypes[`${stage}_UPDATE_SUCCESS`],
          data: response
        });
      },
      error: function (xhr) {
        AppDispatcher.handleServerAction({
          type: ActionTypes[`${stage}_UPDATE_ERROR`],
          data: xhr
        });
      }
    });
  },

  beginStage: function (stage) {
    RequestUtil.json({
      url: `${Config.rootUrl}${Config.apiPrefex}/actions/${stage}`,
      method: 'post'
    });
  },

  fetchLogs: function (stage) {
    RequestUtil.json({
      url: `${Config.rootUrl}${Config.apiPrefex}/actions/${stage}/logs`,
      success: function (response) {
        AppDispatcher.handleServerAction({
          type: ActionTypes[`${stage}_LOGS_SUCCESS`],
          data: response
        });
      },
      error: function (xhr) {
        AppDispatcher.handleServerAction({
          type: ActionTypes[`${stage}_LOGS_ERROR`],
          data: xhr
        });
      }
    });
  },

  fetchCurrentStage: function () {
    RequestUtil.json({
      url: `${Config.rootUrl}${Config.apiPrefex}/actions/current`,
      success: function (response) {
        AppDispatcher.handleServerAction({
          type: ActionTypes.CURRENT_STAGE_CHANGE_SUCCESS,
          data: response
        });
      },
      error: function (xhr) {
        AppDispatcher.handleServerAction({
          type: ActionTypes.CURRENT_STAGE_CHANGE_ERROR,
          data: xhr
        });
      }
    });
  }
};

module.exports = StageActions;
